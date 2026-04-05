import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { mockQualifications, QualificationStatus, getAvailableQualificationTypes } from '../../services/mockData';
import { Award, CheckCircle, Clock, XCircle, Plus, FileText, Upload, X, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';

// Add interface for qualification with document
interface QualificationWithDocument extends Record<string, any> {
  id: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  status: QualificationStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  expiryDate?: string;
  documentName?: string;
  positionType?: string; // Add position type field
  lastUpdated?: string; // Add last updated field
}

export const WorkerQualifications: React.FC = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingQualId, setEditingQualId] = useState<string | null>(null);
  const [newQualType, setNewQualType] = useState('');
  const [newQualDescription, setNewQualDescription] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');

  // Get user's qualifications from localStorage and merge with mock data
  const [qualifications, setQualifications] = useState<QualificationWithDocument[]>(() => {
    // Load from localStorage
    const savedQuals = JSON.parse(localStorage.getItem('userQualifications') || '[]');
    const userSavedQuals = savedQuals.filter((q: any) => q.userId === user?.id);
    
    // Load from mock data
    const mockQuals = mockQualifications
      .filter(qual => qual.userId === user?.id)
      .map(qual => ({
        ...qual,
        documentName: qual.type === 'React Certification' ? 'React_Certificate_2023.pdf' : undefined,
      }));
    
    // Combine both sources
    return [...userSavedQuals, ...mockQuals];
  });

  const getStatusBadge = (status: QualificationStatus) => {
    const variants: Record<QualificationStatus, { variant: 'default' | 'secondary' | 'destructive'; label: string; icon: React.ReactNode }> = {
      pending: { 
        variant: 'secondary', 
        label: 'Under Review',
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

  const getStatusMessage = (status: QualificationStatus) => {
    const messages: Record<QualificationStatus, { text: string; color: string }> = {
      pending: {
        text: 'Your qualification is being reviewed by our admin team. This typically takes 1-3 business days.',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      },
      approved: {
        text: 'Your qualification has been verified and approved. You can now apply for jobs requiring this qualification.',
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      rejected: {
        text: 'Your qualification could not be verified. Please resubmit with additional documentation.',
        color: 'bg-red-50 border-red-200 text-red-800'
      },
    };
    return messages[status];
  };

  const handleAddQualification = () => {
    if (!newQualType || !newQualDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    // Create new qualification object
    const newQualification: QualificationWithDocument = {
      id: `qual-${Date.now()}`,
      userId: user?.id || '',
      name: newQualType,
      type: newQualType,
      description: newQualDescription,
      status: 'pending' as QualificationStatus,
      submittedDate: new Date().toISOString(),
      reviewedDate: undefined,
      reviewedBy: undefined,
      expiryDate: undefined,
      documentName: documentFile ? documentFile.name : undefined,
    };

    // Add to qualifications list
    setQualifications([newQualification, ...qualifications]);

    toast.success('Qualification submitted for review!');
    setShowAddDialog(false);
    setNewQualType('');
    setNewQualDescription('');
    setDocumentFile(null);
    setDocumentName('');
  };

  const handleEditQualification = () => {
    if (!newQualType || !newQualDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    const existingQual = qualifications.find(q => q.id === editingQualId);
    
    // Update qualification object
    const updatedQualification: QualificationWithDocument = {
      ...existingQual!,
      id: editingQualId || '',
      userId: user?.id || '',
      name: newQualType,
      type: newQualType,
      description: newQualDescription,
      status: 'pending' as QualificationStatus, // Reset to pending when edited
      submittedDate: new Date().toISOString(),
      reviewedDate: undefined,
      reviewedBy: undefined,
      documentName: documentFile ? documentFile.name : (documentName || existingQual?.documentName),
      lastUpdated: new Date().toISOString(),
    };

    // Update qualifications list
    setQualifications(qualifications.map(qual => qual.id === editingQualId ? updatedQualification : qual));

    const message = existingQual?.status === 'approved' 
      ? 'Qualification updated and resubmitted for review!'
      : existingQual?.status === 'rejected'
      ? 'Qualification resubmitted for review!'
      : 'Qualification updated!';
    
    toast.success(message);
    setShowEditDialog(false);
    setEditingQualId(null);
    setNewQualType('');
    setNewQualDescription('');
    setDocumentFile(null);
    setDocumentName('');
  };

  const handleDeleteQualification = (id: string) => {
    setQualifications(qualifications.filter(qual => qual.id !== id));
    toast.success('Qualification deleted!');
  };

  const handleDownloadDocument = (documentName: string) => {
    // Simulate document download
    toast.info(`Downloading ${documentName}...`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">My Qualifications</h1>
          <p className="text-gray-600">
            Manage your credentials and certifications
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Qualification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Qualification</DialogTitle>
              <DialogDescription>
                Submit a new qualification for admin verification
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="qualType">Qualification Type</Label>
                <Input
                  id="qualType"
                  placeholder="e.g., React Certification, Medical License, Bachelor's Degree"
                  value={newQualType}
                  onChange={(e) => setNewQualType(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="qualDescription">Description</Label>
                <Textarea
                  id="qualDescription"
                  placeholder="Provide details about your qualification..."
                  value={newQualDescription}
                  onChange={(e) => setNewQualDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="qualDocument">Supporting Document (Optional)</Label>
                <Input id="qualDocument" type="file" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDocumentFile(file);
                    setDocumentName(file.name);
                  }
                }} />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a certificate, license, or other proof
                </p>
              </div>
              <Button onClick={handleAddQualification} className="w-full">
                Submit for Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit/Resubmit Qualification Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {qualifications.find(q => q.id === editingQualId)?.status === 'rejected' 
                ? 'Resubmit Qualification' 
                : qualifications.find(q => q.id === editingQualId)?.status === 'pending'
                ? 'Revise Qualification'
                : 'Update Qualification'}
            </DialogTitle>
            <DialogDescription>
              {qualifications.find(q => q.id === editingQualId)?.status === 'rejected'
                ? 'Update your qualification details and resubmit for review'
                : qualifications.find(q => q.id === editingQualId)?.status === 'pending'
                ? 'Make changes to your qualification before it\'s reviewed'
                : 'Update this qualification. It will be resubmitted for admin review.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editQualType">Qualification Type</Label>
              <Input
                id="editQualType"
                placeholder="e.g., React Certification, Medical License, Bachelor's Degree"
                value={newQualType}
                onChange={(e) => setNewQualType(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="editQualDescription">Description</Label>
              <Textarea
                id="editQualDescription"
                placeholder="Provide details about your qualification..."
                value={newQualDescription}
                onChange={(e) => setNewQualDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="editQualDocument">Supporting Document</Label>
              {documentName && !documentFile && (
                <div className="mb-2 flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                  <FileText className="size-4 text-gray-600" />
                  <span className="flex-1 text-sm truncate">{documentName}</span>
                  <span className="text-xs text-gray-500">Current</span>
                </div>
              )}
              {documentFile && (
                <div className="mb-2 flex items-center gap-2 p-2 border rounded-lg bg-blue-50 border-blue-200">
                  <FileText className="size-4 text-blue-600" />
                  <span className="flex-1 text-sm truncate">{documentFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDocumentFile(null);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
              <Input 
                id="editQualDocument" 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setDocumentFile(file);
                  }
                }} 
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a certificate, license, or other proof
              </p>
            </div>
            {qualifications.find(q => q.id === editingQualId)?.status === 'approved' && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Updating this approved qualification will reset its status to "Under Review" and require admin re-approval.
                </p>
              </div>
            )}
            <Button onClick={handleEditQualification} className="w-full">
              {qualifications.find(q => q.id === editingQualId)?.status === 'rejected'
                ? 'Resubmit for Review'
                : qualifications.find(q => q.id === editingQualId)?.status === 'pending'
                ? 'Save Changes'
                : 'Update & Resubmit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="size-5 text-green-600" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {qualifications.filter(q => q.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="size-5 text-yellow-600" />
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {qualifications.filter(q => q.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="size-5 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{qualifications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Qualifications List */}
      {qualifications.length > 0 ? (
        <div className="space-y-4">
          {qualifications.map((qual) => {
            const statusMsg = getStatusMessage(qual.status);
            return (
              <Card key={qual.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{qual.type}</h3>
                        {getStatusBadge(qual.status)}
                      </div>
                      {qual.positionType && (
                        <div className="mb-3">
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Position: {qual.positionType}
                          </Badge>
                        </div>
                      )}
                      <p className="text-gray-600 mb-4">{qual.description}</p>
                      
                      {/* Document section */}
                      {qual.documentName && (
                        <div className="mb-4 flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                          <FileText className="size-4 text-gray-600" />
                          <span className="flex-1 text-sm truncate">{qual.documentName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(qual.documentName!)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Download className="size-4" />
                          </Button>
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg border ${statusMsg.color}`}>
                        <p className="text-sm">{statusMsg.text}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    <div className="flex gap-6 flex-wrap">
                      <span>
                        Submitted: {new Date(qual.submittedDate).toLocaleDateString()}
                      </span>
                      {qual.lastUpdated && (
                        <span>
                          Last Updated: {new Date(qual.lastUpdated).toLocaleDateString()} at {new Date(qual.lastUpdated).toLocaleTimeString()}
                        </span>
                      )}
                      {qual.reviewedDate && (
                        <span>
                          Reviewed: {new Date(qual.reviewedDate).toLocaleDateString()}
                          {qual.reviewedBy && ` by ${qual.reviewedBy}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    {/* Revise/Edit button - available for all statuses */}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingQualId(qual.id);
                        setNewQualType(qual.type);
                        setNewQualDescription(qual.description);
                        setDocumentName(qual.documentName || '');
                        setShowEditDialog(true);
                      }}
                    >
                      {qual.status === 'rejected' ? (
                        <>
                          <Upload className="size-4 mr-2" />
                          Resubmit
                        </>
                      ) : qual.status === 'pending' ? (
                        <>
                          <FileText className="size-4 mr-2" />
                          Revise
                        </>
                      ) : (
                        <>
                          <FileText className="size-4 mr-2" />
                          Update
                        </>
                      )}
                    </Button>
                    
                    {/* Delete button - only for pending and rejected */}
                    {(qual.status === 'pending' || qual.status === 'rejected') && (
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteQualification(qual.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="size-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No qualifications yet</h3>
            <p className="text-gray-600 mb-4">
              Add your certifications and credentials to qualify for more jobs
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="size-4 mr-2" />
              Add Your First Qualification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Why add qualifications?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Verified qualifications increase your chances of being hired</li>
            <li>• Many jobs require specific certifications or licenses</li>
            <li>• Approved qualifications appear on your profile</li>
            <li>• Stand out from other applicants with verified credentials</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};