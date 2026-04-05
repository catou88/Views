import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Users, Search, Briefcase, Award } from 'lucide-react';
import { UserRole } from '../../contexts/AuthContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

// Mock users data
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  status: 'active' | 'suspended';
  jobsPosted?: number;
  applicationsSubmitted?: number;
  qualifications?: number;
}

const mockUsers: MockUser[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'worker',
    joinDate: '2026-01-15',
    status: 'active',
    applicationsSubmitted: 12,
    qualifications: 3,
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'worker',
    joinDate: '2026-02-20',
    status: 'active',
    applicationsSubmitted: 8,
    qualifications: 2,
  },
  {
    id: 'u3',
    name: 'Tech Solutions Inc',
    email: 'contact@techsolutions.com',
    role: 'business',
    joinDate: '2026-01-10',
    status: 'active',
    jobsPosted: 15,
  },
  {
    id: 'u4',
    name: 'Creative Agency',
    email: 'hello@creativeagency.com',
    role: 'business',
    joinDate: '2026-02-05',
    status: 'active',
    jobsPosted: 8,
  },
  {
    id: 'u5',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'worker',
    joinDate: '2026-03-01',
    status: 'suspended',
    applicationsSubmitted: 5,
    qualifications: 1,
  },
  {
    id: 'u6',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'worker',
    joinDate: '2026-02-28',
    status: 'active',
    applicationsSubmitted: 15,
    qualifications: 4,
  },
  {
    id: 'u7',
    name: 'Healthcare Plus',
    email: 'info@healthcareplus.com',
    role: 'business',
    joinDate: '2026-03-15',
    status: 'active',
    jobsPosted: 6,
  },
];

export const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<MockUser[]>(mockUsers);

  const handleSuspend = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'suspended' } : u
    ));
    
    const user = users.find(u => u.id === userId);
    toast.success(`${user?.name} has been suspended`);
  };

  const handleActivate = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'active' } : u
    ));
    
    const user = users.find(u => u.id === userId);
    toast.success(`${user?.name} has been activated`);
  };

  // Filter users
  let filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { variant: 'default' | 'secondary' | 'outline'; label: string }> = {
      worker: { variant: 'default', label: 'Worker' },
      business: { variant: 'secondary', label: 'Business' },
      admin: { variant: 'outline', label: 'Admin' },
    };
    
    const { variant, label } = variants[role];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getStatusBadge = (status: 'active' | 'suspended') => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'destructive'}>
        {status === 'active' ? 'Active' : 'Suspended'}
      </Badge>
    );
  };

  // Calculate stats
  const totalUsers = mockUsers.length;
  const workerCount = mockUsers.filter(u => u.role === 'worker').length;
  const businessCount = mockUsers.filter(u => u.role === 'business').length;
  const activeCount = mockUsers.filter(u => u.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">User Management</h1>
        <p className="text-gray-600">
          View and manage all platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Users className="size-5" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-green-600">
              <Award className="size-5" />
              <span className="text-sm font-medium">Workers</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{workerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-purple-600">
              <Briefcase className="size-5" />
              <span className="text-sm font-medium">Businesses</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{businessCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="size-5" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
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
            
            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value as UserRole | 'all');
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
                <SelectItem value="business">Businesses</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as 'all' | 'active' | 'suspended');
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Showing {paginatedUsers.length} of {filteredUsers.length} users
      </div>

      {/* Users Table */}
      {paginatedUsers.length > 0 ? (
        <>
          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Join Date</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            {user.role === 'worker' ? (
                              <>
                                <div>{user.applicationsSubmitted} applications</div>
                                <div className="text-gray-600">{user.qualifications} qualifications</div>
                              </>
                            ) : user.role === 'business' ? (
                              <div>{user.jobsPosted} jobs posted</div>
                            ) : (
                              <div className="text-gray-500">-</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {user.status === 'active' ? (
                              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleSuspend(user.id)}>
                                Suspend
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleActivate(user.id)}>
                                Activate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

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
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};