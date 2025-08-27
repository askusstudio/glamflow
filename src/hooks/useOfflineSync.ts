import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load pending actions from localStorage
    const saved = localStorage.getItem('offline-actions');
    if (saved) {
      setPendingActions(JSON.parse(saved));
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online!",
        description: "Syncing your offline changes...",
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're Offline",
        description: "Changes will be saved and synced when you're back online.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync pending actions on mount if online
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedActions = [...pendingActions, newAction];
    setPendingActions(updatedActions);
    localStorage.setItem('offline-actions', JSON.stringify(updatedActions));
  };

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return;

    const successfulActions: string[] = [];

    for (const action of pendingActions) {
      try {
        let result;
        
        switch (action.type) {
          case 'create':
            result = await supabase.from(action.table as any).insert(action.data);
            break;
          case 'update':
            result = await supabase
              .from(action.table as any)
              .update(action.data)
              .eq('id', action.data.id);
            break;
          case 'delete':
            result = await supabase
              .from(action.table as any)
              .delete()
              .eq('id', action.data.id);
            break;
        }

        if (!result.error) {
          successfulActions.push(action.id);
        }
      } catch (error) {
        console.error('Sync error for action:', action, error);
      }
    }

    // Remove successfully synced actions
    if (successfulActions.length > 0) {
      const remainingActions = pendingActions.filter(
        action => !successfulActions.includes(action.id)
      );
      setPendingActions(remainingActions);
      localStorage.setItem('offline-actions', JSON.stringify(remainingActions));

      toast({
        title: "Sync Complete!",
        description: `${successfulActions.length} offline changes synced successfully.`,
      });
    }
  };

  const clearPendingActions = () => {
    setPendingActions([]);
    localStorage.removeItem('offline-actions');
  };

  return {
    isOnline,
    pendingActions,
    addOfflineAction,
    syncPendingActions,
    clearPendingActions,
  };
};