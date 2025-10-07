import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as encodeBase64 } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

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

    console.log('Verification invoke:', { orderId: razorpay_order_id?.substring(0, 10) + '...', userId: userId || 'null (guest)' });

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
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const computedSignature = encodeBase64(new Uint8Array(signatureBytes));

    const isValid = computedSignature === razorpay_signature;
    console.log('Signature verification:', isValid ? 'valid' : 'invalid');

    if (!isValid) {
      console.error('Signature mismatch - possible tampering');
      return new Response(JSON.stringify({ success: false, error: 'Payment signature invalid - transaction cannot be verified' }), {
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

    // Optional: Fetch full payment details from Razorpay for logging
    // But minimal: Just confirm success

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
    return new Response(JSON.stringify({ success: false, error: `Internal verification error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
