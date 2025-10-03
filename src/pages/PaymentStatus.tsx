import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg">Verifying payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {isSuccess ? (
            <CheckCircle className="h-24 w-24 text-green-500" />
          ) : (
            <XCircle className="h-24 w-24 text-destructive" />
          )}
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {isSuccess 
                ? 'Your booking has been confirmed and payment received.'
                : 'We could not process your payment. Please try again.'}
            </p>
            {transactionId && (
              <p className="text-sm text-muted-foreground">
                Transaction ID: {transactionId}
              </p>
            )}
          </div>

          <div className="flex gap-4 w-full">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
              variant={isSuccess ? "default" : "outline"}
            >
              Go to Dashboard
            </Button>
            {!isSuccess && (
              <Button 
                onClick={() => navigate(-2)}
                className="flex-1"
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
