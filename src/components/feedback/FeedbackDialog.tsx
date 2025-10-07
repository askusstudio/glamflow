import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  providerId: string;
  providerName: string;
  payerName: string;
}

export const FeedbackDialog = ({ 
  isOpen, 
  onClose, 
  paymentId,
  providerId,
  providerName,
  payerName 
}: FeedbackDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('feedback')
        .insert({
          payment_id: paymentId,
          provider_id: providerId,
          rating,
          message: message || null,
          payer_name: payerName,
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      onClose();
    } catch (error) {
      console.error('Feedback error:', error);
      toast({
        title: "Failed to Submit",
        description: error instanceof Error ? error.message : "Please try again",
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
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              How was your experience with {providerName}?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Comments (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || rating === 0}
              className="flex-1"
            >
              Submit Feedback
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
