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

    const { razorpay_order_id, error_description, error_code } = body;

    console.log('Payment failed:', { 
      orderId: razorpay_order_id?.substring(0, 10) + '...', 
      errorCode: error_code,
      errorDescription: error_description?.substring(0, 50) + '...'
    });

    if (!razorpay_order_id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing razorpay_order_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supabase client for updating payment status
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Update payment status to failed
    let dbUpdated = false;
    try {
      const updateData = {
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
        callback_data: {
          razorpay_order_id,
          error_code,
          error_description,
          failed_at: new Date().toISOString()
        }
      };

      const { data: updateResult, error: dbError } = await supabaseClient
        .from('payments')
        .update(updateData)
        .eq('razorpay_order_id', razorpay_order_id)
        .select('id, user_id')
        .single();

      if (dbError) {
        console.error('DB update error:', dbError);
      } else {
        dbUpdated = true;
        console.log('Payment marked as failed:', updateResult?.id);
      }
    } catch (dbError) {
      console.error('DB update error (non-fatal):', dbError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment failure logged',
      dbUpdated,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Payment failure handler error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
