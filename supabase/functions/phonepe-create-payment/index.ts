import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { amount, appointmentId, serviceDetails } = await req.json();

    // PhonePe credentials (to be filled by user)
    const MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'YOUR_MERCHANT_ID';
    const SALT_KEY = Deno.env.get('PHONEPE_SALT_KEY') || 'YOUR_SALT_KEY';
    const SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';
    const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox'; // Change to production URL later

    // Generate unique merchant transaction ID
    const merchantTransactionId = `TXN_${Date.now()}_${user.id.substring(0, 8)}`;
    const merchantUserId = user.id;

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        appointment_id: appointmentId,
        user_id: user.id,
        amount: amount,
        currency: 'INR',
        phonepe_merchant_transaction_id: merchantTransactionId,
        payment_status: 'initiated',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      throw paymentError;
    }

    // PhonePe payment request payload
    const paymentPayload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/phonepe-verify-payment?merchantTransactionId=${merchantTransactionId}`,
      redirectMode: 'POST',
      callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/phonepe-webhook`,
      mobileNumber: serviceDetails?.phone || '',
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    // Base64 encode the payload
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Generate X-VERIFY header (SHA256 hash)
    const stringToHash = base64Payload + '/pg/v1/pay' + SALT_KEY;
    const sha256Hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(stringToHash)
    );
    const hashArray = Array.from(new Uint8Array(sha256Hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const xVerify = `${hashHex}###${SALT_INDEX}`;

    console.log('Initiating PhonePe payment:', merchantTransactionId);

    // Call PhonePe API
    const phonePeResponse = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const phonePeData = await phonePeResponse.json();
    console.log('PhonePe response:', phonePeData);

    if (phonePeData.success) {
      // Update payment record with PhonePe response
      await supabaseClient
        .from('payments')
        .update({
          payment_response: phonePeData,
        })
        .eq('id', payment.id);

      return new Response(
        JSON.stringify({
          success: true,
          paymentUrl: phonePeData.data.instrumentResponse.redirectInfo.url,
          merchantTransactionId: merchantTransactionId,
          paymentId: payment.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(phonePeData.message || 'PhonePe payment initiation failed');
    }
  } catch (error) {
    console.error('Error in phonepe-create-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
