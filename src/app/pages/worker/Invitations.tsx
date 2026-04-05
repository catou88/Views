import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockJobs } from '../../services/mockData';
import { Mail, MapPin, DollarSign, Calendar, Building2, Clock } from 'lucide-react';
import { CountdownTimer } from '../../components/CountdownTimer';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  jobId: string;
  workerId: string;
  businessId: string;
  businessName: string;
  invitedDate: string;
  expiresAt: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

// Mock invitations data
const mockInvitations: Invitation[] = [
  {
    id: 'inv1',
    jobId: '1',
    workerId: 'w1',
    businessId: 'b1',
    businessName: 'Tech Solutions Inc',
    invitedDate: '2026-03-28T10:00:00Z',
    expiresAt: '2026-04-05T23:59:59Z',
    status: 'pending',
    message: 'We reviewed your profile and believe you would be a great fit for this position. Your React and TypeScript experience aligns perfectly with our needs.',
  },
  {
    id: 'inv2',
    jobId: '4',
    workerId: 'w1',
    businessId: 'b3',
    businessName: 'Healthcare Plus',
    invitedDate: '2026-03-30T14:30:00Z',
    expiresAt: '2026-04-07T23:59:59Z',
    status: 'pending',
    message: 'Your medical certifications caught our attention. We would love to have you join our team.',
  },
  {
    id: 'inv3',
    jobId: '3',
    workerId: 'w1',
    businessId: 'b1',
    businessName: 'Tech Solutions Inc',
    invitedDate: '2026-03-15T09:00:00Z',
    expiresAt: '2026-03-25T23:59:59Z',
    status: 'expired',
  },
];

export const WorkerInvitations: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);

  // Get user's invitations with job details
  const userInvitations = invitations
    .filter(inv => inv.workerId === user?.id)
    .map(inv => ({
      ...inv,
      job: mockJobs.find(j => j.id === inv.jobId)!,
    }))
    .sort((a, b) => {
      // Sort: pending first, then by date
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.invitedDate).getTime() - new Date(a.invitedDate).getTime();
    });

  const pendingInvitations = userInvitations.filter(inv => inv.status === 'pending');
  const pastInvitations = userInvitations.filter(inv => inv.status !== 'pending');

  const handleAccept = (invitationId: string) => {
    setInvitations(prev =>
      prev.map(inv =>
        inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
      )
    );
    toast.success('Invitation accepted! You can now proceed with the application.');
  };

  const handleReject = (invitationId: string) => {
    setInvitations(prev =>
      prev.map(inv =>
        inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv
      )
    );
    toast.success('Invitation declined.');
  };

  const getStatusBadge = (status: Invitation['status']) => {
    const variants: Record<Invitation['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      accepted: { variant: 'default', label: 'Accepted' },
      rejected: { variant: 'outline', label: 'Declined' },
      expired: { variant: 'destructive', label: 'Expired' },
    };
    
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Job Invitations</h1>
        <p className="text-gray-600">
          Businesses that are interested in working with you
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Pending Invitations</p>
            <p className="text-3xl font-bold">{pendingInvitations.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="text-3xl font-bold text-green-600">
              {userInvitations.filter(inv => inv.status === 'accepted').length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Total Received</p>
            <p className="text-3xl font-bold">{userInvitations.length}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Pending Invitations</h2>
          <div className="space-y-4">
            {pendingInvitations.map((inv) => {
              const expired = isExpired(inv.expiresAt);
              return (
                <Card key={inv.id} className={expired ? 'border-red-200 bg-red-50/30' : 'border-blue-200 bg-blue-50/30'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="size-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 
                              className="text-xl font-semibold cursor-pointer hover:text-blue-600"
                              onClick={() => navigate(`/jobs/${inv.jobId}`)}
                            >
                              {inv.job.title}
                            </h3>
                            {expired && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Building2 className="size-4" />
                            <span className="font-medium">{inv.businessName}</span>
                          </div>
                          
                          {inv.message && (
                            <div className="mt-3 p-3 bg-white rounded-lg border">
                              <p className="text-sm text-gray-700 italic">"{inv.message}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-gray-400" />
                        <span>{inv.job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="size-4 text-gray-400" />
                        <span>${inv.job.payRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>Invited {new Date(inv.invitedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-gray-400" />
                        {expired ? (
                          <span className="text-red-600 font-medium">Expired</span>
                        ) : (
                          <CountdownTimer targetDate={inv.expiresAt} label="Expires in" />
                        )}
                      </div>
                    </div>

                    {!expired && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          onClick={() => navigate(`/jobs/${inv.jobId}`)}
                        >
                          View Job Details
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleAccept(inv.id)}
                        >
                          Accept Invitation
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => handleReject(inv.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Invitations */}
      {pastInvitations.length > 0 && (
        <div>
          <h2 className="text-2xl mb-4">Past Invitations</h2>
          <div className="space-y-4">
            {pastInvitations.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 
                            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/jobs/${inv.jobId}`)}
                          >
                            {inv.job.title}
                          </h3>
                          <p className="text-gray-600">{inv.businessName}</p>
                        </div>
                        {getStatusBadge(inv.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span>Invited {new Date(inv.invitedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>${inv.job.payRate}/hour</span>
                        <span>•</span>
                        <span>{inv.job.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userInvitations.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Mail className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No Invitations Yet</h3>
            <p className="text-gray-600 mb-4">
              When businesses are interested in your profile, their invitations will appear here
            </p>
            <Button onClick={() => navigate('/profile')}>
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
