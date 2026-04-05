import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Briefcase, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [payRate, setPayRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQualification, setNewQualification] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location || !payRate || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate end date is after start date
    if (start >= end) {
      toast.error('End date must be after start date');
      return;
    }

    // System setting: Cannot post job with start date more than 1 week in the future (default)
    const maxFutureDays = 7; // System-wide setting
    const maxFutureDate = new Date(today);
    maxFutureDate.setDate(maxFutureDate.getDate() + maxFutureDays);
    
    if (start > maxFutureDate) {
      toast.error(`Job start date cannot be more than ${maxFutureDays} days in the future`);
      return;
    }

    // Calculate if there's enough time for negotiation before job starts
    // Assuming negotiation window is 3 days (system setting)
    const negotiationWindowDays = 3;
    const minStartDate = new Date(today);
    minStartDate.setDate(minStartDate.getDate() + negotiationWindowDays);
    
    if (start < minStartDate) {
      toast.error(`Job must start at least ${negotiationWindowDays} days from now to allow for negotiation`);
      return;
    }

    // Check if application deadline allows enough time for negotiation
    const applicationDeadline = new Date(today);
    applicationDeadline.setDate(applicationDeadline.getDate() + parseInt(expirationDays));
    
    const timeBetweenDeadlineAndStart = Math.floor((start.getTime() - applicationDeadline.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeBetweenDeadlineAndStart < negotiationWindowDays) {
      toast.error(`Application deadline must be at least ${negotiationWindowDays} days before job start date to allow for negotiation`);
      return;
    }

    if (qualifications.length === 0) {
      toast.error('Please add at least one required qualification');
      return;
    }

    // In real app, this would make an API call
    toast.success('Job posted successfully!');
    navigate('/business/jobs');
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/business/dashboard')}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl mt-4 mb-2">Post a New Job</h1>
        <p className="text-gray-600">
          Fill out the details below to create a new job posting
        </p>
      </div>

      {/* Verification Warning */}
      {!user?.isVerified && (
        <Alert className="mb-6 border-orange-500 bg-orange-50">
          <AlertCircle className="size-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Your business account is pending verification. You can create job postings, but they will only become visible to workers once your account is verified by an administrator.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Include key responsibilities, required skills, and what makes this opportunity unique
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="payRate">Pay Rate ($/hour) *</Label>
                <Input
                  id="payRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 85"
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={getTodayDate()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={startDate || getTodayDate()}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expirationDays">Application Deadline</Label>
              <Select value={expirationDays} onValueChange={setExpirationDays}>
                <SelectTrigger id="expirationDays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days from now</SelectItem>
                  <SelectItem value="7">7 days from now</SelectItem>
                  <SelectItem value="14">14 days from now</SelectItem>
                  <SelectItem value="30">30 days from now</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Applications will automatically close after this period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Required Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qualifications">Add Qualification</Label>
              <div className="flex gap-2">
                <Input
                  id="qualifications"
                  placeholder="e.g., React Certification, Medical License"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQualification();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddQualification}>
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Workers must have these qualifications approved to apply
              </p>
            </div>

            {qualifications.length > 0 && (
              <div>
                <Label>Added Qualifications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {qualifications.map((qual, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {qual}
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {qualifications.length === 0 && (
              <Alert>
                <AlertDescription>
                  <Briefcase className="size-4 inline mr-2" />
                  Add at least one required qualification for applicants
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Preview</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Title:</span> {title || 'Not set'}</div>
              <div><span className="font-medium">Location:</span> {location || 'Not set'}</div>
              <div><span className="font-medium">Pay Rate:</span> {payRate ? `$${payRate}/hour` : 'Not set'}</div>
              <div><span className="font-medium">Duration:</span> {startDate && endDate ? `${startDate} to ${endDate}` : 'Not set'}</div>
              <div><span className="font-medium">Qualifications:</span> {qualifications.length || '0'} required</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" className="flex-1">
            Post Job
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/business/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};