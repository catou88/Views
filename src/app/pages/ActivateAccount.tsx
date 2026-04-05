import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ActivateAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Activation token is missing');
        return;
      }

      try {
        // Simulate API call to activate account
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation - in reality, verify with backend
        // For demo purposes, assume all tokens are valid
        setStatus('success');
        toast.success('Account activated successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to activate account'
        );
      }
    };

    activateAccount();
  }, [token, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="size-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Activating Your Account</CardTitle>
            <CardDescription>
              Please wait while we activate your account...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="size-8 text-red-600" />
            </div>
            <CardTitle>Activation Failed</CardTitle>
            <CardDescription>
              We couldn't activate your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage || 'The activation link is invalid or has expired.'}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/register')}>
                Create New Account
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Need help? Contact support at support@staffhub.com
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <CardTitle>Account Activated!</CardTitle>
          <CardDescription>
            Your account has been successfully activated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              You can now log in to your account and start using StaffHub.
            </AlertDescription>
          </Alert>

          <Button className="w-full" onClick={() => navigate('/login')}>
            Go to Login
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Redirecting automatically in 3 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
