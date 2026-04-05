import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Building2, MapPin, Users, Globe, Mail, Phone, 
  Star, CheckCircle, Briefcase, Calendar, ArrowLeft 
} from 'lucide-react';
import { mockJobs } from '../services/mockData';

interface Business {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  employeeCount: string;
  rating: number;
  verified: boolean;
  joinedDate: string;
  website?: string;
  email?: string;
  phone?: string;
  biography: string;
  avatarUrl?: string;
}

// Mock business data - in real app, this would be fetched from API
const mockBusiness: Record<string, Business> = {
  b1: {
    id: 'b1',
    name: 'Tech Solutions Inc',
    industry: 'Technology',
    location: 'San Francisco, CA',
    description: 'Leading software development company specializing in enterprise solutions.',
    employeeCount: '200-500',
    rating: 4.8,
    verified: true,
    joinedDate: '2024-01-15',
    website: 'https://techsolutions.example.com',
    email: 'contact@techsolutions.example.com',
    phone: '+1 (555) 123-4567',
    biography: 'Tech Solutions Inc has been at the forefront of enterprise software development for over 15 years. We specialize in creating scalable, secure, and innovative solutions that help businesses transform their operations. Our team of experienced developers, designers, and project managers work collaboratively to deliver exceptional results. We pride ourselves on our commitment to quality, timely delivery, and fostering long-term partnerships with our clients.',
  },
  b2: {
    id: 'b2',
    name: 'Creative Agency',
    industry: 'Marketing & Design',
    location: 'New York, NY',
    description: 'Full-service creative agency delivering innovative marketing solutions.',
    employeeCount: '50-100',
    rating: 4.6,
    verified: true,
    joinedDate: '2024-03-20',
    website: 'https://creativeagency.example.com',
    email: 'hello@creativeagency.example.com',
    phone: '+1 (555) 234-5678',
    biography: 'Creative Agency is a full-service marketing and design firm that brings brands to life through compelling storytelling and stunning visuals. Founded by industry veterans with decades of combined experience, we work with clients ranging from startups to Fortune 500 companies. Our services include brand strategy, digital marketing, web design, content creation, and more. We believe in the power of creativity to drive business results.',
  },
  b3: {
    id: 'b3',
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    description: 'Modern healthcare facility committed to patient care excellence.',
    employeeCount: '500-1000',
    rating: 4.9,
    verified: true,
    joinedDate: '2023-11-10',
    website: 'https://healthcareplus.example.com',
    email: 'info@healthcareplus.example.com',
    phone: '+1 (555) 345-6789',
    biography: 'Healthcare Plus is a leading medical facility providing comprehensive healthcare services to the Chicago community. With state-of-the-art equipment and a team of highly qualified medical professionals, we offer everything from routine checkups to specialized treatments. Patient care is our top priority, and we strive to create a welcoming, comfortable environment for all who visit our facilities. We are committed to advancing healthcare through innovation and compassionate service.',
  },
};

export const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const business = id ? mockBusiness[id] : null;

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <Building2 className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">Business Not Found</h3>
            <p className="text-gray-600 mb-4">
              The business you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/businesses')}>
              Browse All Businesses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get business's active jobs
  const businessJobs = mockJobs.filter(
    job => job.businessId === business.id && job.status === 'open'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm"
        className="mb-4"
        onClick={() => navigate('/businesses')}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Businesses
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="size-12 text-blue-600" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl mb-1">{business.name}</h1>
                      <p className="text-gray-600">{business.description}</p>
                    </div>
                    {business.verified && (
                      <Badge className="bg-green-100 text-green-800 gap-1">
                        <CheckCircle className="size-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About {business.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {business.biography}
              </p>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="size-4" />
                  <span>Member since {new Date(business.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="size-4" />
                  <span>{business.industry} industry</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Job Postings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Job Postings</span>
                <Badge variant="secondary">{businessJobs.length} open</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {businessJobs.length > 0 ? (
                <div className="space-y-4">
                  {businessJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                        <Badge variant="outline">Open</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>${job.payRate}/hr</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.applicationsCount} applications</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="size-12 mx-auto mb-2 text-gray-300" />
                  <p>No active job postings at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.website && (
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                >
                  <Globe className="size-4" />
                  <span className="hover:underline">Visit Website</span>
                </a>
              )}
              {business.email && (
                <a 
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                >
                  <Mail className="size-4" />
                  <span className="hover:underline">{business.email}</span>
                </a>
              )}
              {business.phone && (
                <a 
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                >
                  <Phone className="size-4" />
                  <span className="hover:underline">{business.phone}</span>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Jobs</span>
                <span className="font-semibold">{businessJobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Company Size</span>
                <span className="font-semibold">{business.employeeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <span className="font-semibold flex items-center gap-1">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  {business.rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Industry</span>
                <Badge variant="outline">{business.industry}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Briefcase className="size-12 mx-auto mb-3 text-blue-600" />
              <h4 className="font-semibold mb-2">Interested in Working Here?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Check out their active job postings and apply today
              </p>
              <Button className="w-full" onClick={() => navigate('/jobs')}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
