import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  User, MapPin, Mail, Phone, Award, Star, Briefcase, 
  FileText, Download, CheckCircle, Calendar, ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface CandidateDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  qualifications: Array<{
    type: string;
    status: 'approved' | 'pending' | 'rejected';
    note?: string;
    documentUrl?: string;
  }>;
  rating: number;
  completedJobs: number;
  availability: 'available' | 'limited' | 'unavailable';
  bio: string;
  resumeUrl?: string;
  skills: string[];
  experience: string;
  previousWork: Array<{
    title: string;
    company: string;
    duration: string;
    rating: number;
  }>;
}

// Mock candidate detail data
const mockCandidateDetail: Record<string, CandidateDetail> = {
  c1: {
    id: 'c1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    qualifications: [
      {
        type: 'React Certification',
        status: 'approved',
        note: 'Meta React Developer Professional Certificate - Verified',
        documentUrl: '/documents/react-cert.pdf',
      },
      {
        type: 'TypeScript',
        status: 'approved',
        note: 'Advanced TypeScript certification from Udemy',
      },
      {
        type: 'Node.js',
        status: 'approved',
        note: 'Node.js backend development specialist',
      },
    ],
    rating: 4.8,
    completedJobs: 15,
    availability: 'available',
    bio: 'Experienced full-stack developer with 8+ years in web development. Specialized in React, TypeScript, and Node.js. Passionate about creating performant and scalable web applications. Strong communicator and team player with a proven track record of delivering high-quality projects on time.',
    resumeUrl: '/documents/john-doe-resume.pdf',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'Agile'],
    experience: '8+ years',
    previousWork: [
      {
        title: 'Senior React Developer',
        company: 'Tech Corp',
        duration: '3 months',
        rating: 5,
      },
      {
        title: 'Full Stack Engineer',
        company: 'Startup Inc',
        duration: '6 months',
        rating: 4.9,
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Agency',
        duration: '2 months',
        rating: 4.7,
      },
    ],
  },
};

export const BusinessCandidateDetail: React.FC = () => {
  const { id, candidateId } = useParams<{ id: string; candidateId: string }>();
  const navigate = useNavigate();

  const candidate = candidateId ? mockCandidateDetail[candidateId] : null;

  if (!candidate) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <User className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">Candidate Not Found</h3>
            <Button onClick={() => navigate(`/business/jobs/${id}/candidates`)}>
              Back to Candidates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExpressInterest = () => {
    toast.success('Interest expressed! The candidate will be notified.');
  };

  const handleDownloadDocument = (docType: string) => {
    toast.success(`Downloading ${docType}...`);
  };

  const getAvailabilityBadge = (availability: CandidateDetail['availability']) => {
    const variants: Record<CandidateDetail['availability'], { 
      className: string; 
      label: string;
    }> = {
      available: { className: 'bg-green-100 text-green-800', label: 'Available' },
      limited: { className: 'bg-yellow-100 text-yellow-800', label: 'Limited Availability' },
      unavailable: { className: 'bg-gray-100 text-gray-800', label: 'Not Available' },
    };
    
    const { className, label } = variants[availability];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm"
        className="mb-4"
        onClick={() => navigate(`/business/jobs/${id}/candidates`)}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Candidates
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="size-12 text-gray-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-3xl mb-1">{candidate.name}</h1>
                      <p className="text-gray-600">{candidate.experience} of experience</p>
                    </div>
                    {getAvailabilityBadge(candidate.availability)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="size-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-yellow-500 fill-yellow-500" />
                      <span>{candidate.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="size-4" />
                      <span>{candidate.completedJobs} jobs completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              <TabsTrigger value="work-history">Work History</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Biography */}
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {candidate.bio}
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualifications" className="space-y-4">
              {candidate.qualifications.map((qual, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Award className="size-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-lg">{qual.type}</h4>
                          {qual.note && (
                            <p className="text-sm text-gray-600 mt-1">{qual.note}</p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 gap-1">
                        <CheckCircle className="size-3" />
                        {qual.status}
                      </Badge>
                    </div>
                    {qual.documentUrl && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadDocument(qual.type)}
                        className="mt-3"
                      >
                        <Download className="size-4 mr-2" />
                        View Certification
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="work-history" className="space-y-4">
              {candidate.previousWork.map((work, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{work.title}</h4>
                        <p className="text-gray-600">{work.company}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        <span>{work.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      <span>{work.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              {candidate.resumeUrl && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Resume / CV</h4>
                          <p className="text-sm text-gray-600">PDF Document</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownloadDocument('Resume')}
                      >
                        <Download className="size-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {candidate.qualifications.filter(q => q.documentUrl).map((qual, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">{qual.type}</h4>
                          <p className="text-sm text-gray-600">Qualification Document</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleDownloadDocument(qual.type)}
                      >
                        <Download className="size-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a 
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
              >
                <Mail className="size-4" />
                <span>{candidate.email}</span>
              </a>
              {candidate.phone && (
                <a 
                  href={`tel:${candidate.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                >
                  <Phone className="size-4" />
                  <span>{candidate.phone}</span>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{candidate.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jobs Completed</span>
                <span className="font-semibold">{candidate.completedJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="font-semibold">{candidate.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Availability</span>
                {getAvailabilityBadge(candidate.availability)}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 space-y-3">
              <Button 
                className="w-full"
                onClick={handleExpressInterest}
              >
                Express Interest
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/business/jobs/${id}/candidates`)}
              >
                Back to Candidates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
