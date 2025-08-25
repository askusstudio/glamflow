import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator = ({ className }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasShownOfflineToast(false);
      toast({
        title: "Back Online! 🎉",
        description: "Your connection has been restored. Syncing data...",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (!hasShownOfflineToast) {
        toast({
          title: "You're Offline",
          description: "Don't worry! You can still use the app. Changes will sync when you're back online.",
          variant: "destructive",
          duration: 5000,
        });
        setHasShownOfflineToast(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, hasShownOfflineToast]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <Badge 
        variant="destructive" 
        className="px-3 py-2 flex items-center gap-2 shadow-lg animate-pulse"
      >
        <WifiOff className="h-4 w-4" />
        <span className="font-medium">Offline Mode</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRetry}
          className="h-6 w-6 p-0 ml-2 hover:bg-destructive-foreground/20"
          title="Retry connection"
        >
          <Clock className="h-3 w-3" />
        </Button>
      </Badge>
    </div>
  );
};

export default OfflineIndicator;