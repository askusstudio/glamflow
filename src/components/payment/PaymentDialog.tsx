import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  serviceDetails: {
    serviceName: string;
    amount: number;
    providerName: string;
  };
}

export const PaymentDialog = ({ isOpen, onClose, appointmentId, serviceDetails }: PaymentDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('phonepe-create-payment', {
        body: {
          amount: serviceDetails.amount,
          appointmentId: appointmentId,
          serviceDetails: {
            name: serviceDetails.serviceName,
            provider: serviceDetails.providerName,
          },
        },
      });

      if (error) throw error;

      if (data.success && data.paymentUrl) {
        // Redirect to PhonePe payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment. Please try again.",
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
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Service Provider</Label>
            <Input value={serviceDetails.providerName} disabled />
          </div>

          <div className="space-y-2">
            <Label>Service</Label>
            <Input value={serviceDetails.serviceName} disabled />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input 
              value={`₹${serviceDetails.amount.toFixed(2)}`} 
              disabled 
              className="text-lg font-semibold"
            />
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with PhonePe'
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
