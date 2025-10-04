
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Star, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Note } from '@/types/notes';
import EncryptionDialog from './EncryptionDialog';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  folderName?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onUpdateNote,
  folderName 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [encryptionDialog, setEncryptionDialog] = useState<{
    isOpen: boolean;
    mode: 'encrypt' | 'decrypt';
  }>({ isOpen: false, mode: 'encrypt' });
  const navigate = useNavigate();
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  const handleOpenFullEditor = () => {
    navigate(`/notes/edit/${note.id}`);
  };

  const handleEncryptionSuccess = (result: { content: string; isEncrypted: boolean; encryptedContent?: string }) => {
    onUpdateNote(note.id, {
      content: result.content,
      isEncrypted: result.isEncrypted,
      encryptedContent: result.encryptedContent,
      updatedAt: new Date().toISOString()
    });
  };

  const formattedDate = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });
  
  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] animate-fade-in task-card" onClick={handleOpenFullEditor}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl line-clamp-1 flex-1">{note.title}</CardTitle>
            <div className="flex items-center gap-1 ml-2">
              {note.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current animate-pulse" />
              )}
              {note.isEncrypted && (
                <Lock className="h-4 w-4 text-blue-500" />
              )}
            </div>
          </div>
          {folderName && (
            <Badge variant="outline" className="w-fit text-xs">
              {folderName}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-6 whitespace-pre-line">
            {note.isEncrypted ? '🔒 This note is encrypted. Click to decrypt and view.' : note.content}
          </p>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {note.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs animate-fade-in">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">Updated {formattedDate}</span>
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(note.id);
              }}
            >
              <Star className={`h-4 w-4 ${note.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setEncryptionDialog({
                  isOpen: true,
                  mode: note.isEncrypted ? 'decrypt' : 'encrypt'
                });
              }}
            >
              {note.isEncrypted ? (
                <Unlock className="h-4 w-4 text-blue-500" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the note "{note.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EncryptionDialog
        isOpen={encryptionDialog.isOpen}
        onClose={() => setEncryptionDialog({ ...encryptionDialog, isOpen: false })}
        mode={encryptionDialog.mode}
        content={note.isEncrypted ? note.encryptedContent || '' : note.content}
        onSuccess={handleEncryptionSuccess}
      />
    </>
  );
};

export default NoteCard;
