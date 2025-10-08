import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, userId } = body;

    console.log('Verification invoke:', { 
      orderId: razorpay_order_id?.substring(0, 10) + '...', 
      paymentId: razorpay_payment_id?.substring(0, 10) + '...',
      amount, 
      userId: userId || 'null (guest)' 
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
      console.error('Invalid verification params:', { razorpay_order_id, razorpay_payment_id, amount });
      return new Response(JSON.stringify({ success: false, error: 'Missing or invalid verification parameters (order_id, payment_id, signature, amount required)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supabase client (only for authenticated users' DB update - service_role bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();

    if (!keySecret) {
      console.error('Razorpay key secret missing from Deno.env.get()');
      return new Response(JSON.stringify({ success: false, error: 'Server configuration error - contact support (secret not set)' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify Razorpay signature: HMAC-SHA256(order_id|payment_id) == signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    console.log('Payload for HMAC:', payload);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    
    // Convert to hex (Razorpay uses hex, not base64!)
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Debug: Log partial signatures (masked for security)
    const computedPartial = computedSignature.substring(0, 10) + '...';
    const receivedPartial = razorpay_signature.substring(0, 10) + '...';
    console.log('Computed signature (partial):', computedPartial);
    console.log('Received signature (partial):', receivedPartial);
    console.log('Amount matches order?', 'N/A for signature');  // Signature doesn't use amount

    const isValid = computedSignature === razorpay_signature;
    console.log('Signature verification result:', isValid ? 'valid' : 'invalid');

    if (!isValid) {
      console.error('Signature mismatch - possible tampering or key error. Computed:', computedPartial, 'vs Received:', receivedPartial);
      return new Response(JSON.stringify({ success: false, error: 'Payment signature invalid - transaction cannot be verified (check server keys)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Signature valid - now handle DB update (optional for guests)
    let dbUpdated = false;
    if (userId) {
      try {
        const { error: dbError } = await supabaseClient
          .from('payments')
          .update({ 
            payment_id: razorpay_payment_id,
            status: 'paid',
            verified_at: new Date().toISOString(),
            amount: amount // Confirm amount matches
          })
          .eq('order_id', razorpay_order_id) // Match by order_id from create
          .eq('user_id', userId);
        if (dbError) throw dbError;
        dbUpdated = true;
        console.log('DB updated for user:', userId, 'order:', razorpay_order_id);
      } catch (dbError) {
        console.error('DB update error (non-fatal):', dbError);
        // Still return success if Razorpay verified
      }
    } else {
      console.log('Guest verification: Signature valid, no DB update (track via payment_id if needed)');
      // Optional: Insert to guest_payments table here
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      dbUpdated,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Verification unhandled error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal verification error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
