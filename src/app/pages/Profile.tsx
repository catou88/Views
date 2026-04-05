import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { User, Mail, Briefcase, MapPin, Phone, Upload, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Experienced React developer with 5+ years of expertise in building scalable web applications. Passionate about clean code and user experience.');
  const [availability, setAvailability] = useState('available');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, AWS');
  const [experience, setExperience] = useState('5');
  
  // File uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('John_Doe_Resume.pdf');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Avatar file size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Avatar updated! Click Save Changes to apply.');
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Resume file size must be less than 10MB');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      setResumeFile(file);
      setResumeName(file.name);
      toast.success('Resume uploaded! Click Save Changes to apply.');
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeName('');
    toast.success('Resume removed! Click Save Changes to apply.');
  };

  const handleSave = () => {
    // In a real app, this would upload files and save to backend
    localStorage.setItem('userProfile', JSON.stringify({
      name,
      email,
      phone,
      location,
      bio,
      availability,
      skills,
      experience,
      avatarPreview,
      resumeName,
    }));
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                <img 
                  src={avatarPreview} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Upload overlay */}
              <Label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="size-5 text-white mb-1" />
                <span className="text-xs text-white font-medium">Change</span>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              className="mb-4"
            >
              <Upload className="size-4 mr-2" />
              Change Avatar
            </Button>
            <h3 className="font-semibold text-xl mb-2">{user?.name}</h3>
            <Badge className="mb-4">
              {user?.role === 'worker' ? 'Worker' : user?.role === 'business' ? 'Business' : 'Admin'}
            </Badge>
            <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
            <div className="text-sm text-gray-500">
              Member since January 2024
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {user?.role === 'worker' && (
                <div>
                  <Label htmlFor="availability">Availability Status</Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available for Work</SelectItem>
                      <SelectItem value="busy">Busy / Limited Availability</SelectItem>
                      <SelectItem value="unavailable">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="bio">
                  {user?.role === 'worker' ? 'Professional Summary' : 'Company Description'}
                </Label>
                <Textarea
                  id="bio"
                  placeholder={
                    user?.role === 'worker' 
                      ? 'Tell employers about your experience and skills...'
                      : 'Describe your company and what you do...'
                  }
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {user?.role === 'worker' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resume-upload">Upload Resume</Label>
                    {resumeName ? (
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                        <Download className="size-4 text-gray-600" />
                        <span className="flex-1 text-sm truncate">{resumeName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveResume}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-2">No resume uploaded</div>
                    )}
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <Upload className="size-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF or Word document (max 10MB)</p>
                      </div>
                    </Label>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      placeholder="React, TypeScript, Node.js, etc."
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    placeholder="e.g., 50-100 employees"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSave} className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};