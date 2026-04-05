import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { mockQualifications, QualificationStatus } from '../../services/mockData';
import { Award, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

const ITEMS_PER_PAGE = 5;

export const AdminQualifications: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<QualificationStatus | 'all'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedQual, setSelectedQual] = useState<string | null>(null);

  // Filter qualifications
  const filteredQualifications = statusFilter === 'all' 
    ? mockQualifications 
    : mockQualifications.filter(qual => qual.status === statusFilter);

  // Sort by date
  const sortedQualifications = [...filteredQualifications].sort(
    (a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedQualifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQualifications = sortedQualifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (status: QualificationStatus) => {
    const variants: Record<QualificationStatus, { variant: 'default' | 'secondary' | 'destructive'; label: string; icon: React.ReactNode }> = {
      pending: { 
        variant: 'secondary', 
        label: 'Pending Review',
        icon: <Clock className="size-4" />
      },
      approved: { 
        variant: 'default', 
        label: 'Approved',
        icon: <CheckCircle className="size-4" />
      },
      rejected: { 
        variant: 'destructive', 
        label: 'Rejected',
        icon: <XCircle className="size-4" />
      },
    };
    
    const { variant, label, icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {label}
      </Badge>
    );
  };

  const handleApprove = (qualId: string) => {
    toast.success('Qualification approved successfully');
    setSelectedQual(null);
    setReviewNotes('');
  };

  const handleReject = (qualId: string) => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    toast.success('Qualification rejected with feedback');
    setSelectedQual(null);
    setReviewNotes('');
  };

  const pendingCount = mockQualifications.filter(q => q.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Review Qualifications</h1>
        <p className="text-gray-600">
          Verify and approve worker credentials
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="size-5" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="size-5" />
              <span className="text-sm font-medium">Approved</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {mockQualifications.filter(q => q.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="size-5" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {mockQualifications.filter(q => q.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as QualificationStatus | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="all">All Qualifications</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">
              {filteredQualifications.length} qualification{filteredQualifications.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Qualifications List */}
      {paginatedQualifications.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {paginatedQualifications.map((qual) => (
              <Card key={qual.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="size-5 text-blue-600" />
                        <h3 className="text-xl font-semibold">{qual.type}</h3>
                        {getStatusBadge(qual.status)}
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-600">Submitted by: </span>
                        <span className="text-sm">{qual.userName}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="text-sm font-medium mb-1">Description:</div>
                        <p className="text-sm text-gray-700">{qual.description}</p>
                      </div>

                      {qual.documentUrl && (
                        <Button variant="outline" size="sm" className="mb-4">
                          <FileText className="size-4 mr-2" />
                          View Supporting Document
                        </Button>
                      )}

                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          Submitted: {new Date(qual.submittedDate).toLocaleDateString()} at{' '}
                          {new Date(qual.submittedDate).toLocaleTimeString()}
                        </div>
                        {qual.reviewedDate && (
                          <div>
                            Reviewed: {new Date(qual.reviewedDate).toLocaleDateString()}
                            {qual.reviewedBy && ` by ${qual.reviewedBy}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {qual.status === 'pending' && (
                    <Dialog open={selectedQual === qual.id} onOpenChange={(open) => {
                      if (!open) {
                        setSelectedQual(null);
                        setReviewNotes('');
                      }
                    }}>
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          variant="default"
                          onClick={() => handleApprove(qual.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="size-4 mr-2" />
                          Approve
                        </Button>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive"
                            onClick={() => setSelectedQual(qual.id)}
                            className="flex-1"
                          >
                            <XCircle className="size-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                      </div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Qualification</DialogTitle>
                          <DialogDescription>
                            Please provide feedback explaining why this qualification is being rejected
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reviewNotes">Reason for Rejection *</Label>
                            <Textarea
                              id="reviewNotes"
                              placeholder="Provide specific details about why this qualification cannot be approved..."
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleReject(qual.id)}
                            className="w-full"
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {qual.status !== 'pending' && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      qual.status === 'approved' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      <div className="text-sm font-medium">
                        {qual.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
            <Award className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No qualifications found</h3>
            <p className="text-gray-600">
              {statusFilter === 'pending' 
                ? 'All qualifications have been reviewed' 
                : `No ${statusFilter} qualifications`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
