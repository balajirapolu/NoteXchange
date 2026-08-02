import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { NotesHero } from './components/notes/NotesHero';
import { NoteList } from './components/notes/NoteList';
import { AuthPage } from './components/auth/AuthPage';
import { AuthModal } from './components/auth/AuthModal';
import { UploadModal } from './components/notes/UploadModal';
import { RatingModal } from './components/notes/RatingModal';
import { PdfViewerModal } from './components/notes/PdfViewerModal';
import { INITIAL_MOCK_NOTES } from './data/mockNotes';
import apiClient from './api/apiClient';

function MainAppContent() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'top' | 'mine'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [ratingTargetNote, setRatingTargetNote] = useState(null);
  const [pdfTargetNote, setPdfTargetNote] = useState(null);
  
  const [showFullAuthPage, setShowFullAuthPage] = useState(false);

  // Fetch Notes strictly from Backend API
  useEffect(() => {
    // Clear current notes while fetching new tab data to prevent stale state bleed across users
    setNotes([]);
    
    const fetchNotes = async () => {
      try {
        let endpoint = '/notes';
        if (activeTab === 'top') {
          endpoint = '/notes/top';
        } else if (activeTab === 'mine') {
          endpoint = '/notes/mine';
        }

        const response = await apiClient.get(endpoint);
        if (response.data && Array.isArray(response.data)) {
          setNotes(response.data);
        } else {
          setNotes([]);
        }
      } catch (err) {
        console.warn('Backend fetch response:', err.message);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [activeTab, user]);

  // Handle Upload Success
  const handleUploadSuccess = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  // Handle Rating Success
  const handleRatingSuccess = (noteId, newRating) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const currentAvg = note.avgRating || 0;
        const updatedAvg = currentAvg === 0 ? newRating : Number(((currentAvg + newRating) / 2).toFixed(1));
        return { ...note, avgRating: updatedAvg };
      }
      return note;
    }));
  };

  // Handle Delete Note (Permanently from MySQL Database)
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiClient.delete(`/notes/${noteId}`);
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } catch (err) {
        console.warn('Backend delete request failed:', err);
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    }
  };

  // Filtered Notes based on search, subject, semester, and user ownership
  const filteredNotes = notes.filter((note) => {
    // If 'My Notes' tab is active, double check that the note belongs to current user
    if (activeTab === 'mine' && user) {
      const uploader = note.uploaderName ? note.uploaderName.toLowerCase().trim() : '';
      const currentUser = user.name ? user.name.toLowerCase().trim() : '';
      if (uploader && currentUser && uploader !== currentUser) {
        return false;
      }
    }
    // Subject filter
    if (selectedSubject !== 'All Subjects' && note.subject !== selectedSubject) {
      return false;
    }
    // Semester filter
    if (selectedSemester !== 'All Semesters' && String(note.semester) !== String(selectedSemester)) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = note.title && note.title.toLowerCase().includes(q);
      const subjectMatch = note.subject && note.subject.toLowerCase().includes(q);
      const semesterMatch = String(note.semester).includes(q);
      const uploaderMatch = note.uploaderName && note.uploaderName.toLowerCase().includes(q);
      return titleMatch || subjectMatch || semesterMatch || uploaderMatch;
    }
    return true;
  });

  // If user opened full auth page view
  if (showFullAuthPage) {
    return (
      <AuthPage 
        initialMode="login" 
        onBackToHome={() => setShowFullAuthPage(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-teal-main selection:text-white">
      
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUpload={() => {
          if (!isAuthenticated) {
            openAuthModal('login');
          } else {
            setIsUploadOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-grow">
        {/* Hero Section */}
        <NotesHero
          totalNotes={notes.length}
          selectedSubject={selectedSubject}
          onSubjectSelect={setSelectedSubject}
        />

        {/* Notes Filter & Cards Grid */}
        <NoteList
          notes={filteredNotes}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          onViewPdf={(note) => setPdfTargetNote(note)}
          onRate={(note) => {
            if (!isAuthenticated) {
              openAuthModal('login');
            } else {
              setRatingTargetNote(note);
            }
          }}
          onDelete={handleDeleteNote}
          onOpenUpload={() => {
            if (!isAuthenticated) {
              openAuthModal('login');
            } else {
              setIsUploadOpen(true);
            }
          }}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <RatingModal
        isOpen={!!ratingTargetNote}
        note={ratingTargetNote}
        onClose={() => setRatingTargetNote(null)}
        onRatingSuccess={handleRatingSuccess}
      />

      <PdfViewerModal
        isOpen={!!pdfTargetNote}
        note={pdfTargetNote}
        onClose={() => setPdfTargetNote(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
