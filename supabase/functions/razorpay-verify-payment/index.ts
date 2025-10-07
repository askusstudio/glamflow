import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    console.log('Verifying Razorpay payment:', { razorpay_order_id, razorpay_payment_id });

    // Get Razorpay secret
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret not configured');
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(RAZORPAY_KEY_SECRET);
    const messageData = encoder.encode(text);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const computedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = computedSignature === razorpay_signature;

    if (!isValid) {
      console.error('Invalid signature');
      throw new Error('Invalid payment signature');
    }

    console.log('Payment signature verified successfully');

    // Update payment status
    const { data: payment, error: fetchError } = await supabaseClient
      .from('payments')
      .select('*, provider_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (fetchError || !payment) {
      console.error('Payment not found:', fetchError);
      throw new Error('Payment record not found');
    }

    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        payment_status: 'success',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      throw new Error('Failed to update payment status');
    }

    // Create notification for provider
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: payment.provider_id,
        title: 'Payment Received',
        message: `${payment.payer_name} has paid ₹${payment.amount} (${payment.payment_type} payment)`,
        type: 'payment',
        payment_id: payment.id,
      });

    if (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ success: true, paymentId: payment.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in razorpay-verify-payment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
