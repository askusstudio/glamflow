-- Create bank_details table for storing user bank account information
CREATE TABLE public.bank_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_holder_name text NOT NULL,
  account_number text NOT NULL,
  ifsc_code text NOT NULL,
  bank_name text NOT NULL,
  branch_name text,
  account_type text NOT NULL DEFAULT 'savings',
  pan_number text NOT NULL,
  gst_number text,
  upi_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

-- Users can view their own bank details
CREATE POLICY "Users can view their own bank details"
ON public.bank_details
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own bank details
CREATE POLICY "Users can insert their own bank details"
ON public.bank_details
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bank details
CREATE POLICY "Users can update their own bank details"
ON public.bank_details
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_bank_details_updated_at
BEFORE UPDATE ON public.bank_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add account_balance to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_balance numeric DEFAULT 0;

-- Create withdrawals table to track withdrawal requests
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  bank_details_id uuid REFERENCES public.bank_details(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone,
  notes text
);

-- Enable RLS on withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Users can view their own withdrawals
CREATE POLICY "Users can view their own withdrawals"
ON public.withdrawals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own withdrawal requests
CREATE POLICY "Users can create withdrawal requests"
ON public.withdrawals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);