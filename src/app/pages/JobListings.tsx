import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockJobs, Job, JobStatus, mockQualifications } from '../services/mockData';
import { CountdownTimer } from '../components/CountdownTimer';
import { MapPin, DollarSign, Calendar, Clock, Search, Filter, Navigation, CheckCircle, Award } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 6;

export const JobListings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showOnlyApproved, setShowOnlyApproved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'pay'>('date');

  // Get user's applied job IDs from localStorage
  const getAppliedJobIds = (): Set<string> => {
    const savedApps = JSON.parse(localStorage.getItem('userApplications') || '[]');
    return new Set(savedApps.map((app: any) => app.jobId));
  };

  const appliedJobIds = getAppliedJobIds();

  // Get user's approved qualifications
  const getUserApprovedQualifications = (): Set<string> => {
    if (!user) return new Set();
    const userQuals = mockQualifications.filter(
      qual => qual.userId === user.id && qual.status === 'approved'
    );
    return new Set(userQuals.map(q => q.type));
  };

  const userQualifications = getUserApprovedQualifications();

  // Check if user is approved for a job (has all required qualifications approved)
  const userIsApprovedForJob = (job: Job): boolean => {
    if (job.requiredQualifications.length === 0) return true;
    return job.requiredQualifications.every(req => userQualifications.has(req));
  };

  // Filter jobs
  let filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesApproved = !showOnlyApproved || userIsApprovedForJob(job);
    return matchesSearch && matchesStatus && matchesLocation && matchesApproved;
  });

  // Sort jobs
  filteredJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'pay') {
      return b.payRate - a.payRate;
    }
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Browse Job Opportunities</h1>
        <p className="text-gray-600">
          Find temporary positions that match your skills
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as JobStatus | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'pay')}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Newest First</SelectItem>
                <SelectItem value="pay">Highest Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admin Approved Filter */}
          {user && (
            <div className="flex items-center gap-3 pt-3 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyApproved}
                  onChange={(e) => {
                    setShowOnlyApproved(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-blue-600" />
                  <span className="text-sm">Show only jobs I'm approved for</span>
                </div>
              </label>
              {showOnlyApproved && (
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {userQualifications.size} approved qualification{userQualifications.size !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Showing {paginatedJobs.length} of {filteredJobs.length} jobs
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {paginatedJobs.map((job) => {
          const hasApplied = appliedJobIds.has(job.id);
          const isApproved = userIsApprovedForJob(job);
          
          return (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardDescription className="text-blue-600 font-medium mb-1">
                      {job.businessName}
                    </CardDescription>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {hasApplied && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        Applied
                      </Badge>
                    )}
                    {isApproved && user && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Award className="size-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {getStatusBadge(job.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {/* Salary Range */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-500">Pay Rate: </span>
                      <span className="font-semibold">${job.payRate}/hour</span>
                    </div>
                  </div>
                  
                  {/* Work Time Window */}
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-500">Work Period: </span>
                      <span className="text-sm">
                        {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm">{job.location}</span>
                  </div>

                  {/* Optional: Travel Distance & ETA */}
                  {/* This would be calculated based on user's location in a real app */}
                  <div className="flex items-center gap-2 text-gray-500">
                    <Navigation className="size-4 flex-shrink-0" />
                    <span className="text-sm">~15 miles • 25 min drive</span>
                  </div>
                </div>

                {job.status === 'open' && job.expiresAt && (
                  <div className="flex items-center gap-2 text-sm bg-orange-50 p-2 rounded mb-3">
                    <Clock className="size-4 text-orange-600" />
                    <span>Expires in: <CountdownTimer expiresAt={job.expiresAt} /></span>
                  </div>
                )}

                {hasApplied && (
                  <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded mb-3 text-green-700">
                    <CheckCircle className="size-4" />
                    <span>You have already applied for this position</span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap mt-3">
                  {job.requiredQualifications.map((qual) => (
                    <Badge key={qual} variant="outline" className="text-xs">{qual}</Badge>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  {job.applicationsCount} applications
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

      {paginatedJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No jobs found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};