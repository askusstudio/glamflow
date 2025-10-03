-- Create payments table to track all PhonePe transactions
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  phonepe_transaction_id text,
  phonepe_merchant_transaction_id text UNIQUE NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_method text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  payment_response jsonb,
  callback_data jsonb
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
ON public.payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments"
ON public.payments
FOR UPDATE
USING (true);

-- Add payment fields to appointments table
ALTER TABLE public.appointments
ADD COLUMN amount numeric(10,2),
ADD COLUMN payment_status text DEFAULT 'pending',
ADD COLUMN payment_id uuid REFERENCES public.payments(id);

-- Add pricing fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN hourly_rate numeric(10,2),
ADD COLUMN service_pricing jsonb;

-- Create index for faster lookups
CREATE INDEX idx_payments_merchant_transaction_id ON public.payments(phonepe_merchant_transaction_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);

-- Trigger for updating payments updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();