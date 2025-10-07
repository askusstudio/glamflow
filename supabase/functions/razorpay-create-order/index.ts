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

    // Razorpay order creation (line ~22 - this is where Unauthorized fails)
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
        receipt: `receipt_${Date.now()}_${providerId || 'guest'}`,
        notes: {
          providerId,
          payerName,
          payerEmail,
          payerPhone,
          ...(userId && { userId }),
        },
      }),
    });

    // Handle Razorpay response (401 Unauthorized common here)
    if (!razorpayResponse.ok) {
      let errorData = {};
      try {
        errorData = await razorpayResponse.json();
      } catch {
        // Non-JSON (e.g., raw 401 text)
        errorData = { error: { description: `HTTP ${razorpayResponse.status}: ${await razorpayResponse.text()}` } };
      }
      const errorDesc = errorData.error?.description || errorData.description || 'Unknown Razorpay error';
      const errorCode = errorData.error?.code || razorpayResponse.status;
      console.error(`Razorpay API failed (${razorpayResponse.status} ${errorCode}):`, errorDesc, errorData);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Payment gateway error: ${errorDesc} (check keys or amount)`,
        code: errorCode,
        details: errorData // Logs full details
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay success:', { orderId: order.id, amount: order.amount });

    // DB logging only for authenticated (skip for guests to avoid issues)
    let dbLogged = false;
    if (userId) {
      try {
        const { error: dbError } = await supabaseClient
          .from('payments')
          .insert({ 
            order_id: order.id, 
            amount: order.amount, 
            provider_id: providerId,
            user_id: userId,
            payer_name: payerName,
            payer_email: payerEmail,
            payer_phone: payerPhone,
            status: 'created'
          });
        if (dbError) throw dbError;
        dbLogged = true;
        console.log('DB logged for user:', userId);
      } catch (dbError) {
        console.error('DB error (non-fatal):', dbError);
      }
    } else {
      console.log('Guest: No DB logging (payment successful without user tracking)');
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
    return new Response(JSON.stringify({ success: false, error: `Internal error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
