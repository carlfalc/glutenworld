
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Settings } from 'lucide-react';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';

const EmailPreferences = () => {
  const { preferences, loading, updatePreferences } = useEmailPreferences();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gluten-primary mr-2"></div>
          <span className="text-muted-foreground">Loading email preferences...</span>
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which email notifications you'd like to receive
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="trial-start">Welcome & Trial Start</Label>
            <p className="text-sm text-muted-foreground">
              Receive a welcome email when you start your free trial
            </p>
          </div>
          <Switch
            id="trial-start"
            checked={preferences.trial_start}
            onCheckedChange={() => handleToggle('trial_start')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="trial-reminder">Trial Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminded before your trial expires
            </p>
          </div>
          <Switch
            id="trial-reminder"
            checked={preferences.trial_reminder}
            onCheckedChange={() => handleToggle('trial_reminder')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="payment-success">Payment Confirmations</Label>
            <p className="text-sm text-muted-foreground">
              Receive confirmations when payments are processed
            </p>
          </div>
          <Switch
            id="payment-success"
            checked={preferences.payment_success}
            onCheckedChange={() => handleToggle('payment_success')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="subscription-updated">Subscription Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when your subscription changes
            </p>
          </div>
          <Switch
            id="subscription-updated"
            checked={preferences.subscription_updated}
            onCheckedChange={() => handleToggle('subscription_updated')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="subscription-cancelled">Cancellation Notices</Label>
            <p className="text-sm text-muted-foreground">
              Receive confirmations when subscriptions are cancelled
            </p>
          </div>
          <Switch
            id="subscription-cancelled"
            checked={preferences.subscription_cancelled}
            onCheckedChange={() => handleToggle('subscription_cancelled')}
          />
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Settings className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Important:</p>
              <p>Critical account security emails and transactional receipts will always be sent, regardless of these preferences.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferences;
