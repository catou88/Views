import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockApplications, mockJobs, ApplicationStatus } from '../../services/mockData';
import { FileText, MapPin, DollarSign, Calendar } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

const ITEMS_PER_PAGE = 5;

export const WorkerApplications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get user's applications from both localStorage and mock data
  const getUserApplications = () => {
    // Load from localStorage
    const savedApps = JSON.parse(localStorage.getItem('userApplications') || '[]');
    const userSavedApps = savedApps.filter((app: any) => app.workerId === user?.id);
    
    // Load from mock data
    const mockApps = mockApplications.filter(app => app.workerId === user?.id);
    
    // Combine both sources
    return [...userSavedApps, ...mockApps];
  };

  // Get user's applications with job details
  const myApplications = getUserApplications()
    .map(app => ({
      ...app,
      job: mockJobs.find(j => j.id === app.jobId)!,
    }))
    .filter(app => app.job); // Filter out applications for deleted jobs

  // Filter applications
  const filteredApplications = statusFilter === 'all' 
    ? myApplications 
    : myApplications.filter(app => app.status === statusFilter);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const getStatusDescription = (status: ApplicationStatus) => {
    const descriptions: Record<ApplicationStatus, string> = {
      pending: 'Your application is under review by the employer',
      accepted: 'Congratulations! Your application has been accepted',
      rejected: 'Unfortunately, your application was not selected',
      withdrawn: 'You have withdrawn this application',
    };
    return descriptions[status];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track the status of your job applications
          </p>
        </div>
        <Button onClick={() => navigate('/jobs')}>
          Browse More Jobs
        </Button>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as ApplicationStatus | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {paginatedApplications.length > 0 ? (
        <div className="space-y-4 mb-8">
          {paginatedApplications.map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 
                          className="text-xl font-semibold mb-1 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/jobs/${app.jobId}`)}
                        >
                          {app.job.title}
                        </h3>
                        <p className="text-gray-600">{app.job.businessName}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-gray-400" />
                        <span>{app.job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="size-4 text-gray-400" />
                        <span>${app.job.payRate}/hour</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-gray-400" />
                        <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{getStatusDescription(app.status)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/jobs/${app.jobId}`)}
                  >
                    View Job
                  </Button>
                  
                  {app.coverLetter && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          View Cover Letter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cover Letter</DialogTitle>
                        </DialogHeader>
                        <div className="whitespace-pre-wrap text-sm">
                          {app.coverLetter}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {app.status === 'pending' && (
                    <Button variant="ghost" className="text-red-600">
                      Withdraw Application
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all' 
                ? "You haven't applied to any jobs yet" 
                : `No ${statusFilter} applications`}
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};