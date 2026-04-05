import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockJobs, mockApplications } from '../../services/mockData';
import { Briefcase, Users, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get business's jobs
  const myJobs = mockJobs.filter(job => job.businessId === user?.id);
  const openJobs = myJobs.filter(job => job.status === 'open').length;
  const filledJobs = myJobs.filter(job => job.status === 'filled').length;

  // Get applications for business's jobs
  const jobIds = myJobs.map(j => j.id);
  const allApplications = mockApplications.filter(app => jobIds.includes(app.jobId));
  const pendingApplications = allApplications.filter(app => app.status === 'pending').length;

  // Recent jobs
  const recentJobs = myJobs.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Business Dashboard</h1>
        <p className="text-gray-600">
          Manage your job postings and applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Jobs</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{openJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="size-4" />
              <span>Currently hiring</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Filled Positions</CardDescription>
            <CardTitle className="text-3xl text-green-600">{filledJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="size-4" />
              <span>Successfully filled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Applications</CardDescription>
            <CardTitle className="text-3xl">{pendingApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="size-4" />
              <span>Need review</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-3xl">{allApplications.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="size-4" />
              <span>All time</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Job Postings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Job Postings</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/business/jobs')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => {
                  const applicationsCount = mockApplications.filter(app => app.jobId === job.id).length;
                  return (
                    <div key={job.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div 
                            className="font-semibold cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/business/jobs/${job.id}`)}
                          >
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-600">{job.location}</div>
                        </div>
                        <Badge variant={
                          job.status === 'open' ? 'default' : 
                          job.status === 'filled' ? 'secondary' : 
                          'outline'
                        }>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{applicationsCount} applications</span>
                        <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="size-12 mx-auto mb-2 text-gray-300" />
                <p>No job postings yet</p>
                <Button onClick={() => navigate('/business/jobs')} className="mt-4" size="sm">
                  Go to My Jobs
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
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/business/jobs')}
              >
                <FileText className="size-4 mr-2" />
                View All Job Postings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/business/applications')}
              >
                <Users className="size-4 mr-2" />
                Review Applications
                {pendingApplications > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {pendingApplications} Pending
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/business/profile')}
              >
                <TrendingUp className="size-4 mr-2" />
                Company Profile
              </Button>
            </div>

            {/* Tips Card */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-sm">💡 Hiring Tip</h4>
              <p className="text-sm text-gray-700">
                Jobs with detailed descriptions and competitive pay rates receive 3x more applications
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};