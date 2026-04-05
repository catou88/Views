import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Search, CheckCircle, Users } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Find Temporary Staffing Solutions</h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect talented workers with businesses seeking temporary staff
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="size-6 text-blue-600" />
              </div>
              <CardTitle>Browse Opportunities</CardTitle>
              <CardDescription>
                Search through hundreds of temporary positions from verified businesses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <CardTitle>Get Qualified</CardTitle>
              <CardDescription>
                Submit your credentials and qualifications for verification
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="size-6 text-purple-600" />
              </div>
              <CardTitle>Start Working</CardTitle>
              <CardDescription>
                Apply for jobs, negotiate terms, and begin your temporary assignment
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">500+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl mb-2">10,000+</div>
              <div className="text-gray-600">Qualified Workers</div>
            </div>
            <div>
              <div className="text-4xl mb-2">2,000+</div>
              <div className="text-gray-600">Partner Businesses</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <Users className="size-16 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of workers and businesses using StaffHub
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};
