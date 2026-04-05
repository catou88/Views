import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockJobs, mockApplications, mockQualifications } from '../../services/mockData';
import { Briefcase, FileText, Award, TrendingUp, Clock, CheckCircle, User, Mail, Phone, MapPin, Calendar, Download, Edit, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AvailabilityToggle } from '../../components/AvailabilityToggle';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load user profile data from localStorage
  const loadedProfile = localStorage.getItem('userProfile');
  const savedProfile = loadedProfile ? JSON.parse(loadedProfile) : null;

  // Mock user profile data - in real app, this would come from API
  const userProfile = {
    avatar: savedProfile?.avatarPreview || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: savedProfile?.bio || 'Experienced React developer with 5+ years of expertise in building scalable web applications. Passionate about clean code and user experience.',
    phone: savedProfile?.phone || '+1 (555) 123-4567',
    location: savedProfile?.location || 'San Francisco, CA',
    dateJoined: '2024-01-15',
    availability: savedProfile?.availability || 'available', // available, busy, unavailable
    resume: savedProfile?.resumeName || 'John_Doe_Resume.pdf',
    skills: savedProfile?.skills ? savedProfile.skills.split(',').map((s: string) => s.trim()) : ['React', 'TypeScript', 'Node.js', 'AWS'],
  };

  // Check for inactivity (mock - in real app, this would come from backend)
  const lastActivityDate = user?.lastActivity ? new Date(user.lastActivity) : new Date();
  const daysSinceActivity = Math.floor((new Date().getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
  const availabilityTimeout = 30; // System config: availability timeout in days
  const isInactive = daysSinceActivity > availabilityTimeout;
  
  // Check if user has active negotiation (mock)
  const hasActiveNegotiation = false; // In real app, check from API
  
  // Check if user is suspended
  const isSuspended = user?.isSuspended || false;
  
  // Check if user is activated
  const isActivated = user?.isActivated || true;
  
  // Determine effective availability
  let effectiveAvailability = userProfile.availability;
  let availabilityReason = '';
  
  if (!isActivated) {
    effectiveAvailability = 'unavailable';
    availabilityReason = 'Your account is not activated';
  } else if (isSuspended) {
    effectiveAvailability = 'unavailable';
    availabilityReason = 'Your account has been suspended';
  } else if (isInactive && userProfile.availability === 'available') {
    effectiveAvailability = 'unavailable';
    availabilityReason = `You are currently unavailable due to inactivity (${daysSinceActivity} days since last activity)`;
  } else if (hasActiveNegotiation) {
    availabilityReason = 'You are in an active negotiation';
  }

  // Get user's applications
  const myApplications = mockApplications.filter(app => app.workerId === user?.id);
  const pendingApplications = myApplications.filter(app => app.status === 'pending').length;
  const acceptedApplications = myApplications.filter(app => app.status === 'accepted').length;

  // Get user's qualifications
  const myQualifications = mockQualifications.filter(qual => qual.userId === user?.id);
  const approvedQualifications = myQualifications.filter(qual => qual.status === 'approved');
  const pendingQualifications = myQualifications.filter(qual => qual.status === 'pending').length;

  // Get open jobs count
  const openJobs = mockJobs.filter(job => job.status === 'open').length;

  // Recent applications with job details
  const recentApplications = myApplications.slice(0, 3).map(app => ({
    ...app,
    job: mockJobs.find(j => j.id === app.jobId),
  }));

  const profileComplete = user?.profileComplete ?? false;

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">My Dashboard</h1>
        <p className="text-gray-600">
          View and manage your profile, applications, and qualifications
        </p>
      </div>

      {/* Profile Incomplete Alert */}
      {!profileComplete && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertDescription className="flex items-center justify-between">
            <span>Complete your profile to increase your chances of getting hired</span>
            <Button onClick={() => navigate('/profile')} size="sm">
              Complete Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Availability Status Toggle */}
      <div className="mb-6">
        <AvailabilityToggle />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card - Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Profile</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <Edit className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar and Name */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden bg-gray-100">
                  <img 
                    src={userProfile.avatar} 
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Availability Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Availability</span>
                  <Badge className={getAvailabilityColor(effectiveAvailability)}>
                    {effectiveAvailability}
                  </Badge>
                </div>
                {availabilityReason && (
                  <div className="text-xs text-gray-500">
                    <AlertCircle className="size-4 mr-1" />
                    {availabilityReason}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="text-sm">{userProfile.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm">{userProfile.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="size-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Member Since</div>
                    <div className="text-sm">{new Date(userProfile.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-gray-700 mb-2">Resume</div>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="size-4 mr-2" />
                  {userProfile.resume}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending Applications</CardDescription>
                <CardTitle className="text-3xl">{pendingApplications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="size-4" />
                  <span>Awaiting review</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Accepted</CardDescription>
                <CardTitle className="text-3xl text-green-600">{acceptedApplications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="size-4" />
                  <span>Active offers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Qualifications</CardDescription>
                <CardTitle className="text-3xl">{approvedQualifications.length}/{myQualifications.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="size-4" />
                  <span>Approved</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Available Jobs</CardDescription>
                <CardTitle className="text-3xl text-blue-600">{openJobs}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="size-4" />
                  <span>Open positions</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approved Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Approved Qualifications</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/worker/qualifications')}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedQualifications.length > 0 ? (
                <div className="space-y-3">
                  {approvedQualifications.map((qual) => (
                    <div key={qual.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Award className="size-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{qual.name}</div>
                        <div className="text-sm text-gray-600">{qual.type}</div>
                        {qual.expiryDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Expires: {new Date(qual.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Approved
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="size-12 mx-auto mb-2 text-gray-300" />
                  <p>No approved qualifications yet</p>
                  <Button onClick={() => navigate('/worker/qualifications')} className="mt-4" size="sm">
                    Add Qualifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Applications</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/worker/applications')}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{app.job?.title}</div>
                          <div className="text-sm text-gray-600">{app.job?.businessName}</div>
                        </div>
                        <Badge variant={
                          app.status === 'accepted' ? 'default' : 
                          app.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="size-12 mx-auto mb-2 text-gray-300" />
                  <p>No applications yet</p>
                  <Button onClick={() => navigate('/jobs')} className="mt-4" size="sm">
                    Browse Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/jobs')}
                >
                  <Briefcase className="size-4 mr-2" />
                  Browse Available Jobs
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/worker/applications')}
                >
                  <FileText className="size-4 mr-2" />
                  View My Applications
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/worker/qualifications')}
                >
                  <Award className="size-4 mr-2" />
                  Manage Qualifications
                  {pendingQualifications > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {pendingQualifications} Pending
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <TrendingUp className="size-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};