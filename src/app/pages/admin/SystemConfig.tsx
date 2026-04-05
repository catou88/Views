import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Settings, Clock, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';

interface SystemConfig {
  resetCooldown: number; // hours
  negotiationWindow: number; // hours
  jobStartWindow: number; // hours before job start
  availabilityTimeout: number; // hours
}

export const AdminSystemConfig: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    resetCooldown: 24,
    negotiationWindow: 48,
    jobStartWindow: 2,
    availabilityTimeout: 72,
  });

  const [tempConfig, setTempConfig] = useState<SystemConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof SystemConfig, value: string) => {
    const numValue = parseInt(value) || 0;
    setTempConfig(prev => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (tempConfig.resetCooldown < 1 || tempConfig.resetCooldown > 168) {
      toast.error('Reset cooldown must be between 1 and 168 hours (7 days)');
      return;
    }
    if (tempConfig.negotiationWindow < 1 || tempConfig.negotiationWindow > 168) {
      toast.error('Negotiation window must be between 1 and 168 hours (7 days)');
      return;
    }
    if (tempConfig.jobStartWindow < 1 || tempConfig.jobStartWindow > 48) {
      toast.error('Job start window must be between 1 and 48 hours');
      return;
    }
    if (tempConfig.availabilityTimeout < 1 || tempConfig.availabilityTimeout > 336) {
      toast.error('Availability timeout must be between 1 and 336 hours (14 days)');
      return;
    }

    setConfig(tempConfig);
    setHasChanges(false);
    toast.success('System configuration updated successfully!');
  };

  const handleReset = () => {
    setTempConfig(config);
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">System Configuration</h1>
        <p className="text-gray-600">
          Manage system-wide settings and timeouts
        </p>
      </div>

      <Alert className="mb-6 bg-yellow-50 border-yellow-200">
        <AlertCircle className="size-4 text-yellow-600" />
        <AlertDescription>
          Changes to these settings will affect all users immediately. Please review carefully before saving.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Reset Cooldown */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="size-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Reset Cooldown Period</CardTitle>
                <CardDescription>
                  Time a user must wait before they can withdraw interest and apply again to the same job
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="resetCooldown">Hours</Label>
                  <Input
                    id="resetCooldown"
                    type="number"
                    min="1"
                    max="168"
                    value={tempConfig.resetCooldown}
                    onChange={(e) => handleChange('resetCooldown', e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600 pb-2">
                  Current: <strong>{config.resetCooldown} hours</strong> ({(config.resetCooldown / 24).toFixed(1)} days)
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Valid range: 1-168 hours (1 hour to 7 days)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Negotiation Window */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="size-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Negotiation Window</CardTitle>
                <CardDescription>
                  Maximum time allowed for a negotiation session before it expires
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="negotiationWindow">Hours</Label>
                  <Input
                    id="negotiationWindow"
                    type="number"
                    min="1"
                    max="168"
                    value={tempConfig.negotiationWindow}
                    onChange={(e) => handleChange('negotiationWindow', e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600 pb-2">
                  Current: <strong>{config.negotiationWindow} hours</strong> ({(config.negotiationWindow / 24).toFixed(1)} days)
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Valid range: 1-168 hours (1 hour to 7 days)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Job Start Window */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="size-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Job Start Window</CardTitle>
                <CardDescription>
                  Time before job start when workers can be marked as no-show
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="jobStartWindow">Hours</Label>
                  <Input
                    id="jobStartWindow"
                    type="number"
                    min="1"
                    max="48"
                    value={tempConfig.jobStartWindow}
                    onChange={(e) => handleChange('jobStartWindow', e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600 pb-2">
                  Current: <strong>{config.jobStartWindow} hours</strong>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Valid range: 1-48 hours. Businesses can mark workers as no-show during this window around the job start time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Availability Timeout */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="size-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Availability Timeout</CardTitle>
                <CardDescription>
                  Time after which a worker's availability status is automatically reset to "unavailable"
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="availabilityTimeout">Hours</Label>
                  <Input
                    id="availabilityTimeout"
                    type="number"
                    min="1"
                    max="336"
                    value={tempConfig.availabilityTimeout}
                    onChange={(e) => handleChange('availabilityTimeout', e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-600 pb-2">
                  Current: <strong>{config.availabilityTimeout} hours</strong> ({(config.availabilityTimeout / 24).toFixed(1)} days)
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Valid range: 1-336 hours (1 hour to 14 days)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {hasChanges ? (
                <span className="text-orange-600 font-medium">You have unsaved changes</span>
              ) : (
                <span>All changes saved</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Summary */}
      <Card className="mt-6 bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Current Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-600">Reset Cooldown</span>
              <span className="font-semibold">{config.resetCooldown}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-600">Negotiation Window</span>
              <span className="font-semibold">{config.negotiationWindow}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-600">Job Start Window</span>
              <span className="font-semibold">{config.jobStartWindow}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-600">Availability Timeout</span>
              <span className="font-semibold">{config.availabilityTimeout}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
