
import React from 'react';
import NoteCard from './NoteCard';
import { Note, Folder } from '@/types/notes';

interface NotesListProps {
  notes: Note[];
  folders: Folder[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  notes, 
  folders, 
  onEditNote, 
  onDeleteNote, 
  onToggleFavorite, 
  onUpdateNote 
}) => {
  const getFolderName = (folderId?: string) => {
    if (!folderId) return undefined;
    return folders.find(f => f.id === folderId)?.name;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          folderName={getFolderName(note.folderId)}
          onEdit={() => onEditNote(note)}
          onDelete={() => onDeleteNote(note.id)}
          onToggleFavorite={onToggleFavorite}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  );
};

export default NotesList;
