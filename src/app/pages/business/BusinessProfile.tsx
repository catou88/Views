import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Building2, Mail, MapPin, Phone, Upload, Globe, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export const BusinessProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Business profile data
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 987-6543');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://www.acmecorp.com');
  const [description, setDescription] = useState('Leading technology company specializing in innovative solutions for modern businesses. We have been serving clients for over 15 years with excellence.');
  const [industry, setIndustry] = useState('Technology');
  const [companySize, setCompanySize] = useState('50-200');
  
  // Business verification status (from backend)
  const [isVerified, setIsVerified] = useState(true);
  
  // Avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
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
      toast.success('Logo updated! Click Save Changes to apply.');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    toast.success('Logo removed! Click Save Changes to apply.');
  };

  const handleSave = () => {
    // In a real app, this would upload files and save to backend
    localStorage.setItem('businessProfile', JSON.stringify({
      companyName,
      email,
      phone,
      location,
      website,
      description,
      industry,
      companySize,
      avatarPreview,
    }));
    toast.success('Business profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    toast.info('Changes discarded');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Business Profile</h1>
          <p className="text-gray-600">
            Manage your company information and verification status
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Verification Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            {isVerified ? (
              <>
                <CheckCircle className="size-6 text-green-600" />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    Verified Business
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your business has been verified by our team. You can now post jobs.
                  </p>
                </div>
              </>
            ) : (
              <>
                <X className="size-6 text-orange-600" />
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    Verification Pending
                    <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your business is under review. You'll be able to post jobs once verified.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div>
              <Label>Company Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="size-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="size-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <label htmlFor="avatar-upload">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Upload className="size-4 mr-2" />
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                      {avatarPreview && (
                        <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar}>
                          <X className="size-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG or GIF. Max size 5MB.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            {/* Industry */}
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            {/* Company Size */}
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Input
                id="companySize"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g., 50-200 employees"
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">
                <Mail className="size-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label htmlFor="phone">
                <Phone className="size-4 inline mr-2" />
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label htmlFor="location">
                <MapPin className="size-4 inline mr-2" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div>
              <Label htmlFor="website">
                <Globe className="size-4 inline mr-2" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
