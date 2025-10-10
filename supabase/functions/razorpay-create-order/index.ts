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

    const { amount, providerId, payerName, payerEmail, payerPhone, userId } = body;

    console.log('Invoke details:', { amount, userId: userId || 'null (guest)', payerEmail: payerEmail?.substring(0, 10) + '...' });

    if (!amount || typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
      console.error('Invalid amount format:', amount);
      return new Response(JSON.stringify({ success: false, error: 'Amount must be a positive integer in paise (e.g., 10000 for ₹100)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!payerName?.trim() || !payerEmail?.trim() || !payerPhone?.trim()) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required payer details (name, email, phone)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supabase client (only for authenticated users' DB insert - service_role bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')?.trim();
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();

    if (!keyId || !keySecret) {
      console.error('Razorpay env vars missing or empty from Deno.env.get()');
      return new Response(JSON.stringify({ success: false, error: 'Server configuration error - contact support (keys not set)' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Safe Basic Auth for Razorpay (URL-safe base64 for special chars in secret)
    const authString = `${keyId}:${keySecret}`;
    const authBase64 = btoa(unescape(encodeURIComponent(authString)));

    console.log('Razorpay auth setup with keyId:', keyId.substring(0, 10) + '...');

    // Sanitize and shorten providerId for receipt (alphanumeric + -_. only, max 10 chars)
    const safeProviderId = (providerId || 'guest').toString().replace(/[^a-zA-Z0-9\-_.]/g, '').substring(0, 10);
    // Short timestamp: Last 6 chars of Date.now() in base-36 (compact, unique)
    const shortTs = Date.now().toString(36).slice(-6);
    const receipt = `pay_${safeProviderId}_${shortTs}`;
    
    if (receipt.length > 40) {
      console.error('Receipt too long:', receipt);
      return new Response(JSON.stringify({ success: false, error: 'Internal receipt generation error - contact support' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generated receipt:', receipt, '(length:', receipt.length, ')');

    // Razorpay order creation
    console.log('Fetching Razorpay API...');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount, // Integer paise from frontend
        currency: 'INR',
        receipt, // Now compliant (<=40 chars)
        notes: {
          providerId,
          payerName,
          payerEmail,
          payerPhone,
          ...(userId && { userId }),
        },
      }),
    });

    // Handle Razorpay response
    if (!razorpayResponse.ok) {
      let errorData: any = {};
      try {
        errorData = await razorpayResponse.json();
      } catch {
        // Non-JSON (e.g., raw 401 text)
        errorData = { error: { description: `HTTP ${razorpayResponse.status}: ${await razorpayResponse.text()}` } };
      }
      const errorDesc = errorData?.error?.description || errorData?.description || 'Unknown Razorpay error';
      const errorCode = errorData?.error?.code || razorpayResponse.status;
      console.error(`Razorpay API failed (${razorpayResponse.status} ${errorCode}):`, errorDesc, errorData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Payment gateway error: ${errorDesc}`,
        code: errorCode,
        details: errorData // For debugging
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay success:', { orderId: order.id, amount: order.amount, receipt });

    // Insert payment record for both authenticated users and guests
    let dbLogged = false;
    try {
      const paymentData = {
        appointment_id: null, // Will be set if appointment booking
        user_id: userId || null, // Null for guests
        amount: order.amount / 100, // Convert paise back to rupees for storage
        currency: 'INR',
        payment_status: 'pending',
        payment_method: 'razorpay',
        razorpay_order_id: order.id,
        razorpay_payment_id: null, // Will be set after payment success
        razorpay_signature: null, // Will be set after payment verification
        payment_type: null, // Can be set based on context (advance, final, etc.)
        payer_name: payerName,
        payer_email: payerEmail,
        payer_phone: payerPhone,
        provider_id: providerId,
        payment_receipt: receipt,
        callback_data: null, // Can store callback data if needed
        verified_at: null, // Will be set after verification
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: insertData, error: dbError } = await supabaseClient
        .from('payments')
        .insert(paymentData)
        .select('id')
        .single();

      if (dbError) throw dbError;
      dbLogged = true;
      console.log('Payment record created:', insertData?.id, 'for user:', userId || 'guest');
    } catch (dbError) {
      console.error('DB insert error:', dbError);
      // Continue with payment even if DB insert fails
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      keyId,
      amount: order.amount,
      currency: 'INR',
      dbLogged,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function unhandled error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
