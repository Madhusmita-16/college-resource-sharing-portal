import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './ui/sonner';
import Navbar from './Navbar';
import ResourceTable from './ResourceTable';
import PreviewModal from './PreviewModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { User, Resource } from '../App';

interface AdminDashboardProps {
  user: User;
  resources: Resource[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ 
  user, 
  resources, 
  onStatusUpdate, 
  onDelete, 
  onLogout 
}: AdminDashboardProps) {
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const pendingResources = resources.filter(r => r.status === 'pending');
  const approvedResources = resources.filter(r => r.status === 'approved');
  const rejectedResources = resources.filter(r => r.status === 'rejected');

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    onStatusUpdate(id, status);
    toast.success(`Resource ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('Resource deleted successfully');
  };

  const handlePreview = (resource: Resource) => {
    setPreviewResource(resource);
    setPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} userRole={user.role} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Review and manage student resource submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{resources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-600">{pendingResources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-green-600">{approvedResources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-red-600">{rejectedResources.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Management</CardTitle>
            <CardDescription>
              Review, approve, or reject student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingResources.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedResources.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedResources.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-6">
                <ResourceTable
                  resources={pendingResources}
                  showActions
                  showUploader
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              </TabsContent>
              
              <TabsContent value="approved" className="mt-6">
                <ResourceTable
                  resources={approvedResources}
                  showActions
                  showUploader
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-6">
                <ResourceTable
                  resources={rejectedResources}
                  showActions
                  showUploader
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <PreviewModal 
        resource={previewResource} 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
      />
      
      <Toaster />
    </div>
  );
}