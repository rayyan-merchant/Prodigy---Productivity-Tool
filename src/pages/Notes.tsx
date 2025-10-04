
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NotesList from '@/components/notes/NotesList';
import NoteEditor from '@/components/notes/NoteEditor';
import FolderManager from '@/components/notes/FolderManager';
import AdvancedSearch from '@/components/notes/AdvancedSearch';
import NotesContainer from '@/components/notes/NotesContainer';

const Notes: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <NotesContainer>
        {({
          folders,
          searchQuery,
          setSearchQuery,
          searchFilters,
          setSearchFilters,
          availableTags,
          selectedFolderId,
          setSelectedFolderId,
          handleCreateNote,
          handleCreateFolder,
          handleUpdateFolder,
          handleDeleteFolder,
          isLoading,
          filteredNotes,
          handleEditNote,
          handleDeleteNote,
          handleToggleFavorite,
          handleUpdateNote,
          isEditorOpen,
          setIsEditorOpen,
          currentNote,
          handleSaveNote
        }) => (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
                  <p className="text-muted-foreground">Capture and organize your thoughts securely</p>
                </div>
                <Button onClick={handleCreateNote} className="transition-all duration-200 hover:scale-105">
                  <Plus className="mr-2 h-4 w-4" /> New Note
                </Button>
              </div>
              
              <AdvancedSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                folders={folders}
                availableTags={availableTags}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FolderManager
                  folders={folders}
                  selectedFolderId={selectedFolderId}
                  onFolderSelect={setSelectedFolderId}
                  onCreateFolder={handleCreateFolder}
                  onUpdateFolder={handleUpdateFolder}
                  onDeleteFolder={handleDeleteFolder}
                />
              </div>
              
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="flex justify-center my-12">
                    <p>Loading notes...</p>
                  </div>
                ) : filteredNotes.length > 0 ? (
                  <NotesList 
                    notes={filteredNotes}
                    folders={folders}
                    onEditNote={handleEditNote} 
                    onDeleteNote={handleDeleteNote}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdateNote={handleUpdateNote}
                  />
                ) : (
                  <Card className="p-12 flex flex-col items-center justify-center animate-fade-in">
                    <h3 className="text-xl font-medium text-center">
                      {searchQuery || Object.keys(searchFilters).length > 0 
                        ? 'No notes match your search criteria' 
                        : 'No notes yet! Create your first note 🎉'
                      }
                    </h3>
                    <p className="text-muted-foreground text-center mt-2">
                      {searchQuery || Object.keys(searchFilters).length > 0
                        ? 'Try adjusting your search terms or filters'
                        : 'Your notes will appear here once you create them.'
                      }
                    </p>
                    <Button className="mt-6 transition-all duration-200 hover:scale-105" onClick={handleCreateNote}>
                      <Plus className="mr-2 h-4 w-4" /> Create Note
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            <NoteEditor
              isOpen={isEditorOpen}
              note={currentNote}
              onClose={() => setIsEditorOpen(false)}
              onSave={handleSaveNote}
            />
          </>
        )}
      </NotesContainer>
    </div>
  );
};

export default Notes;
