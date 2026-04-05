import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Building2, Search, CheckCircle, XCircle, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

interface Business {
  id: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  employeeCount: string;
  verified: boolean;
  activeJobs: number;
  joinedDate: string;
  description: string;
}

const mockBusinesses: Business[] = [
  {
    id: 'b1',
    name: 'Tech Solutions Inc',
    email: 'contact@techsolutions.example.com',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employeeCount: '200-500',
    verified: true,
    activeJobs: 5,
    joinedDate: '2024-01-15',
    description: 'Leading software development company',
  },
  {
    id: 'b2',
    name: 'Creative Agency',
    email: 'hello@creativeagency.example.com',
    industry: 'Marketing & Design',
    location: 'New York, NY',
    employeeCount: '50-100',
    verified: true,
    activeJobs: 3,
    joinedDate: '2024-03-20',
    description: 'Full-service creative agency',
  },
  {
    id: 'b3',
    name: 'Healthcare Plus',
    email: 'info@healthcareplus.example.com',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    employeeCount: '500-1000',
    verified: true,
    activeJobs: 8,
    joinedDate: '2023-11-10',
    description: 'Modern healthcare facility',
  },
  {
    id: 'b4',
    name: 'Green Energy Corp',
    email: 'contact@greenenergy.example.com',
    industry: 'Energy',
    location: 'Austin, TX',
    employeeCount: '100-200',
    verified: false,
    activeJobs: 2,
    joinedDate: '2024-02-05',
    description: 'Renewable energy company',
  },
  {
    id: 'b5',
    name: 'Education First',
    email: 'info@educationfirst.example.com',
    industry: 'Education',
    location: 'Boston, MA',
    employeeCount: '50-100',
    verified: false,
    activeJobs: 4,
    joinedDate: '2024-04-01',
    description: 'Educational technology platform',
  },
];

const ITEMS_PER_PAGE = 10;

export const AdminBusinesses: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter businesses
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVerification = 
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && business.verified) ||
      (verificationFilter === 'unverified' && !business.verified);
    
    const matchesIndustry = 
      industryFilter === 'all' || business.industry === industryFilter;
    
    return matchesSearch && matchesVerification && matchesIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique industries
  const industries = ['all', ...Array.from(new Set(businesses.map(b => b.industry)))];

  const handleVerify = (id: string) => {
    setBusinesses(prev =>
      prev.map(b =>
        b.id === id ? { ...b, verified: true } : b
      )
    );
    
    const business = businesses.find(b => b.id === id);
    toast.success(`${business?.name} has been verified`);
  };

  const handleUnverify = (id: string) => {
    setBusinesses(prev =>
      prev.map(b =>
        b.id === id ? { ...b, verified: false } : b
      )
    );
    
    const business = businesses.find(b => b.id === id);
    toast.success(`${business?.name} verification has been removed`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Business Management</h1>
        <p className="text-gray-600">
          Manage and verify business accounts on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Total Businesses</p>
            <p className="text-3xl font-bold">{businesses.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-3xl font-bold text-green-600">
              {businesses.filter(b => b.verified).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Pending Verification</p>
            <p className="text-3xl font-bold text-orange-600">
              {businesses.filter(b => !b.verified).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Active Jobs</p>
            <p className="text-3xl font-bold text-blue-600">
              {businesses.reduce((sum, b) => sum + b.activeJobs, 0)}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Verification Filter */}
            <Select value={verificationFilter} onValueChange={(value: typeof verificationFilter) => {
              setVerificationFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={(value) => {
              setIndustryFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {paginatedBusinesses.length} of {filteredBusinesses.length} businesses
      </div>

      {/* Businesses List */}
      {paginatedBusinesses.length > 0 ? (
        <div className="space-y-4 mb-8">
          {paginatedBusinesses.map((business) => (
            <Card key={business.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{business.name}</h3>
                        {business.verified ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <CheckCircle className="size-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800 gap-1">
                            <XCircle className="size-3" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{business.description}</p>
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4" />
                          <span>{business.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span>{business.location}</span>
                        </div>
                        <div>
                          Industry: <strong>{business.industry}</strong>
                        </div>
                        <div>
                          Employees: <strong>{business.employeeCount}</strong>
                        </div>
                        <div>
                          Active Jobs: <strong>{business.activeJobs}</strong>
                        </div>
                        <div>
                          Joined: <strong>{new Date(business.joinedDate).toLocaleDateString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/businesses/${business.id}`)}
                    >
                      View Profile
                    </Button>
                    {business.verified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnverify(business.id)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Unverify
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(business.id)}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Building2 className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No Businesses Found</h3>
            <p className="text-gray-600 mb-4">
              No businesses match your current filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setVerificationFilter('all');
              setIndustryFilter('all');
              setCurrentPage(1);
            }}>
              Clear Filters
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
