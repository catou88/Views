import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { User, Search, MapPin, Award, CheckCircle, Star, Mail } from 'lucide-react';
import { mockJobs, JobStatus } from '../../services/mockData';
import { toast } from 'sonner';

interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  qualifications: string[];
  rating: number;
  completedJobs: number;
  availability: 'available' | 'limited' | 'unavailable';
  invited: boolean;
  bio?: string;
}

// Mock candidates data
const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    qualifications: ['React Certification', 'TypeScript', 'Node.js'],
    rating: 4.8,
    completedJobs: 15,
    availability: 'available',
    invited: false,
    bio: 'Experienced full-stack developer with 8+ years in web development.',
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    location: 'San Francisco, CA',
    qualifications: ['React Certification', 'UX Design'],
    rating: 4.9,
    completedJobs: 22,
    availability: 'available',
    invited: true,
    bio: 'Senior developer specializing in React and modern web technologies.',
  },
  {
    id: 'c3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    location: 'Oakland, CA',
    qualifications: ['TypeScript', 'AWS'],
    rating: 4.6,
    completedJobs: 10,
    availability: 'limited',
    invited: false,
    bio: 'Backend specialist with expertise in cloud infrastructure.',
  },
  {
    id: 'c4',
    name: 'Alice Williams',
    email: 'alice.w@example.com',
    location: 'San Jose, CA',
    qualifications: ['React Certification', 'TypeScript', 'GraphQL'],
    rating: 4.7,
    completedJobs: 18,
    availability: 'available',
    invited: false,
    bio: 'Full-stack engineer passionate about creating scalable applications.',
  },
];

export const BusinessCandidates: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [filterInvited, setFilterInvited] = useState<string>('all');
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-xl mb-2">Job Not Found</h3>
            <Button onClick={() => navigate('/business/jobs')}>
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Jobs that are completed, filled, canceled, or expired are not available for matching
  const unavailableStatuses: JobStatus[] = ['completed', 'filled', 'canceled', 'expired'];
  if (unavailableStatuses.includes(job.status)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-xl mb-2">Job Not Available for Matching</h3>
            <p className="text-gray-600 mb-4">
              This job is {job.status} and is no longer accepting new candidates.
            </p>
            <Button onClick={() => navigate('/business/jobs')}>
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter candidates based on job requirements and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.qualifications.some(q => q.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAvailability = 
      filterAvailability === 'all' || candidate.availability === filterAvailability;
    
    const matchesInvited = 
      filterInvited === 'all' ||
      (filterInvited === 'invited' && candidate.invited) ||
      (filterInvited === 'not-invited' && !candidate.invited);
    
    // Check if candidate has required qualifications
    const hasRequiredQuals = job.requiredQualifications.some(reqQual =>
      candidate.qualifications.some(q => q.toLowerCase().includes(reqQual.toLowerCase()))
    );

    return matchesSearch && matchesAvailability && matchesInvited && hasRequiredQuals;
  });

  const handleInvite = (candidateId: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, invited: true } : c
      )
    );
    toast.success('Invitation sent to candidate!');
  };

  const handleViewDetails = (candidateId: string) => {
    navigate(`/business/jobs/${id}/candidates/${candidateId}`);
  };

  const getAvailabilityBadge = (availability: Candidate['availability']) => {
    const variants: Record<Candidate['availability'], { 
      className: string; 
      label: string;
    }> = {
      available: { className: 'bg-green-100 text-green-800', label: 'Available' },
      limited: { className: 'bg-yellow-100 text-yellow-800', label: 'Limited' },
      unavailable: { className: 'bg-gray-100 text-gray-800', label: 'Unavailable' },
    };
    
    const { className, label } = variants[availability];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          className="mb-4"
          onClick={() => navigate(`/business/jobs/${id}`)}
        >
          ← Back to Job
        </Button>
        <h1 className="text-3xl mb-2">Discover Candidates</h1>
        <p className="text-gray-600">
          Find qualified workers for: <strong>{job.title}</strong>
        </p>
      </div>

      {/* Job Requirements Summary */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Award className="size-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">Required Qualifications:</h4>
              <div className="flex flex-wrap gap-2">
                {job.requiredQualifications.map((qual, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {qual}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Showing candidates who meet at least one of these qualifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Availability Filter */}
            <Select value={filterAvailability} onValueChange={setFilterAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="All Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>

            {/* Invited Filter */}
            <Select value={filterInvited} onValueChange={setFilterInvited}>
              <SelectTrigger>
                <SelectValue placeholder="All Candidates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="not-invited">Not Yet Invited</SelectItem>
                <SelectItem value="invited">Already Invited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredCandidates.length} qualified candidate{filteredCandidates.length !== 1 ? 's' : ''}
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card 
              key={candidate.id}
              className={candidate.invited ? 'border-blue-200 bg-blue-50/30' : ''}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="size-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="size-3" />
                          <span>{candidate.location}</span>
                        </div>
                      </div>
                      {getAvailabilityBadge(candidate.availability)}
                    </div>
                    {candidate.invited && (
                      <Badge className="bg-blue-100 text-blue-800 gap-1">
                        <Mail className="size-3" />
                        Invited
                      </Badge>
                    )}
                  </div>
                </div>

                {candidate.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {candidate.bio}
                  </p>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span>{candidate.rating} rating • {candidate.completedJobs} jobs completed</span>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Qualifications:</div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.qualifications.map((qual, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className={job.requiredQualifications.some(rq => 
                            qual.toLowerCase().includes(rq.toLowerCase())
                          ) ? 'bg-green-50 border-green-200 text-green-800' : ''}
                        >
                          {qual}
                          {job.requiredQualifications.some(rq => 
                            qual.toLowerCase().includes(rq.toLowerCase())
                          ) && <CheckCircle className="size-3 ml-1" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewDetails(candidate.id)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  {!candidate.invited ? (
                    <Button 
                      onClick={() => handleInvite(candidate.id)}
                      className="flex-1"
                    >
                      Invite to Apply
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary"
                      disabled
                      className="flex-1"
                    >
                      Invitation Sent
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <User className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No Qualified Candidates Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new candidates
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setFilterAvailability('all');
              setFilterInvited('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};