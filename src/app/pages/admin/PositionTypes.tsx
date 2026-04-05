import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Briefcase, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

interface PositionType {
  id: string;
  name: string;
  description: string;
  category: string;
  visible: boolean;
  jobCount: number;
  createdDate: string;
}

const mockPositionTypes: PositionType[] = [
  {
    id: 'pt1',
    name: 'Software Developer',
    description: 'Full-stack and specialized software development positions',
    category: 'Technology',
    visible: true,
    jobCount: 25,
    createdDate: '2024-01-15',
  },
  {
    id: 'pt2',
    name: 'Medical Assistant',
    description: 'Healthcare support and medical assistance roles',
    category: 'Healthcare',
    visible: true,
    jobCount: 18,
    createdDate: '2024-02-10',
  },
  {
    id: 'pt3',
    name: 'Graphic Designer',
    description: 'Visual design and creative content positions',
    category: 'Design',
    visible: true,
    jobCount: 12,
    createdDate: '2024-03-05',
  },
  {
    id: 'pt4',
    name: 'Data Analyst',
    description: 'Data analysis and business intelligence roles',
    category: 'Technology',
    visible: false,
    jobCount: 0,
    createdDate: '2024-03-20',
  },
];

export const AdminPositionTypes: React.FC = () => {
  const [positionTypes, setPositionTypes] = useState<PositionType[]>(mockPositionTypes);
  const [editingPosition, setEditingPosition] = useState<PositionType | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormCategory('');
    setFormVisible(true);
    setEditingPosition(null);
  };

  const handleCreate = () => {
    if (!formName || !formDescription || !formCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    const newPosition: PositionType = {
      id: `pt${positionTypes.length + 1}`,
      name: formName,
      description: formDescription,
      category: formCategory,
      visible: formVisible,
      jobCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setPositionTypes([...positionTypes, newPosition]);
    toast.success(`Position type "${formName}" created successfully`);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (position: PositionType) => {
    setEditingPosition(position);
    setFormName(position.name);
    setFormDescription(position.description);
    setFormCategory(position.category);
    setFormVisible(position.visible);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingPosition || !formName || !formDescription || !formCategory) {
      toast.error('Please fill in all fields');
      return;
    }

    setPositionTypes(prev =>
      prev.map(pt =>
        pt.id === editingPosition.id
          ? { ...pt, name: formName, description: formDescription, category: formCategory, visible: formVisible }
          : pt
      )
    );

    toast.success(`Position type "${formName}" updated successfully`);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleToggleVisibility = (id: string) => {
    setPositionTypes(prev =>
      prev.map(pt =>
        pt.id === id ? { ...pt, visible: !pt.visible } : pt
      )
    );
    
    const position = positionTypes.find(pt => pt.id === id);
    toast.success(`${position?.name} ${position?.visible ? 'hidden' : 'shown'}`);
  };

  const handleDelete = (id: string) => {
    const position = positionTypes.find(pt => pt.id === id);
    
    if (position && position.jobCount > 0) {
      toast.error(`Cannot delete "${position.name}" because it has ${position.jobCount} active jobs`);
      return;
    }

    setPositionTypes(prev => prev.filter(pt => pt.id !== id));
    toast.success(`Position type deleted successfully`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Position Types</h1>
          <p className="text-gray-600">
            Manage available position types for job postings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Position Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Position Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Position Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Software Developer"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this position type..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Technology, Healthcare"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visible to users</Label>
                <Switch
                  id="visible"
                  checked={formVisible}
                  onCheckedChange={setFormVisible}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Position Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Total Position Types</p>
            <p className="text-3xl font-bold">{positionTypes.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Visible</p>
            <p className="text-3xl font-bold text-green-600">
              {positionTypes.filter(pt => pt.visible).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Hidden</p>
            <p className="text-3xl font-bold text-gray-600">
              {positionTypes.filter(pt => !pt.visible).length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm text-gray-600">Active Jobs</p>
            <p className="text-3xl font-bold text-blue-600">
              {positionTypes.reduce((sum, pt) => sum + pt.jobCount, 0)}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Position Types List */}
      <div className="space-y-4">
        {positionTypes.map((position) => (
          <Card key={position.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="size-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{position.name}</h3>
                      {position.visible ? (
                        <Badge className="bg-green-100 text-green-800 gap-1">
                          <Eye className="size-3" />
                          Visible
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 gap-1">
                          <EyeOff className="size-3" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{position.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>Category: <strong>{position.category}</strong></span>
                      <span>•</span>
                      <span>{position.jobCount} active jobs</span>
                      <span>•</span>
                      <span>Created {new Date(position.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(position.id)}
                  >
                    {position.visible ? (
                      <>
                        <EyeOff className="size-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="size-4 mr-2" />
                        Show
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(position)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={position.jobCount > 0}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Position Type</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{position.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(position.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {position.jobCount > 0 && (
                <Alert className="mt-4">
                  <AlertDescription className="text-sm">
                    Cannot delete this position type because it has {position.jobCount} active job{position.jobCount !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Position Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-visible">Visible to users</Label>
              <Switch
                id="edit-visible"
                checked={formVisible}
                onCheckedChange={setFormVisible}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Position Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
