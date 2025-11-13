import { FileText, Download, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import StatusBadge from './StatusBadge';
import type { Resource } from '../App';
import { format } from 'date-fns';

interface PreviewModalProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
}

export default function PreviewModal({ resource, open, onClose }: PreviewModalProps) {
  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-4">
            <span>{resource.title}</span>
            <StatusBadge status={resource.status} />
          </DialogTitle>
          <DialogDescription>{resource.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Uploaded by:</span>
              <p className="text-gray-900">{resource.uploadedBy}</p>
            </div>
            <div>
              <span className="text-gray-500">Upload date:</span>
              <p className="text-gray-900">{format(new Date(resource.uploadedAt), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <span className="text-gray-500">File type:</span>
              <p className="text-gray-900">{resource.fileType}</p>
            </div>
            <div>
              <span className="text-gray-500">File size:</span>
              <p className="text-gray-900">{resource.fileSize}MB</p>
            </div>
            {resource.subject && (
              <div>
                <span className="text-gray-500">Subject:</span>
                <p className="text-gray-900">{resource.subject}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">File name:</span>
              <p className="text-gray-900 truncate">{resource.fileName}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">File Preview</p>
            <p className="text-gray-500 text-sm">
              {resource.fileType} preview would be displayed here
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
