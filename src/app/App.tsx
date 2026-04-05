import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { AvailabilityProvider } from './contexts/AvailabilityContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <AvailabilityProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AvailabilityProvider>
    </AuthProvider>
  );
}