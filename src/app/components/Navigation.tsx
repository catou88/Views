import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Briefcase, LogOut, User, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="size-6 text-blue-600" />
              <span className="font-bold text-xl">StaffHub</span>
            </Link>
            
            <div className="ml-10 flex items-center gap-4">
              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-md ${
                  isActive('/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Browse Jobs
              </Link>
              
              <Link
                to="/businesses"
                className={`px-3 py-2 rounded-md ${
                  isActive('/businesses') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Businesses
              </Link>
              
              {isAuthenticated && user?.role === 'worker' && (
                <>
                  <Link
                    to="/worker/dashboard"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/worker/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/worker/applications"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/worker/applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/worker/invitations"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/worker/invitations') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Invitations
                  </Link>
                  <Link
                    to="/worker/commitments"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/worker/commitments') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Commitments
                  </Link>
                  <Link
                    to="/worker/qualifications"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/worker/qualifications') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Qualifications
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'business' && (
                <>
                  <Link
                    to="/business/dashboard"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/business/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/business/jobs"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/business/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/business/applications"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/business/applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Applications
                  </Link>
                  <Link
                    to="/business/profile"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/business/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/qualifications"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/qualifications') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Qualifications
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/users') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/businesses"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/businesses') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Businesses
                  </Link>
                  <Link
                    to="/admin/position-types"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/position-types') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Position Types
                  </Link>
                  <Link
                    to="/admin/system-config"
                    className={`px-3 py-2 rounded-md ${
                      isActive('/admin/system-config') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    System Config
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="size-4" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="size-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};