import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface EmailCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (email: string) => void;
}

const EmailCheckModal: React.FC<EmailCheckModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUserAndProceed = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user exists by attempting a password reset (this won't send email but will tell us if user exists)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      // If no error and user exists, they should login
      if (!error) {
        toast({
          title: "User found!",
          description: "An account with this email exists. Redirecting to login...",
        });
        navigate("/auth?email=" + encodeURIComponent(email) + "&mode=login");
        onClose();
      }
    } catch (error: any) {
      // If error occurs, user might not exist, allow them to proceed with signup
      if (error.message.includes("User not found")) {
        onContinue(email);
        onClose();
      } else {
        // For any other error, proceed to auth page
        navigate("/auth?email=" + encodeURIComponent(email));
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Join GlamFlow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkUserAndProceed()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={checkUserAndProceed} disabled={loading} className="flex-1">
              {loading ? "Checking..." : "Continue"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailCheckModal;