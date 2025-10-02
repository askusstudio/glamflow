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
    const webhookData = await req.json();
    console.log('PhonePe webhook received:', webhookData);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook signature
    const SALT_KEY = Deno.env.get('PHONEPE_SALT_KEY') || 'YOUR_SALT_KEY';
    const xVerifyHeader = req.headers.get('X-VERIFY');
    
    if (xVerifyHeader) {
      const [receivedHash] = xVerifyHeader.split('###');
      const base64Response = webhookData.response;
      
      const stringToHash = base64Response + SALT_KEY;
      const sha256Hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(stringToHash)
      );
      const hashArray = Array.from(new Uint8Array(sha256Hash));
      const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (receivedHash !== computedHash) {
        console.error('Webhook signature verification failed');
        throw new Error('Invalid webhook signature');
      }
    }

    // Decode the response
    const decodedResponse = JSON.parse(atob(webhookData.response));
    const merchantTransactionId = decodedResponse.data?.merchantTransactionId;
    const paymentStatus = decodedResponse.success && decodedResponse.code === 'PAYMENT_SUCCESS'
      ? 'success'
      : 'failed';

    console.log('Processing webhook for transaction:', merchantTransactionId);

    // Update payment status
    const { data: payment } = await supabaseClient
      .from('payments')
      .update({
        payment_status: paymentStatus,
        phonepe_transaction_id: decodedResponse.data?.transactionId,
        callback_data: decodedResponse,
      })
      .eq('phonepe_merchant_transaction_id', merchantTransactionId)
      .select()
      .single();

    if (payment && payment.appointment_id) {
      // Update appointment
      await supabaseClient
        .from('appointments')
        .update({
          payment_status: paymentStatus,
        })
        .eq('id', payment.appointment_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in phonepe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
