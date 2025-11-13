import { format } from 'date-fns';
import { FileText, Download, Eye, Trash2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import StatusBadge from './StatusBadge';
import type { Resource } from '../App';

interface ResourceTableProps {
  resources: Resource[];
  showActions?: boolean;
  showUploader?: boolean;
  onStatusUpdate?: (id: string, status: 'approved' | 'rejected') => void;
  onDelete?: (id: string) => void;
  onPreview?: (resource: Resource) => void;
}

export default function ResourceTable({ 
  resources, 
  showActions = false, 
  showUploader = false,
  onStatusUpdate,
  onDelete,
  onPreview
}: ResourceTableProps) {
  const getFileIcon = (fileType: string) => {
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No resources found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {showUploader && <TableHead>Uploaded By</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>
                <div>
                  <div className="flex items-center gap-2">
                    {getFileIcon(resource.fileType)}
                    <span>{resource.title}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                </div>
              </TableCell>
              {showUploader && (
                <TableCell>{resource.uploadedBy}</TableCell>
              )}
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm">
                  {resource.fileType}
                </span>
              </TableCell>
              <TableCell>{resource.fileSize}MB</TableCell>
              <TableCell>
                {format(new Date(resource.uploadedAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <StatusBadge status={resource.status} />
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(resource)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onStatusUpdate && resource.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStatusUpdate(resource.id, 'approved')}
                          title="Approve"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStatusUpdate(resource.id, 'rejected')}
                          title="Reject"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(resource.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
