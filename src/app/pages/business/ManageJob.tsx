import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { mockJobs, mockApplications, mockNegotiations, JobStatus } from '../../services/mockData';
import { MapPin, DollarSign, Calendar, Users, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { CountdownTimer } from '../../components/CountdownTimer';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export const ManageJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Find the job
  const job = mockJobs.find(j => j.id === id && j.businessId === user?.id);

  // If job not found or not owned by this business
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="size-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Job not found or you don't have permission to manage it</p>
            <Button onClick={() => navigate('/business/jobs')} className="mt-4">
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Editable fields
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [payRate, setPayRate] = useState(job.payRate.toString());
  const [location, setLocation] = useState(job.location);

  // Get applications for this job
  const applications = mockApplications.filter(app => app.jobId === id);
  const pendingCount = applications.filter(app => app.status === 'pending').length;

  // Check for active negotiations
  const activeNegotiations = mockNegotiations.filter(
    neg => neg.jobId === id && neg.status === 'active'
  );
  const hasActiveNegotiations = activeNegotiations.length > 0;

  // Determine if job can be edited
  // Cannot edit if job is filled or if there are active negotiations
  const canEdit = job.status === 'open' && !hasActiveNegotiations && job.status !== 'filled';
  
  // Determine if job can be deleted
  // Cannot delete if job is filled, has applications, or has active negotiations
  const canDelete = job.status !== 'filled' && applications.length === 0 && !hasActiveNegotiations;
  
  // Determine if job can be canceled
  const canCancel = job.status === 'open' && !hasActiveNegotiations;

  const handleSave = () => {
    // Validation
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payRateNum = parseFloat(payRate);
    if (isNaN(payRateNum) || payRateNum <= 0) {
      toast.error('Please enter a valid pay rate');
      return;
    }

    // In real app, this would make an API call
    localStorage.setItem(`job-${id}`, JSON.stringify({
      ...job,
      title,
      description,
      payRate: payRateNum,
      location,
    }));

    toast.success('Job updated successfully!');
    setIsEditing(false);
  };

  const handleDelete = () => {
    // In real app, this would make an API call
    toast.success('Job deleted successfully');
    navigate('/business/jobs');
  };

  const handleCancel = () => {
    // In real app, this would make an API call
    toast.success('Job canceled');
    setShowCancelDialog(false);
    navigate('/business/jobs');
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">Manage Job Posting</h1>
          <p className="text-gray-600">
            Edit job details or manage applications
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && canEdit && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="size-4 mr-2" />
              Edit
            </Button>
          )}
          {!isEditing && canCancel && (
            <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
              <X className="size-4 mr-2" />
              Cancel Job
            </Button>
          )}
          {!isEditing && canDelete && (
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="size-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Editing Notice */}
      {!canEdit && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Editing is restricted</p>
                <p className="text-sm text-orange-700 mt-1">
                  {job.status !== 'open' 
                    ? 'This job cannot be edited because it is no longer open.'
                    : 'This job has an active deadline and cannot be edited.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Job Details</CardTitle>
            {getStatusBadge(job.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Job Title</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Warehouse Associate"
                />
              ) : (
                <p className="mt-1 text-lg font-medium">{job.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the job responsibilities and requirements"
                />
              ) : (
                <p className="mt-1 text-gray-700">{job.description}</p>
              )}
            </div>

            {/* Pay Rate */}
            <div>
              <Label htmlFor="payRate">Pay Rate ($/hour)</Label>
              {isEditing ? (
                <Input
                  id="payRate"
                  type="number"
                  step="0.01"
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  placeholder="e.g., 25.00"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <DollarSign className="size-4 text-gray-400" />
                  <span className="text-lg font-medium">${job.payRate}/hour</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                />
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="size-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
              )}
            </div>

            {/* Work Period (Read-only) */}
            <div>
              <Label>Work Period</Label>
              <div className="mt-1 flex items-center gap-2 text-gray-700">
                <Calendar className="size-4 text-gray-400" />
                <span>{new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Required Qualifications */}
            {job.requiredQualifications.length > 0 && (
              <div>
                <Label>Required Qualifications</Label>
                <div className="flex gap-2 flex-wrap mt-2">
                  {job.requiredQualifications.map((qual) => (
                    <Badge key={qual} variant="outline">{qual}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Expiration */}
            {job.status === 'open' && job.expiresAt && (
              <div className="bg-orange-50 p-3 rounded">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="size-4 text-orange-600" />
                  <span className="font-medium">Application Deadline:</span>
                  <CountdownTimer expiresAt={job.expiresAt} />
                </div>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button onClick={handleSave}>
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setTitle(job.title);
                setDescription(job.description);
                setPayRate(job.payRate.toString());
                setLocation(job.location);
              }}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="size-5" />
              Applications
            </span>
            {applications.length > 0 && (
              <Button onClick={() => navigate(`/business/jobs/${id}/applications`)}>
                View All Applications
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{applications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(a => a.status === 'invited').length}
              </div>
              <div className="text-sm text-gray-600">Invited</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
              {applications.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  This job has {applications.length} application(s) and cannot be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={applications.length > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Job Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this job posting? 
              {applications.length > 0 && (
                <span className="block mt-2">
                  All applicants will be notified that the position has been canceled.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Job Active</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-orange-600 hover:bg-orange-700">
              Yes, Cancel Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};