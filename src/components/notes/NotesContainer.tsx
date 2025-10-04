
import React, { useState, useEffect } from 'react';
import { Note, Folder, SearchFilters } from '@/types/notes';
import { getNotes, createNote, updateNote, deleteNote } from '@/services/noteService';
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from '@/lib/auth';

interface NotesData {
  notes: Note[];
  folders: Folder[];
  searchQuery: string;
  searchFilters: SearchFilters;
  selectedFolderId: string | undefined;
  isEditorOpen: boolean;
  currentNote: Note | null;
  isLoading: boolean;
  filteredNotes: Note[];
  availableTags: string[];
}

interface NotesActions {
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setSelectedFolderId: (id: string | undefined) => void;
  handleCreateNote: () => void;
  handleEditNote: (note: Note) => void;
  handleSaveNote: (note: Note) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
  handleToggleFavorite: (id: string) => void;
  handleUpdateNote: (id: string, updates: Partial<Note>) => void;
  handleCreateFolder: (name: string, color: string) => void;
  handleUpdateFolder: (id: string, name: string, color: string) => void;
  handleDeleteFolder: (id: string) => void;
  setIsEditorOpen: (open: boolean) => void;
  setCurrentNote: (note: Note | null) => void;
}

interface NotesContainerProps {
  children: (data: NotesData & NotesActions) => React.ReactNode;
}

const NotesContainer: React.FC<NotesContainerProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleCreateNoteFromShortcut = () => {
      handleCreateNote();
    };

    window.addEventListener('createNoteFromShortcut', handleCreateNoteFromShortcut);
    return () => window.removeEventListener('createNoteFromShortcut', handleCreateNoteFromShortcut);
  }, []);

  // Mock folders for demo
  useEffect(() => {
    const mockFolders: Folder[] = [
      {
        id: '1',
        name: 'Work',
        color: '#3B82F6',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Personal',
        color: '#10B981',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setFolders(mockFolders);
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const user = getCurrentUser();
    if (user) {
      fetchNotes();
    } else {
      // Mock data for preview
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Project Ideas',
          content: 'Create a personal finance tracker\nBuild a habit tracking app\nStart learning about AI',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['ideas', 'projects'],
          folderId: '1',
          isFavorite: true,
          isEncrypted: false,
          isLocked: false
        },
        {
          id: '2',
          title: 'Meeting Notes',
          content: '- Discuss project timeline\n- Assign tasks to team members\n- Set up weekly check-ins',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          tags: ['work', 'meetings'],
          folderId: '1',
          isFavorite: false,
          isEncrypted: false,
          isLocked: false
        }
      ];
      
      setNotes(mockNotes);
      setIsLoading(false);
    }
  }, [toast]);

  const handleCreateNote = () => {
    setCurrentNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (note: Note) => {
    try {
      if (currentNote) {
        await updateNote(note.id, {
          title: note.title,
          content: note.content,
          tags: note.tags
        });
        
        const updatedNotes = notes.map(n => 
          n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n
        );
        setNotes(updatedNotes);
        
        toast({
          title: "Note updated",
          description: "Your note has been updated successfully."
        });
      } else {
        const { title, content, tags } = note;
        const newNote = await createNote({ 
          title, 
          content, 
          tags: tags || [],
          folderId: selectedFolderId,
          isFavorite: false,
          isEncrypted: false,
          isLocked: false
        });
        
        setNotes([newNote, ...notes]);
        
        toast({
          title: "Note created",
          description: "Your note has been created successfully."
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEditorOpen(false);
      setCurrentNote(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    );
    setNotes(updatedNotes);
    
    toast({
      title: "Success",
      description: "Note favorite status updated"
    });
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    );
    setNotes(updatedNotes);
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFolders([...folders, newFolder]);
    toast({
      title: "Folder created",
      description: `Folder "${name}" has been created.`
    });
  };

  const handleUpdateFolder = (id: string, name: string, color: string) => {
    const updatedFolders = folders.map(folder =>
      folder.id === id ? { ...folder, name, color, updatedAt: new Date().toISOString() } : folder
    );
    setFolders(updatedFolders);
    toast({
      title: "Folder updated",
      description: `Folder has been updated.`
    });
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
    const updatedNotes = notes.map(note =>
      note.folderId === id ? { ...note, folderId: undefined } : note
    );
    setNotes(updatedNotes);
    toast({
      title: "Folder deleted",
      description: "Folder has been deleted and notes moved to All Notes."
    });
  };

  // Advanced filtering logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFolder = searchFilters.folderId ? 
      note.folderId === searchFilters.folderId : 
      (selectedFolderId ? note.folderId === selectedFolderId : true);

    const matchesFavorite = !searchFilters.isFavorite || note.isFavorite;

    const matchesTags = !searchFilters.tags?.length || 
      searchFilters.tags.some(tag => note.tags?.includes(tag));

    const matchesDateRange = !searchFilters.dateRange || (
      new Date(note.updatedAt) >= new Date(searchFilters.dateRange.start) &&
      new Date(note.updatedAt) <= new Date(searchFilters.dateRange.end)
    );

    return matchesSearch && matchesFolder && matchesFavorite && matchesTags && matchesDateRange;
  });

  const availableTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  return (
    <>
      {children({
        notes,
        folders,
        searchQuery,
        searchFilters,
        selectedFolderId,
        isEditorOpen,
        currentNote,
        isLoading,
        filteredNotes,
        availableTags,
        setSearchQuery,
        setSearchFilters,
        setSelectedFolderId,
        handleCreateNote,
        handleEditNote,
        handleSaveNote,
        handleDeleteNote,
        handleToggleFavorite,
        handleUpdateNote,
        handleCreateFolder,
        handleUpdateFolder,
        handleDeleteFolder,
        setIsEditorOpen,
        setCurrentNote
      })}
    </>
  );
};

export default NotesContainer;
