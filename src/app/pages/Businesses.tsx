import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Building2, MapPin, Search, Users, Star, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface Business {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  employeeCount: string;
  activeJobs: number;
  rating: number;
  verified: boolean;
  joinedDate: string;
}

// Mock business data
const mockBusinesses: Business[] = [
  {
    id: 'b1',
    name: 'Tech Solutions Inc',
    industry: 'Technology',
    location: 'San Francisco, CA',
    description: 'Leading software development company specializing in enterprise solutions.',
    employeeCount: '200-500',
    activeJobs: 5,
    rating: 4.8,
    verified: true,
    joinedDate: '2024-01-15',
  },
  {
    id: 'b2',
    name: 'Creative Agency',
    industry: 'Marketing & Design',
    location: 'New York, NY',
    description: 'Full-service creative agency delivering innovative marketing solutions.',
    employeeCount: '50-100',
    activeJobs: 3,
    rating: 4.6,
    verified: true,
    joinedDate: '2024-03-20',
  },
  {
    id: 'b3',
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    description: 'Modern healthcare facility committed to patient care excellence.',
    employeeCount: '500-1000',
    activeJobs: 8,
    rating: 4.9,
    verified: true,
    joinedDate: '2023-11-10',
  },
  {
    id: 'b4',
    name: 'Green Energy Corp',
    industry: 'Energy',
    location: 'Austin, TX',
    description: 'Renewable energy company focused on sustainable solutions.',
    employeeCount: '100-200',
    activeJobs: 2,
    rating: 4.7,
    verified: true,
    joinedDate: '2024-02-05',
  },
  {
    id: 'b5',
    name: 'Education First',
    industry: 'Education',
    location: 'Boston, MA',
    description: 'Educational technology platform serving schools nationwide.',
    employeeCount: '50-100',
    activeJobs: 4,
    rating: 4.5,
    verified: false,
    joinedDate: '2024-04-01',
  },
];

const ITEMS_PER_PAGE = 6;

export const Businesses: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter businesses
  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || business.industry === industryFilter;
    const matchesLocation = locationFilter === 'all' || business.location.includes(locationFilter);
    
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique industries and locations for filters
  const industries = ['all', ...Array.from(new Set(mockBusinesses.map(b => b.industry)))];
  const locations = ['all', ...Array.from(new Set(mockBusinesses.map(b => {
    const parts = b.location.split(', ');
    return parts[parts.length - 1]; // Get state
  })))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Partner Businesses</h1>
        <p className="text-gray-600">
          Discover verified businesses hiring on StaffHub
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={(value) => {
              setIndustryFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={(value) => {
              setLocationFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
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

      {/* Business Grid */}
      {paginatedBusinesses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedBusinesses.map((business) => (
            <Card 
              key={business.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/businesses/${business.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="size-6 text-blue-600" />
                  </div>
                  {business.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{business.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {business.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="size-4" />
                  <span>{business.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="size-4" />
                  <span>{business.employeeCount} employees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span>{business.rating} rating</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="outline">{business.industry}</Badge>
                  <div className="text-sm text-gray-600">
                    {business.activeJobs} active {business.activeJobs === 1 ? 'job' : 'jobs'}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/businesses/${business.id}`);
                  }}
                >
                  View Profile
                  <ExternalLink className="size-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Building2 className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setIndustryFilter('all');
              setLocationFilter('all');
              setCurrentPage(1);
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
