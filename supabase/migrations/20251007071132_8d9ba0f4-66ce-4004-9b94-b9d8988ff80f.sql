-- Add expected payment amount to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS expected_payment_amount numeric DEFAULT 0;

-- Update payments table for Razorpay
ALTER TABLE public.payments
DROP COLUMN IF EXISTS phonepe_transaction_id,
DROP COLUMN IF EXISTS phonepe_merchant_transaction_id,
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text,
ADD COLUMN IF NOT EXISTS payment_type text CHECK (payment_type IN ('advance', 'final')),
ADD COLUMN IF NOT EXISTS payer_name text,
ADD COLUMN IF NOT EXISTS payer_email text,
ADD COLUMN IF NOT EXISTS payer_phone text,
ADD COLUMN IF NOT EXISTS provider_id uuid REFERENCES public.profiles(id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  payment_id uuid REFERENCES public.payments(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text,
  payer_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(payment_id)
);

-- Enable RLS on feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Feedback policies
CREATE POLICY "Anyone can create feedback"
ON public.feedback
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Providers can view their feedback"
ON public.feedback
FOR SELECT
USING (auth.uid() = provider_id);

CREATE POLICY "Public can view feedback"
ON public.feedback
FOR SELECT
USING (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_feedback_provider_id ON public.feedback(provider_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);