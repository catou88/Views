import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockJobs, mockApplications, Application, mockUsers } from '../../services/mockData';
import { Search, Filter, User, Briefcase, Calendar, CheckCircle, Clock, X, Heart } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export const BusinessApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Application['status'] | 'all'>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get business's jobs
  const myJobs = mockJobs.filter(job => job.businessId === user?.id);
  const jobIds = myJobs.map(j => j.id);

  // Get all applications for business's jobs
  const allApplications = mockApplications.filter(app => jobIds.includes(app.jobId));

  // Filter applications
  let filteredApplications = allApplications.filter((app) => {
    const worker = mockUsers.find(u => u.id === app.workerId);
    const job = mockJobs.find(j => j.id === app.jobId);
    
    const matchesSearch = worker?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Sort by date (newest first)
  filteredApplications = [...filteredApplications].sort((a, b) => 
    new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (status: Application['status']) => {
    const variants: Record<Application['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'default', label: 'Pending' },
      invited: { variant: 'secondary', label: 'Invited' },
      accepted: { variant: 'secondary', label: 'Accepted' },
      rejected: { variant: 'outline', label: 'Rejected' },
      withdrawn: { variant: 'outline', label: 'Withdrawn' },
    };
    
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleExpressInterest = (appId: string) => {
    // Update application status to "invited"
    toast.success('Invitation sent to candidate!');
  };

  const handleReject = (appId: string) => {
    // Update application status to "rejected"
    toast.success('Application rejected');
  };

  const handleViewCandidate = (jobId: string, workerId: string) => {
    navigate(`/business/jobs/${jobId}/candidates/${workerId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">All Applications</h1>
        <p className="text-gray-600">
          Review and manage applications across all your job postings
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{allApplications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {allApplications.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {allApplications.filter(a => a.status === 'invited').length}
            </div>
            <div className="text-sm text-gray-600">Invited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {allApplications.filter(a => a.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by candidate or job..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as Application['status'] | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>

            <Select value={jobFilter} onValueChange={(value) => {
              setJobFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <Briefcase className="size-4 mr-2" />
                <SelectValue placeholder="Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {myJobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Showing {paginatedApplications.length} of {filteredApplications.length} applications
      </div>

      {/* Applications List */}
      {paginatedApplications.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {paginatedApplications.map((app) => {
              const job = mockJobs.find(j => j.id === app.jobId);
              const worker = mockUsers.find(u => u.id === app.workerId);
              
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {/* Avatar */}
                        <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="size-6 text-gray-500" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{worker?.name || 'Unknown Worker'}</h3>
                              <p className="text-sm text-gray-600">{worker?.email}</p>
                            </div>
                            {getStatusBadge(app.status)}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Briefcase className="size-4" />
                              <span className="font-medium text-gray-900">{job?.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Qualifications */}
                          {app.qualifications && app.qualifications.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-1">Qualifications:</p>
                              <div className="flex gap-2 flex-wrap">
                                {app.qualifications.map((qual, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {qual}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cover Letter Preview */}
                          {app.coverLetter && (
                            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                              "{app.coverLetter}"
                            </p>
                          )}

                          {/* Mutual Interest */}
                          {app.mutualInterest && (
                            <div className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 p-2 rounded mb-3">
                              <Heart className="size-4 fill-current" />
                              <span>Mutual interest reached!</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              size="sm"
                              onClick={() => handleViewCandidate(app.jobId, app.workerId)}
                            >
                              View Details
                            </Button>
                            
                            {app.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExpressInterest(app.id)}
                                >
                                  <Heart className="size-4 mr-1" />
                                  Express Interest
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(app.id)}
                                >
                                  <X className="size-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {app.mutualInterest && app.status === 'invited' && (
                              <Button 
                                size="sm"
                                variant="secondary"
                                onClick={() => navigate(`/negotiation?jobId=${app.jobId}&workerId=${app.workerId}`)}
                              >
                                Start Negotiation
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
            <Briefcase className="size-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No applications found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
