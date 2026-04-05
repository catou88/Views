import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { mockApplications, mockJobs, ApplicationStatus } from '../../services/mockData';
import { User, Mail, Calendar, FileText, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export const JobApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [negotiateRate, setNegotiateRate] = useState('');

  const job = mockJobs.find(j => j.id === id);
  const applications = mockApplications.filter(app => app.jobId === id);

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Job not found</p>
            <Button onClick={() => navigate('/business/jobs')} className="mt-4">
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAccept = (appId: string) => {
    toast.success('Application accepted!');
  };

  const handleReject = (appId: string) => {
    toast.success('Application rejected');
  };

  const handleNegotiate = (appId: string) => {
    if (!negotiateRate) {
      toast.error('Please enter a rate');
      return;
    }
    toast.success(`Negotiation offer sent at $${negotiateRate}/hour`);
    setSelectedApp(null);
    setNegotiateRate('');
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants: Record<ApplicationStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      accepted: { variant: 'default', label: 'Accepted' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      withdrawn: { variant: 'outline', label: 'Withdrawn' },
    };
    
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate('/business/jobs')} className="mb-4">
        ← Back to Jobs
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl mb-2">Applications for {job.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>{applications.length} total applications</span>
          <span>•</span>
          <span>${job.payRate}/hour</span>
          <span>•</span>
          <span>{job.location}</span>
        </div>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="size-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{app.workerName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="size-4" />
                          {app.workerEmail}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    {app.coverLetter && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="size-4 text-gray-600" />
                          <span className="font-medium text-sm">Cover Letter</span>
                        </div>
                        <p className="text-sm text-gray-700">{app.coverLetter}</p>
                      </div>
                    )}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={() => handleAccept(app.id)} className="flex-1">
                      Accept Application
                    </Button>
                    <Dialog open={selectedApp === app.id} onOpenChange={(open) => {
                      if (!open) {
                        setSelectedApp(null);
                        setNegotiateRate('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedApp(app.id)}
                          className="flex-1"
                        >
                          Negotiate Rate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Negotiate Pay Rate</DialogTitle>
                          <DialogDescription>
                            Propose a different pay rate to {app.workerName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Current Rate</Label>
                            <div className="text-2xl font-semibold">${job.payRate}/hour</div>
                          </div>
                          <div>
                            <Label htmlFor="negotiateRate">Proposed Rate ($/hour)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                              <Input
                                id="negotiateRate"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="75"
                                value={negotiateRate}
                                onChange={(e) => setNegotiateRate(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          <Button onClick={() => handleNegotiate(app.id)} className="w-full">
                            Send Offer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleReject(app.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No one has applied to this job yet' 
                : `No ${statusFilter} applications`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
