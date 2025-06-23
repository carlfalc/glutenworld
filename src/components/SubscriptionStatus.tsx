
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, RefreshCw, Settings, Calendar } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { formatDistanceToNow } from 'date-fns';

const SubscriptionStatus = () => {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
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
          <span className="ml-2 text-muted-foreground">Checking subscription...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${subscribed ? 'border-gluten-primary bg-gluten-primary/5' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {subscribed && <Crown className="w-5 h-5 text-gluten-primary" />}
          Subscription Status
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={subscribed ? "default" : "secondary"} className="text-sm">
            {subscribed ? subscription_tier || 'Active' : 'Free'}
          </Badge>
          {subscribed && (
            <Badge variant="outline" className="text-xs">
              Premium Features
            </Badge>
          )}
        </div>
        
        {subscribed && subscription_end && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Renews {formatEndDate(subscription_end)}</span>
          </div>
        )}

        {!subscribed && (
          <p className="text-sm text-muted-foreground">
            Upgrade to unlock unlimited recipe conversions and premium features.
          </p>
        )}

        {subscribed && (
          <Button
            onClick={openCustomerPortal}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
