import { Toaster } from './ui/sonner';
import Navbar from './Navbar';
import UploadForm from './UploadForm';
import ResourceTable from './ResourceTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { User, Resource } from '../App';

interface StudentDashboardProps {
  user: User;
  resources: Resource[];
  onUpload: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'status'>) => void;
  onLogout: () => void;
}

export default function StudentDashboard({ user, resources, onUpload, onLogout }: StudentDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} userRole={user.role} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Upload and manage your study materials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{resources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-green-600">
                {resources.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-600">
                {resources.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <UploadForm userName={user.name} onUpload={onUpload} />
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>My Upload History</CardTitle>
                <CardDescription>
                  Track the status of your uploaded resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceTable resources={resources} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
