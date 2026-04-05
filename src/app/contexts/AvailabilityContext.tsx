import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type AvailabilityStatus = 'available' | 'unavailable';

interface WorkerAvailability {
  userId: string;
  status: AvailabilityStatus;
  lastActivity: string;
}

interface AvailabilityContextType {
  availabilityStatus: AvailabilityStatus;
  setAvailabilityStatus: (status: AvailabilityStatus) => void;
  isDiscoverable: boolean;
  lastActivity: Date;
  updateActivity: () => void;
  inactivityMinutes: number;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

const INACTIVITY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const ACTIVITY_CHECK_INTERVAL_MS = 10 * 1000; // Check every 10 seconds

export const AvailabilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [availabilityStatus, setAvailabilityStatusState] = useState<AvailabilityStatus>('unavailable');
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [inactivityMinutes, setInactivityMinutes] = useState<number>(0);

  // Load availability from localStorage on mount
  useEffect(() => {
    if (!user || user.role !== 'worker') return;

    const stored = localStorage.getItem('workerAvailability');
    if (stored) {
      try {
        const data: WorkerAvailability = JSON.parse(stored);
        if (data.userId === user.id) {
          setAvailabilityStatusState(data.status);
          setLastActivity(new Date(data.lastActivity));
        }
      } catch (e) {
        console.error('Failed to load availability:', e);
      }
    }
  }, [user]);

  // Save availability to localStorage whenever it changes
  useEffect(() => {
    if (!user || user.role !== 'worker') return;

    const data: WorkerAvailability = {
      userId: user.id,
      status: availabilityStatus,
      lastActivity: lastActivity.toISOString(),
    };
    localStorage.setItem('workerAvailability', JSON.stringify(data));
  }, [user, availabilityStatus, lastActivity]);

  // Check for inactivity and auto-set unavailable
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const inactiveTime = now.getTime() - lastActivity.getTime();
      const minutesInactive = Math.floor(inactiveTime / 60000);
      setInactivityMinutes(minutesInactive);

      // Auto-unavailable after inactivity window
      if (inactiveTime > INACTIVITY_WINDOW_MS && availabilityStatus === 'available') {
        setAvailabilityStatusState('unavailable');
      }
    }, ACTIVITY_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [lastActivity, availabilityStatus]);

  const updateActivity = () => {
    setLastActivity(new Date());
  };

  const setAvailabilityStatus = (status: AvailabilityStatus) => {
    setAvailabilityStatusState(status);
    updateActivity(); // Reset activity when manually changing status
  };

  // Track user activity (mouse move, key press, click)
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Check if worker is discoverable
  const isDiscoverable = () => {
    if (!user || user.role !== 'worker') return false;

    const now = new Date();
    const inactiveTime = now.getTime() - lastActivity.getTime();
    const isActive = inactiveTime < INACTIVITY_WINDOW_MS;

    // Worker is discoverable if:
    // 1. Available
    // 2. Active within window
    // 3. Not suspended (checked in user context)
    return availabilityStatus === 'available' && isActive;
  };

  return (
    <AvailabilityContext.Provider
      value={{
        availabilityStatus,
        setAvailabilityStatus,
        isDiscoverable: isDiscoverable(),
        lastActivity,
        updateActivity,
        inactivityMinutes,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = (): AvailabilityContextType => {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within an AvailabilityProvider');
  }
  return context;
};
