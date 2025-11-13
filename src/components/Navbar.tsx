import { Link } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  userName: string;
  userRole: 'student' | 'admin';
  onLogout: () => void;
}

export default function Navbar({ userName, userRole, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-blue-600">College Resource Portal</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/resources">
            <Button variant="ghost" size="sm">
              Public Resources
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-gray-900">{userName}</div>
              <div className="text-gray-500 text-sm capitalize">{userRole}</div>
            </div>
            
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
