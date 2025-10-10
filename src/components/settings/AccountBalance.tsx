import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { IndianRupee, Wallet, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { WithdrawDialog } from './WithdrawDialog'; // Add import at top
/**
 * AccountBalance Component
 * 
 * Displays the user's account balance and financial information including:
 * - Current available balance from profiles.account_balance
 * - Expected payment amount from profiles.expected_payment_amount  
 * - Recent withdrawal requests from withdrawals table
 * - Quick actions for refreshing balance and requesting withdrawals
 * 
 * Uses the authenticated user's ID to fetch personalized financial data.
 */

interface AccountBalance {
  account_balance: number;
  expected_payment_amount: number;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at: string | null;
}

interface Payment {
  id: string;
  amount: number;
  payment_status: string;
  payer_name: string;
  created_at: string;
  verified_at: string | null;
}

export default function AccountBalance() {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  useEffect(() => {
    if (user) {
      fetchAccountData();
    }
  }, [user]);

  const fetchAccountData = async () => {
    if (!user) {
      console.log('No user found, skipping account data fetch');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching account data for user:', user.id);
      
      // Fetch account balance from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('account_balance, expected_payment_amount')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (profileData) {
        console.log('Profile data found:', profileData);
        setBalance({
          account_balance: profileData.account_balance || 0,
          expected_payment_amount: profileData.expected_payment_amount || 0
        });
      } else {
        console.log('No profile data found, setting defaults');
        setBalance({
          account_balance: 0,
          expected_payment_amount: 0
        });
      }

      // Fetch recent withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('id, amount, status, created_at, processed_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (withdrawalsError) {
        console.error('Error fetching withdrawals:', withdrawalsError);
        // Don't throw error for withdrawals, just log it
      } else {
        console.log('Withdrawals data:', withdrawalsData);
        setWithdrawals(withdrawalsData || []);
      }

      // Fetch recent payments received
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('id, amount, payment_status, payer_name, created_at, verified_at')
        .eq('provider_id', user.id)
        .eq('payment_status', 'success')
        .order('created_at', { ascending: false })
        .limit(5);
      // Fetch recent payments received
      // const { data: paymentsData, error: paymentsError } = await supabase
      //   .from('payments')
      //   .select('id, amount, payment_status, user_name, created_at, verified_at')
      //   .eq('provider_id', user.id)
      //   .order('created_at', { ascending: false })
      //   .limit(5);

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      } else {
        console.log('Payments data:', paymentsData);
        setPayments(paymentsData || []);
      }

    } catch (error) {
      console.error('Error fetching account data:', error);
      toast({
        title: "Error",
        description: "Failed to load account balance. Please try again.",
        variant: "destructive"
      });
      // Set default values on error
      setBalance({
        account_balance: 0,
        expected_payment_amount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-semibold">Account Balance</h2>
        </div>
        <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view your account balance.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-semibold">Account Balance</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  
  <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-semibold">Account Balance</h2>
      </div>
{/* Add dialog at the bottom, before closing </div> */}
<WithdrawDialog
  isOpen={withdrawDialogOpen}
  onClose={() => setWithdrawDialogOpen(false)}
  availableBalance={balance?.account_balance || 0}
  onSuccess={fetchAccountData}
/>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
              <p className="text-sm text-gray-600">Available for withdrawal</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {formatCurrency(balance?.account_balance || 0)}
          </div>
        </div>

        {/* Expected Payments */}
        {/* <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Expected Payments</h3>
              <p className="text-sm text-gray-600">Pending payments</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(balance?.expected_payment_amount || 0)}
          </div>
        </div> */}
      </div>

      {/* Recent Payments Received */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Payments Received</h3>
          <p className="text-sm text-gray-600">Payments you've received from clients</p>
        </div>
        
        {payments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        From: {payment.payer_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Success
                    </span>
                    {payment.verified_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        Verified: {formatDate(payment.verified_at)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No payments received yet</p>
            <p className="text-sm">Your payment history will appear here</p>
          </div>
        )}
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Withdrawals</h3>
          <p className="text-sm text-gray-600">Your recent withdrawal requests</p>
        </div>
        
        {withdrawals.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(withdrawal.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(withdrawal.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                    {withdrawal.processed_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        Processed: {formatDate(withdrawal.processed_at)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No withdrawal requests yet</p>
            <p className="text-sm">Your withdrawal history will appear here</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={fetchAccountData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Balance
          </button>
          <button
            disabled={!balance?.account_balance || balance.account_balance <= 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Request Withdrawal
          </button>
        </div>
        {(!balance?.account_balance || balance.account_balance <= 0) && (
          <p className="text-sm text-gray-500 mt-2">
            Minimum balance required to request withdrawal
          </p>
        )}
      </div> */}
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
  <div className="flex gap-4">
    <button
      onClick={fetchAccountData}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Refresh Balance
    </button>
    <button
      onClick={() => setWithdrawDialogOpen(true)}
      disabled={!balance?.account_balance || balance.account_balance < 100}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Request Withdrawal
    </button>
  </div>
  {(!balance?.account_balance || balance.account_balance < 100) && (
    <p className="text-sm text-gray-500 mt-2">
      Minimum balance ₹100 required to withdraw
    </p>
  )}
</div>
    </div>
  );
}
