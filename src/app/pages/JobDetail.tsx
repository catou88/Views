import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { mockJobs, JobStatus } from '../services/mockData';
import { CountdownTimer } from '../components/CountdownTimer';
import { MapPin, DollarSign, Calendar, Briefcase, CheckCircle, XCircle, Clock, FileText, Upload, X, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

interface QualificationSubmission {
  id: string;
  type: string;
  description: string;
  documentFile: File | null;
}

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  
  // Qualification submission states
  const [qualifications, setQualifications] = useState<QualificationSubmission[]>([]);
  
  const job = mockJobs.find(j => j.id === id);

  // Check if user has already applied
  const hasUserApplied = () => {
    const savedApps = JSON.parse(localStorage.getItem('userApplications') || '[]');
    return savedApps.some((app: any) => app.jobId === id && app.workerId === user?.id);
  };

  const userAlreadyApplied = hasUserApplied();

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Job not found</p>
            <Button onClick={() => navigate('/jobs')} className="mt-4">
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: JobStatus) => {
    const variants: Record<JobStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      open: { variant: 'default', label: 'Open' },
      filled: { variant: 'secondary', label: 'Filled' },
      expired: { variant: 'outline', label: 'Expired' },
      canceled: { variant: 'destructive', label: 'Canceled' },
      completed: { variant: 'secondary', label: 'Completed' },
    };
    
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const canApply = isAuthenticated && user?.role === 'worker' && job.status === 'open';

  // Initialize qualification submissions when dialog opens
  const handleDialogOpen = (isOpen: boolean) => {
    setShowApplyDialog(isOpen);
    if (isOpen) {
      // Start with one empty qualification
      setQualifications([{
        id: `qual-${Date.now()}`,
        type: '',
        description: '',
        documentFile: null,
      }]);
    } else {
      setQualifications([]);
    }
  };

  const addQualification = () => {
    setQualifications(prev => [...prev, {
      id: `qual-${Date.now()}`,
      type: '',
      description: '',
      documentFile: null,
    }]);
  };

  const removeQualification = (id: string) => {
    setQualifications(prev => prev.filter(q => q.id !== id));
  };

  const updateQualification = (id: string, field: keyof QualificationSubmission, value: any) => {
    setQualifications(prev => prev.map(qual => 
      qual.id === id ? { ...qual, [field]: value } : qual
    ));
  };

  const handleApply = () => {
    // Validate that at least one qualification is provided
    if (qualifications.length === 0) {
      toast.error('Please add at least one qualification');
      return;
    }

    // Validate that all qualifications have type and description
    const invalidQualifications = qualifications.filter(
      qual => !qual.type.trim() || !qual.description.trim()
    );

    if (invalidQualifications.length > 0) {
      toast.error('Please provide type and description for all qualifications');
      return;
    }

    // Save qualifications to localStorage
    const existingQualifications = JSON.parse(localStorage.getItem('userQualifications') || '[]');
    
    const newQualifications = qualifications.map(qual => ({
      id: qual.id,
      userId: user?.id || '',
      name: qual.type,
      type: qual.type,
      description: qual.description,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      documentName: qual.documentFile ? qual.documentFile.name : undefined,
      positionType: job.title, // Add the job title as the position type
    }));

    localStorage.setItem('userQualifications', JSON.stringify([...newQualifications, ...existingQualifications]));

    // Save application to localStorage
    const existingApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
    
    const newApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      workerId: user?.id || '',
      workerName: user?.name || '',
      workerEmail: user?.email || '',
      status: 'pending',
      appliedDate: new Date().toISOString(),
      coverLetter: coverLetter || undefined,
    };

    localStorage.setItem('userApplications', JSON.stringify([newApplication, ...existingApplications]));

    toast.success('Application and qualifications submitted successfully!');
    setShowApplyDialog(false);
    setCoverLetter('');
    setQualifications([]);
  };

  const getStatusMessage = () => {
    if (!isAuthenticated) {
      return { message: 'Please log in to apply for this job', action: () => navigate('/login'), actionLabel: 'Log In' };
    }
    if (user?.role !== 'worker') {
      return { message: 'Only workers can apply for jobs', action: null, actionLabel: null };
    }
    if (job.status === 'filled') {
      return { message: 'This position has been filled', action: null, actionLabel: null };
    }
    if (job.status === 'expired') {
      return { message: 'Applications for this job have closed', action: null, actionLabel: null };
    }
    if (job.status === 'canceled') {
      return { message: 'This job posting has been canceled', action: null, actionLabel: null };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-4">
        ← Back to Jobs
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
              <CardDescription className="text-lg text-blue-600">
                {job.businessName}
              </CardDescription>
            </div>
            {getStatusBadge(job.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div>{job.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="size-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pay Rate</div>
                <div className="font-semibold">${job.payRate}/hour</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div>{new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Applications</div>
                <div>{job.applicationsCount} received</div>
              </div>
            </div>
          </div>

          {/* Expiration Timer */}
          {job.status === 'open' && job.expiresAt && (
            <Alert className="bg-orange-50 border-orange-200">
              <Clock className="size-4" />
              <AlertDescription>
                Applications close in: <CountdownTimer expiresAt={job.expiresAt} />
              </AlertDescription>
            </Alert>
          )}

          {/* Status Message */}
          {statusMessage && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>{statusMessage.message}</span>
                {statusMessage.action && (
                  <Button onClick={statusMessage.action} size="sm">
                    {statusMessage.actionLabel}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Already Applied Message */}
          {canApply && userAlreadyApplied && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="size-4 text-green-700" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-green-800">You have already applied for this position</span>
                <Button onClick={() => navigate('/worker/applications')} size="sm" variant="outline">
                  View My Applications
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Apply Button */}
          {canApply && !userAlreadyApplied && (
            <Dialog open={showApplyDialog} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                  Apply for This Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                  <DialogDescription>
                    Provide your qualifications and optional cover letter
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Required Qualifications Section */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="size-5 text-blue-600" />
                      Qualifications
                    </h3>
                    <div className="space-y-4">
                      {qualifications.map((qual, index) => (
                        <div key={qual.id} className="border rounded-lg p-4 bg-gray-50 relative">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="size-4 text-green-600" />
                              <span className="font-medium">
                                {qual.type || `Qualification ${index + 1}`}
                              </span>
                            </div>
                            {qualifications.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQualification(qual.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`qual-type-${qual.id}`}>
                                Qualification Type <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`qual-type-${qual.id}`}
                                placeholder="e.g., React Certification, Medical License, Bachelor's Degree"
                                value={qual.type}
                                onChange={(e) => updateQualification(qual.id, 'type', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`qual-desc-${qual.id}`}>
                                Description <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id={`qual-desc-${qual.id}`}
                                placeholder="Describe your experience, certifications, or credentials..."
                                value={qual.description}
                                onChange={(e) => updateQualification(qual.id, 'description', e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`qual-doc-${qual.id}`}>
                                Supporting Document (Optional)
                              </Label>
                              {qual.documentFile && (
                                <div className="mb-2 flex items-center gap-2 p-2 border rounded-lg bg-blue-50 border-blue-200">
                                  <FileText className="size-4 text-blue-600" />
                                  <span className="flex-1 text-sm truncate">
                                    {qual.documentFile?.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateQualification(qual.id, 'documentFile', null)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              )}
                              <Input
                                id={`qual-doc-${qual.id}`}
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateQualification(qual.id, 'documentFile', file);
                                  }
                                }}
                                className="mt-1"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Upload a certificate, license, or other proof
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addQualification}
                        className="w-full"
                      >
                        <Plus className="size-4 mr-2" />
                        Add Another Qualification
                      </Button>
                    </div>
                  </div>

                  {/* Cover Letter Section */}
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell the employer why you're a great fit for this position..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  {/* Info Alert */}
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-sm text-blue-800">
                      <strong>Note:</strong> Your qualifications will be submitted for admin review along with your application. You can view their status in the Qualifications tab.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleApply} className="w-full" size="lg">
                    Submit Application & Qualifications
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};