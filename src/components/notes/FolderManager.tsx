
import React, { useState } from 'react';
import { Folder, Plus, Edit2, Trash2, FolderIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Folder as FolderType } from '@/types/notes';

interface FolderManagerProps {
  folders: FolderType[];
  selectedFolderId?: string;
  onFolderSelect: (folderId: string | undefined) => void;
  onCreateFolder: (name: string, color: string) => void;
  onUpdateFolder: (id: string, name: string, color: string) => void;
  onDeleteFolder: (id: string) => void;
}

const FOLDER_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const FolderManager: React.FC<FolderManagerProps> = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor);
      setNewFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateFolder = () => {
    if (editingFolder && newFolderName.trim()) {
      onUpdateFolder(editingFolder.id, newFolderName.trim(), selectedColor);
      setEditingFolder(null);
      setNewFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
    }
  };

  const startEdit = (folder: FolderType) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setSelectedColor(folder.color);
  };

  return (
    <>
      <Card className="p-4 mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Folders</h3>
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Folder
          </Button>
        </div>
        
        <div className="space-y-2">
          <Button
            variant={selectedFolderId === undefined ? "default" : "ghost"}
            className="w-full justify-start transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onFolderSelect(undefined)}
          >
            <FolderIcon className="h-4 w-4 mr-2" />
            All Notes
          </Button>
          
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center group transition-all duration-200 hover:scale-[1.02]"
            >
              <Button
                variant={selectedFolderId === folder.id ? "default" : "ghost"}
                className="flex-1 justify-start mr-2"
                onClick={() => onFolderSelect(folder.id)}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: folder.color }}
                />
                {folder.name}
              </Button>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEdit(folder)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeletingFolderId(folder.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create/Edit Folder Dialog */}
      <Dialog
        open={isCreateDialogOpen || editingFolder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingFolder(null);
            setNewFolderName('');
            setSelectedColor(FOLDER_COLORS[0]);
          }
        }}
      >
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>
              {editingFolder ? 'Edit Folder' : 'Create New Folder'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Folder Name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex gap-2">
                {FOLDER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      selectedColor === color ? 'border-foreground' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingFolder(null);
                setNewFolderName('');
                setSelectedColor(FOLDER_COLORS[0]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingFolder ? handleUpdateFolder : handleCreateFolder}
              disabled={!newFolderName.trim()}
            >
              {editingFolder ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingFolderId !== null}
        onOpenChange={(open) => !open && setDeletingFolderId(null)}
      >
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? Notes in this folder will be moved to "All Notes".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingFolderId) {
                  onDeleteFolder(deletingFolderId);
                  setDeletingFolderId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FolderManager;
