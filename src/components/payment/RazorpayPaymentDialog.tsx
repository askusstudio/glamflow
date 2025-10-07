import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [paymentType, setPaymentType] = useState<'advance' | 'final'>('advance');
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerPhone, setPayerPhone] = useState('');

  const amount = paymentType === 'advance' 
    ? expectedAmount * 0.25 
    : expectedAmount * 0.75;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!payerName || !payerEmail || !payerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all your details",
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

      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount,
          providerId,
          paymentType,
          payerName,
          payerEmail,
          payerPhone,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Freelancer Payment',
        description: `${paymentType === 'advance' ? 'Advance' : 'Final'} payment to ${providerName}`,
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
                },
              }
            );

            if (verifyError) throw verifyError;

            toast({
              title: "Payment Successful",
              description: `Your ${paymentType} payment of ₹${amount} has been completed`,
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
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
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
            <Label>Payment Type</Label>
            <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as 'advance' | 'final')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advance" id="advance" />
                <Label htmlFor="advance" className="font-normal">
                  Advance Payment (25%) - ₹{(expectedAmount * 0.25).toFixed(2)}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="final" id="final" />
                <Label htmlFor="final" className="font-normal">
                  Final Payment (75%) - ₹{(expectedAmount * 0.75).toFixed(2)}
                </Label>
              </div>
            </RadioGroup>
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
            <Label>Amount to Pay</Label>
            <Input 
              value={`₹${amount.toFixed(2)}`} 
              disabled 
              className="text-lg font-semibold"
            />
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={handlePayment} 
              disabled={loading || !payerName || !payerEmail || !payerPhone}
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
