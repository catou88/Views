import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { mockJobs, mockApplications, mockQualifications } from '../../services/mockData';
import { Users, Briefcase, FileText, Award, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Calculate stats
  const totalUsers = 150; // Mock data
  const totalJobs = mockJobs.length;
  const totalApplications = mockApplications.length;
  const pendingQualifications = mockQualifications.filter(q => q.status === 'pending').length;

  const openJobs = mockJobs.filter(j => j.status === 'open').length;
  const pendingApplications = mockApplications.filter(a => a.status === 'pending').length;
  const approvedQualifications = mockQualifications.filter(q => q.status === 'approved').length;

  // Recent activity
  const recentQualifications = mockQualifications
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          System overview and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="size-4" />
              <span>Workers & Businesses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{totalJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="size-4" />
              <span>{openJobs} currently open</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Applications</CardDescription>
            <CardTitle className="text-3xl">{totalApplications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="size-4" />
              <span>{pendingApplications} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Qualifications</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{pendingQualifications}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="size-4" />
              <span>Need review</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* System Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase className="size-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Open Jobs</div>
                    <div className="text-sm text-gray-600">Currently accepting applications</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{openJobs}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-600" />
                  <div>
                    <div className="font-medium">Approved Qualifications</div>
                    <div className="text-sm text-gray-600">Verified credentials</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">{approvedQualifications}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Pending Reviews</div>
                    <div className="text-sm text-gray-600">Qualifications awaiting approval</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">{pendingQualifications}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="size-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Platform Activity</div>
                    <div className="text-sm text-gray-600">Last 30 days</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">+24%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Qualifications & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Qualification Submissions</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin/qualifications')}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentQualifications.length > 0 ? (
                <div className="space-y-3">
                  {recentQualifications.map((qual) => (
                    <div key={qual.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{qual.type}</div>
                          <div className="text-sm text-gray-600">{qual.userName}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          qual.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          qual.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {qual.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No recent submissions
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/qualifications')}
                >
                  <Award className="size-4 mr-2" />
                  Review Qualifications
                  {pendingQualifications > 0 && (
                    <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      {pendingQualifications}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className="size-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/jobs')}
                >
                  <Briefcase className="size-4 mr-2" />
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
