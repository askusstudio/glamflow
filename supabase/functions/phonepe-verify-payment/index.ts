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
    const url = new URL(req.url);
    const merchantTransactionId = url.searchParams.get('merchantTransactionId');

    if (!merchantTransactionId) {
      throw new Error('Missing merchant transaction ID');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // PhonePe credentials
    const MERCHANT_ID = Deno.env.get('PHONEPE_MERCHANT_ID') || 'YOUR_MERCHANT_ID';
    const SALT_KEY = Deno.env.get('PHONEPE_SALT_KEY') || 'YOUR_SALT_KEY';
    const SALT_INDEX = Deno.env.get('PHONEPE_SALT_INDEX') || '1';
    const PHONEPE_BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    // Generate X-VERIFY header for status check
    const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;
    const sha256Hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(stringToHash)
    );
    const hashArray = Array.from(new Uint8Array(sha256Hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const xVerify = `${hashHex}###${SALT_INDEX}`;

    console.log('Checking payment status:', merchantTransactionId);

    // Check payment status with PhonePe
    const statusResponse = await fetch(
      `${PHONEPE_BASE_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': MERCHANT_ID,
        },
      }
    );

    const statusData = await statusResponse.json();
    console.log('PhonePe status response:', statusData);

    // Update payment record
    const paymentStatus = statusData.success && statusData.code === 'PAYMENT_SUCCESS' 
      ? 'success' 
      : 'failed';

    const { data: payment } = await supabaseClient
      .from('payments')
      .update({
        payment_status: paymentStatus,
        phonepe_transaction_id: statusData.data?.transactionId,
        callback_data: statusData,
      })
      .eq('phonepe_merchant_transaction_id', merchantTransactionId)
      .select()
      .single();

    if (payment && payment.appointment_id) {
      // Update appointment payment status
      await supabaseClient
        .from('appointments')
        .update({
          payment_status: paymentStatus,
          payment_id: payment.id,
        })
        .eq('id', payment.appointment_id);
    }

    // Redirect to frontend with status
    const redirectUrl = `${Deno.env.get('SUPABASE_URL').replace('https://', 'https://')}/payment-status?status=${paymentStatus}&transactionId=${merchantTransactionId}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Error in phonepe-verify-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
