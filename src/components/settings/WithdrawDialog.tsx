import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BankDetails {
  id: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
}

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess?: () => void;
}

export const WithdrawDialog = ({ 
  isOpen, 
  onClose, 
  availableBalance,
  onSuccess 
}: WithdrawDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [fetchingBank, setFetchingBank] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchBankDetails();
    }
  }, [isOpen, user]);

  const fetchBankDetails = async () => {
    if (!user) return;

    setFetchingBank(true);
    try {
      const { data, error } = await supabase
        .from('bank_details')
        .select('id, account_holder_name, account_number, ifsc_code, bank_name')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Bank fetch error:', error);
        throw error;
      }

      setBankDetails(data);
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast({
        title: "Error",
        description: "Failed to load bank details",
        variant: "destructive"
      });
    } finally {
      setFetchingBank(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !bankDetails) {
      toast({
        title: "Error",
        description: "Please add bank details first",
        variant: "destructive"
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ₹${availableBalance.toFixed(2)} available`,
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount < 100) {
      toast({
        title: "Minimum Amount",
        description: "Minimum withdrawal amount is ₹100",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Create withdrawal request
      const { data, error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: withdrawAmount,
          status: 'pending',
          bank_details_id: bankDetails.id,
          notes: `Withdrawal request for ₹${withdrawAmount.toFixed(2)}`
        })
        .select('id')
        .single();

      if (error) {
        console.error('Withdrawal error:', error);
        throw error;
      }

      // Deduct from account balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({
          account_balance: availableBalance - withdrawAmount
        })
        .eq('id', user.id);

      if (balanceError) {
        console.error('Balance update error:', balanceError);
        throw balanceError;
      }

      toast({
        title: "Withdrawal Requested",
        description: `₹${withdrawAmount.toFixed(2)} withdrawal is being processed`,
      });

      setAmount('');
      onSuccess?.();
      onClose();

    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "Failed to process withdrawal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAccountNumber = (num: string) => {
    return 'XXXX' + num.slice(-4);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        {fetchingBank ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : !bankDetails ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Bank Details Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please add your bank account details in Settings before requesting a withdrawal.
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Available Balance */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">Available Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                ₹{availableBalance.toFixed(2)}
              </p>
            </div>

            {/* Bank Details */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium text-gray-700 mb-2">Withdraw To</p>
              <p className="font-medium">{bankDetails.account_holder_name}</p>
              <p className="text-sm text-gray-600">{bankDetails.bank_name}</p>
              <p className="text-sm text-gray-600">
                {formatAccountNumber(bankDetails.account_number)} • {bankDetails.ifsc_code}
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Withdrawal Amount (₹)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                step="0.01"
                min="100"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (min ₹100)"
              />
              <p className="text-xs text-gray-500">
                Minimum: ₹100 • Maximum: ₹{availableBalance.toFixed(2)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleWithdraw}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Request Withdrawal'
                )}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
