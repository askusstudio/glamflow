import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  expectedAmount: number;
}

export const RazorpayPaymentDialog = ({ 
  isOpen, 
  onClose, 
  providerId, 
  providerName,
  expectedAmount 
}: RazorpayPaymentDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [customAmount, setCustomAmount] = useState(''); // User enters amount here

  const amount = parseFloat(customAmount) || 0; // Parse user input for display/validation

  useEffect(() => {
    // Load Razorpay script only if not already present
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => console.log('Razorpay script loaded');
      document.body.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  const handlePayment = async () => {
    if (!payerName || !payerEmail || !payerPhone || !customAmount || amount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all your details including a valid amount",
        variant: "destructive",
      });
      return;
    }

    // Validate Indian phone number (+91 followed by 10 digits)
    if (!/^\+91\d{10}$/.test(payerPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number starting with +91",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue",
          variant: "destructive",
        });
        return;
      }

      // Create Razorpay order - send amount in paise to backend
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount: amount * 1, // Convert to paise for Razorpay
          providerId,
          payerName,
          payerEmail,
          payerPhone,
          userId: session.user.id, // Pass user ID for security
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      console.log('Order data:', data); // Debug log

      // Initialize Razorpay payment
      const options = {
        key: data.keyId,
        amount: data.amount, // Use backend-provided amount (in paise)
        currency: data.currency,
        name: 'Freelancer Payment',
        description: `Payment of ₹${amount.toFixed(2)} to ${providerName}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: amount * 100, // Pass amount in paise for verification
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              throw new Error(verifyError?.message || 'Verification failed');
            }

            // Optional: Update booking status in DB (add bookingId prop if needed)
            // await supabase.from('bookings').update({ payment_status: 'paid' }).eq('id', bookingId);

            toast({
              title: "Payment Successful",
              description: `Your payment of ₹${amount.toFixed(2)} has been completed`,
            });

            onClose();
          } catch (err) {
            console.error('Payment verification error:', err);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: payerName,
          email: payerEmail,
          contact: payerPhone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || 'Payment was declined',
          variant: "destructive",
        });
        setLoading(false);
        onClose(); // Close dialog on failure
      });
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay {providerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Pay (Suggested: ₹{expectedAmount.toFixed(2)})</Label>
            <Input 
              id="amount"
              type="number"
              step="0.01"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={`Enter amount (e.g., ${expectedAmount.toFixed(2)})`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              type="tel"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value)}
              placeholder="+91 1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label>Selected Amount</Label>
            <Input 
              value={`₹${amount.toFixed(2)}`} 
              disabled 
              className="text-lg font-semibold"
            />
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={handlePayment} 
              disabled={loading || !payerName || !payerEmail || !payerPhone || !customAmount || amount <= 0}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with Razorpay'
              )}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
