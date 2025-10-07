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
  const [payerPhone, setPayerPhone] = useState(''); // Raw input (10 digits)
  const [customAmount, setCustomAmount] = useState(''); // User enters amount here

  const amount = parseFloat(customAmount) || 0; // Parse user input for display/validation
  const formattedPhone = payerPhone.length === 10 ? `+91${payerPhone}` : payerPhone; // Auto-prepend +91 for 10 digits

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
    if (!payerName || !payerEmail || !formattedPhone || !customAmount || amount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all your details including a valid amount",
        variant: "destructive",
      });
      return;
    }

    // Validate Indian phone (auto-format if needed)
    const phoneToValidate = formattedPhone.startsWith('+91') ? formattedPhone : `+91${formattedPhone}`;
    if (!/^\+91\d{10}$/.test(phoneToValidate)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian phone number (e.g., 1234567890)",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get session if available (optional for guest payments)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null; // Null for guests

      if (!session) {
        console.log('Guest payment initiated'); // Debug
        toast({
          title: "Guest Payment",
          description: "Proceeding without login - payment will be tracked via email/phone.",
        });
      }

      // Create Razorpay order - send amount in paise to backend
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount: amount * 100, // Fixed: Convert rupees to paise
          providerId,
          payerName,
          payerEmail,
          payerPhone: formattedPhone, // Use formatted phone
          userId: userId, // Explicitly null for guests (easier backend handling)
        },
      });

      if (error) {
        console.error('Create order error details:', error); // Full error for debugging
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
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
                  amount: amount * 100, // Consistent paise for verification
                  userId: userId, // Explicit null for guests
                },
              }
            );

            if (verifyError) {
              console.error('Verify error details:', verifyError);
              throw verifyError;
            }

            if (!verifyData?.success) {
              throw new Error(verifyData?.error || 'Verification failed');
            }

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
          contact: formattedPhone, // Prefill with auto-formatted phone
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
      console.error('Payment error details:', error); // Enhanced logging
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
      <DialogContent className="w-full max-w-sm sm:max-w-md p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg sm:text-xl text-center sm:text-left">
            Pay {providerName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">
              Amount to Pay (Suggested: ₹{expectedAmount.toFixed(2)})
            </Label>
            <Input 
              id="amount"
              type="number"
              step="0.01"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={`Enter amount (e.g., ${expectedAmount.toFixed(2)})`}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Your Name
            </Label>
            <Input 
              id="name"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input 
              id="email"
              type="email"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">
              Phone Number
            </Label>
            <Input 
              id="phone"
              type="tel"
              value={payerPhone}
              onChange={(e) => setPayerPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit number (e.g., 1234567890)"
              maxLength={10}
              className="w-full"
            />
            {payerPhone.length === 10 && (
              <p className="text-xs text-muted-foreground mt-1">
                Formatted: {formattedPhone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Selected Amount</Label>
            <Input 
              value={`₹${amount.toFixed(2)}`} 
              disabled 
              className="text-base sm:text-lg font-semibold w-full"
            />
          </div>

          <div className="pt-3 sm:pt-4 space-y-2">
            <Button 
              onClick={handlePayment} 
              disabled={loading || !payerName || !payerEmail || !payerPhone || payerPhone.length !== 10 || amount <= 0}
              className="w-full h-12 sm:h-10 text-sm"
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
              className="w-full h-12 sm:h-10 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
