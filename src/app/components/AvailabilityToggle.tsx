import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useAvailability } from '../contexts/AvailabilityContext';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export const AvailabilityToggle: React.FC = () => {
  const { 
    availabilityStatus, 
    setAvailabilityStatus, 
    isDiscoverable,
    inactivityMinutes 
  } = useAvailability();

  const handleToggle = (checked: boolean) => {
    setAvailabilityStatus(checked ? 'available' : 'unavailable');
  };

  const getStatusInfo = () => {
    if (availabilityStatus === 'available') {
      if (isDiscoverable) {
        return {
          icon: <CheckCircle className="size-5 text-green-600" />,
          label: 'Available & Discoverable',
          badge: 'bg-green-100 text-green-800 border-green-200',
          description: 'Businesses can find you and express interest in hiring you.'
        };
      } else {
        return {
          icon: <AlertCircle className="size-5 text-yellow-600" />,
          label: 'Available (Inactive)',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: `You've been inactive for ${inactivityMinutes} min. You'll be marked unavailable after 5 minutes of inactivity.`
        };
      }
    } else {
      return {
        icon: <XCircle className="size-5 text-red-600" />,
        label: 'Unavailable',
        badge: 'bg-red-100 text-red-800 border-red-200',
        description: 'You are not visible to businesses. Toggle to available to receive job opportunities.'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {statusInfo.icon}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">Availability Status</h3>
              <Badge className={statusInfo.badge}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {statusInfo.description}
            </p>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <Label htmlFor="availability-toggle" className="cursor-pointer flex items-center gap-2">
                <span className="font-medium">I'm available for work</span>
              </Label>
              <Switch
                id="availability-toggle"
                checked={availabilityStatus === 'available'}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        </div>

        {availabilityStatus === 'available' && !isDiscoverable && inactivityMinutes >= 4 && (
          <Alert className="mt-4 bg-yellow-50 border-yellow-200">
            <Clock className="size-4 text-yellow-600" />
            <AlertDescription className="text-sm">
              <strong>Warning:</strong> You'll be automatically marked unavailable in {5 - inactivityMinutes} minute(s) due to inactivity.
              Move your mouse or interact with the page to stay active.
            </AlertDescription>
          </Alert>
        )}

        {isDiscoverable && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="size-4 text-green-600" />
            <AlertDescription className="text-sm">
              You're currently discoverable by businesses looking for qualified workers!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
