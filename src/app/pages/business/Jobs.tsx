import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockJobs, JobStatus, mockApplications } from '../../services/mockData';
import { Briefcase, MapPin, DollarSign, Calendar, Users, AlertCircle } from 'lucide-react';
import { CountdownTimer } from '../../components/CountdownTimer';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

const ITEMS_PER_PAGE = 6;

export const BusinessJobs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get business's jobs
  const myJobs = mockJobs.filter(job => job.businessId === user?.id);

  // Filter jobs
  const filteredJobs = statusFilter === 'all' 
    ? myJobs 
    : myJobs.filter(job => job.status === statusFilter);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const getApplicationsCount = (jobId: string) => {
    return mockApplications.filter(app => app.jobId === jobId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Verification Warning */}
      {!user?.isVerified && (
        <Alert className="mb-6 border-orange-500 bg-orange-50">
          <AlertCircle className="size-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Your business account is pending verification. You can create and view job postings, but they will only become visible to workers once your account is verified by an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">My Job Postings</h1>
          <p className="text-gray-600">
            Manage your active and past job listings
          </p>
        </div>
        <Button onClick={() => navigate('/business/post-job')} size="lg">
          <Briefcase className="size-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as JobStatus | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {paginatedJobs.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {paginatedJobs.map((job) => {
              const applicationsCount = getApplicationsCount(job.id);
              const pendingCount = mockApplications.filter(
                app => app.jobId === job.id && app.status === 'pending'
              ).length;

              return (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {getStatusBadge(job.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="size-4 text-gray-400" />
                        <span>${job.payRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>{new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-gray-400" />
                        <span>{applicationsCount} applications</span>
                        {pendingCount > 0 && (
                          <Badge variant="secondary">{pendingCount} pending</Badge>
                        )}
                      </div>
                    </div>

                    {job.status === 'open' && job.expiresAt && (
                      <div className="bg-orange-50 p-2 rounded text-sm mb-4">
                        Closes in: <CountdownTimer expiresAt={job.expiresAt} />
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap mb-4">
                      {job.requiredQualifications.map((qual) => (
                        <Badge key={qual} variant="outline">{qual}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/business/manage-job/${job.id}`)}
                      >
                        Manage Job
                      </Button>
                      {applicationsCount > 0 && (
                        <Button 
                          className="flex-1"
                          onClick={() => navigate(`/business/jobs/${job.id}/applications`)}
                        >
                          Review Applications
                        </Button>
                      )}
                    </div>

                    {job.status === 'open' && (
                      <div className="mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => navigate(`/business/jobs/${job.id}/candidates`)}
                        >
                          Find Candidates
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all' 
                ? "You haven't posted any jobs yet" 
                : `No ${statusFilter} jobs`}
            </p>
            <Button onClick={() => navigate('/business/post-job')}>
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};