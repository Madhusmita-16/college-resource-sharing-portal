import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import type { Resource } from '../App';

interface UploadFormProps {
  userName: string;
  onUpload: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'status'>) => void;
}

export default function UploadForm({ userName, onUpload }: UploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'DOC' | 'PPT' | 'Image'>('PDF');
  const [subject, setSubject] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInMB = file.size / (1024 * 1024);
      
      if (sizeInMB > 10) {
        toast.error('File size exceeds 10MB limit');
        e.target.value = '';
        return;
      }

      setFileName(file.name);
      setFileSize(parseFloat(sizeInMB.toFixed(2)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName) {
      toast.error('Please select a file');
      return;
    }

    onUpload({
      title,
      description,
      fileType,
      fileName,
      fileSize,
      uploadedBy: userName,
      subject
    });

    // Reset form
    setTitle('');
    setDescription('');
    setFileType('PDF');
    setSubject('');
    setFileName('');
    setFileSize(0);
    
    toast.success('Resource uploaded successfully! Awaiting admin approval.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Study Material</CardTitle>
        <CardDescription>
          Share your notes, assignments, and study resources with fellow students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Data Structures Chapter 5 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the resource..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={fileType} onValueChange={(value) => setFileType(value as 'PDF' | 'DOC' | 'PPT' | 'Image')}>
                <SelectTrigger id="fileType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOC">Document (DOC)</SelectItem>
                  <SelectItem value="PPT">Presentation (PPT)</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Computer Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File Upload</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                required
              />
            </div>
            <p className="text-gray-500 text-sm">
              Accepted formats: PDF, DOC, PPT, Images (PNG, JPG) • Max size: 10MB
            </p>
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                <FileText className="h-4 w-4" />
                <span>{fileName} ({fileSize}MB)</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
