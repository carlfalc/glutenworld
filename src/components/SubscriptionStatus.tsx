
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, RefreshCw, Settings, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { formatDistanceToNow } from 'date-fns';

const SubscriptionStatus = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    is_trialing,
    trial_expires_at,
    loading, 
    refresh, 
    openCustomerPortal 
  } = useSubscription();

  const formatEndDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="w-6 h-6 animate-spin text-gluten-primary" />
          <span className="ml-2 text-muted-foreground text-sm">Checking status...</span>
        </CardContent>
      </Card>
    );
  }

  const hasActiveAccess = subscribed || is_trialing;
  const statusText = subscribed 
    ? 'Premium Subscriber' 
    : is_trialing 
    ? 'Free Trial Active' 
    : 'Free Account';

  return (
    <Card className={`w-full ${hasActiveAccess ? 'border-gluten-primary bg-gluten-primary/5' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          {hasActiveAccess && <Crown className="w-4 h-4 md:w-5 md:h-5 text-gluten-primary" />}
          <span className="truncate">Account Status</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge 
            variant={hasActiveAccess ? "default" : "secondary"} 
            className="text-xs"
          >
            {statusText}
          </Badge>
          {subscribed && (
            <Badge variant="outline" className="text-xs">
              {subscription_tier || 'Premium'}
            </Badge>
          )}
        </div>
        
        {/* Trial status */}
        {is_trialing && trial_expires_at && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4" />
            <span>Trial ends {formatEndDate(trial_expires_at)}</span>
          </div>
        )}

        {/* Subscription renewal */}
        {subscribed && subscription_end && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Renews {formatEndDate(subscription_end)}</span>
          </div>
        )}

        {/* Status messages */}
        {!hasActiveAccess && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock unlimited access to all premium features.
            </p>
          </div>
        )}

        {is_trialing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Trial Active
              </span>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Enjoying full access to all features. Your trial automatically converts to a paid subscription.
            </p>
          </div>
        )}

        {subscribed && (
          <div className="space-y-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Subscription Active
                </span>
              </div>
              <p className="text-xs text-green-800 dark:text-green-200">
                You have unlimited access to all premium features.
              </p>
            </div>
            
            <Button
              onClick={openCustomerPortal}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
