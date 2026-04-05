import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface WorkCommitment {
  id: string;
  jobId: string;
  workerId: string;
  businessName: string;
  jobTitle: string;
  location: string;
  payRate: number;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  confirmedDate: string;
  workHours?: string;
  description: string;
  rating?: number;
}

// Mock work commitments data
const mockCommitments: WorkCommitment[] = [
  {
    id: 'wc1',
    jobId: '3',
    workerId: 'w1',
    businessName: 'Tech Solutions Inc',
    jobTitle: 'Backend Engineer',
    location: 'Remote',
    payRate: 90,
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    status: 'confirmed',
    confirmedDate: '2026-03-15T10:00:00Z',
    workHours: '9:00 AM - 5:00 PM',
    description: 'Node.js backend engineer needed for API development.',
  },
  {
    id: 'wc2',
    jobId: '1',
    workerId: 'w1',
    businessName: 'Tech Solutions Inc',
    jobTitle: 'Senior React Developer',
    location: 'San Francisco, CA',
    payRate: 85,
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    status: 'in-progress',
    confirmedDate: '2026-04-10T09:00:00Z',
    workHours: '10:00 AM - 6:00 PM',
    description: 'Looking for an experienced React developer for a 3-month project.',
  },
  {
    id: 'wc3',
    jobId: '2',
    workerId: 'w1',
    businessName: 'Creative Agency',
    jobTitle: 'UI/UX Designer',
    location: 'New York, NY',
    payRate: 70,
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    status: 'completed',
    confirmedDate: '2025-11-20T14:00:00Z',
    workHours: '9:00 AM - 5:00 PM',
    description: 'Short-term contract for redesigning mobile app.',
    rating: 5,
  },
  {
    id: 'wc4',
    jobId: '4',
    workerId: 'w1',
    businessName: 'Healthcare Plus',
    jobTitle: 'Medical Assistant',
    location: 'Chicago, IL',
    payRate: 35,
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    status: 'cancelled',
    confirmedDate: '2026-01-25T11:00:00Z',
    description: 'Temporary medical assistant position at downtown clinic.',
  },
];

export const WorkerCommitments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'date' | 'payRate'>('date');

  // Get user's commitments
  const userCommitments = mockCommitments.filter(c => c.workerId === user?.id);

  // Sort commitments
  const sortedCommitments = [...userCommitments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else {
      return b.payRate - a.payRate;
    }
  });

  // Categorize commitments
  const currentCommitments = sortedCommitments.filter(c => 
    c.status === 'confirmed' || c.status === 'in-progress'
  );
  const pastCommitments = sortedCommitments.filter(c => 
    c.status === 'completed' || c.status === 'cancelled'
  );

  const getStatusBadge = (status: WorkCommitment['status']) => {
    const variants: Record<WorkCommitment['status'], { 
      variant: 'default' | 'secondary' | 'destructive' | 'outline'; 
      label: string;
      color: string;
    }> = {
      confirmed: { variant: 'secondary', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
      'in-progress': { variant: 'default', label: 'In Progress', color: 'bg-green-100 text-green-800' },
      completed: { variant: 'outline', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
      cancelled: { variant: 'destructive', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    };
    
    const { label, color } = variants[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const renderCommitmentCard = (commitment: WorkCommitment) => (
    <Card key={commitment.id}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-xl font-semibold">{commitment.jobTitle}</h3>
              {getStatusBadge(commitment.status)}
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Briefcase className="size-4" />
              <span className="font-medium">{commitment.businessName}</span>
            </div>
            <p className="text-sm text-gray-600">{commitment.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-gray-400" />
            <span>{commitment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="size-4 text-gray-400" />
            <span>${commitment.payRate}/hour</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-gray-400" />
            <span>
              {new Date(commitment.startDate).toLocaleDateString()} - {new Date(commitment.endDate).toLocaleDateString()}
            </span>
          </div>
          {commitment.workHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-gray-400" />
              <span>{commitment.workHours}</span>
            </div>
          )}
        </div>

        {commitment.status === 'completed' && commitment.rating && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-green-900">
                Completed successfully • Rating: {'⭐'.repeat(commitment.rating)}
              </span>
            </div>
          </div>
        )}

        {commitment.status === 'cancelled' && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
            <p className="text-sm text-red-900">This commitment was cancelled</p>
          </div>
        )}

        {commitment.status === 'in-progress' && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm text-blue-900">Currently in progress</p>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline"
            onClick={() => navigate(`/jobs/${commitment.jobId}`)}
          >
            View Job Details
          </Button>
          {commitment.status === 'completed' && !commitment.rating && (
            <Button variant="outline">
              Leave Rating
            </Button>
          )}
          {commitment.status === 'in-progress' && (
            <Button>
              View Work Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Work Commitments</h1>
        <p className="text-gray-600">
          View your current and past work assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Total Commitments</p>
            <p className="text-3xl font-bold">{userCommitments.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Current</p>
            <p className="text-3xl font-bold text-blue-600">{currentCommitments.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {userCommitments.filter(c => c.status === 'completed').length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">
              ${userCommitments
                .filter(c => c.status === 'completed')
                .reduce((sum, c) => sum + (c.payRate * 160), 0)
                .toLocaleString()}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Sort Control */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortBy} onValueChange={(value: 'date' | 'payRate') => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="payRate">Pay Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Commitments Tabs */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="current">
            Current ({currentCommitments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastCommitments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentCommitments.length > 0 ? (
            currentCommitments.map(commitment => renderCommitmentCard(commitment))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2">No Current Commitments</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any active work commitments at the moment
                </p>
                <Button onClick={() => navigate('/jobs')}>
                  Browse Available Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastCommitments.length > 0 ? (
            pastCommitments.map(commitment => renderCommitmentCard(commitment))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2">No Past Commitments</h3>
                <p className="text-gray-600">
                  Your completed and cancelled commitments will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
