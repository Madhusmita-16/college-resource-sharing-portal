import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import PublicResources from './components/PublicResources';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: 'PDF' | 'DOC' | 'PPT' | 'Image';
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  subject?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Data Structures Notes',
      description: 'Complete notes on arrays, linked lists, and trees',
      fileType: 'PDF',
      fileName: 'ds-notes.pdf',
      fileSize: 2.5,
      uploadedBy: 'John Doe',
      uploadedAt: '2025-11-10T10:30:00Z',
      status: 'approved',
      subject: 'Computer Science'
    },
    {
      id: '2',
      title: 'Calculus Problem Set',
      description: 'Practice problems for integration and differentiation',
      fileType: 'PDF',
      fileName: 'calculus-problems.pdf',
      fileSize: 1.8,
      uploadedBy: 'Jane Smith',
      uploadedAt: '2025-11-11T14:20:00Z',
      status: 'pending',
      subject: 'Mathematics'
    },
    {
      id: '3',
      title: 'Physics Lab Report Template',
      description: 'Standard template for physics lab reports',
      fileType: 'DOC',
      fileName: 'lab-template.docx',
      fileSize: 0.5,
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2025-11-12T09:15:00Z',
      status: 'approved',
      subject: 'Physics'
    },
    {
      id: '4',
      title: 'Chemistry Presentation',
      description: 'Organic chemistry reactions overview',
      fileType: 'PPT',
      fileName: 'organic-chem.pptx',
      fileSize: 5.2,
      uploadedBy: 'Sarah Williams',
      uploadedAt: '2025-11-12T16:45:00Z',
      status: 'pending',
      subject: 'Chemistry'
    },
    {
      id: '5',
      title: 'Algorithm Flowchart',
      description: 'Sorting algorithms visual guide',
      fileType: 'Image',
      fileName: 'sorting-flowchart.png',
      fileSize: 0.8,
      uploadedBy: 'John Doe',
      uploadedAt: '2025-11-13T11:00:00Z',
      status: 'rejected',
      subject: 'Computer Science'
    }
  ]);

  const handleLogin = (email: string, password: string, role: 'student' | 'admin') => {
    // Mock authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(mockUser);
  };

  const handleRegister = (name: string, email: string, password: string, role: 'student' | 'admin') => {
    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpload = (resource: Omit<Resource, 'id' | 'uploadedAt' | 'status'>) => {
    const newResource: Resource = {
      ...resource,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    };
    setResources([newResource, ...resources]);
  };

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    setResources(resources.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            ) : (
              <Register onRegister={handleRegister} />
            )
          } 
        />
        <Route 
          path="/student" 
          element={
            user && user.role === 'student' ? (
              <StudentDashboard 
                user={user} 
                resources={resources.filter(r => r.uploadedBy === user.name)}
                onUpload={handleUpload}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            user && user.role === 'admin' ? (
              <AdminDashboard 
                user={user}
                resources={resources}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
        <Route 
          path="/resources" 
          element={<PublicResources resources={resources.filter(r => r.status === 'approved')} />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;