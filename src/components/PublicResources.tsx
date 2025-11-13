import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Search, Filter, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import PreviewModal from './PreviewModal';
import type { Resource } from '../App';
import { format } from 'date-fns';

interface PublicResourcesProps {
  resources: Resource[];
}

export default function PublicResources({ resources }: PublicResourcesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFileType, setFilterFileType] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Get unique subjects
  const subjects = Array.from(new Set(resources.map(r => r.subject).filter(Boolean)));

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFileType = filterFileType === 'all' || resource.fileType === filterFileType;
    const matchesSubject = filterSubject === 'all' || resource.subject === filterSubject;
    
    return matchesSearch && matchesFileType && matchesSubject;
  });

  const handlePreview = (resource: Resource) => {
    setPreviewResource(resource);
    setPreviewOpen(true);
  };

  const getFileTypeIcon = (fileType: string) => {
    return <FileText className="h-6 w-6 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-blue-600">College Resource Portal</span>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Login
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Public Resources
          </h1>
          <p className="text-gray-600">
            Browse approved study materials shared by students
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterFileType} onValueChange={setFilterFileType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOC">Document</SelectItem>
                  <SelectItem value="PPT">Presentation</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject || ''}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 text-gray-600">
          Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
        </div>

        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">No resources found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {getFileTypeIcon(resource.fileType)}
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                      {resource.fileType}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subject:</span>
                    <span className="text-gray-900">{resource.subject || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Uploaded by:</span>
                    <span className="text-gray-900">{resource.uploadedBy}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-900">
                      {format(new Date(resource.uploadedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Size:</span>
                    <span className="text-gray-900">{resource.fileSize}MB</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handlePreview(resource)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PreviewModal 
        resource={previewResource} 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
      />
    </div>
  );
}
