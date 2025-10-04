
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Task } from '@/services/taskService';
import { Note } from '@/types/notes';
import { useNavigate } from 'react-router-dom';

// Define the search result types
type SearchResultItem = {
  id: string;
  title: string;
  content?: string;
  type: 'task' | 'note';
  path: string;
};

interface GlobalSearchProps {
  tasks?: Task[];
  notes?: Note[];
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ tasks = [], notes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Transform tasks and notes into searchable items
  const searchableItems = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      content: task.description,
      type: 'task' as const,
      path: `/tasks?id=${task.id}`
    })),
    ...notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      type: 'note' as const,
      path: `/notes/${note.id}`
    }))
  ];

  // Filter items based on search query
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = searchableItems.filter(item => {
      return (
        item.title.toLowerCase().includes(lowerCaseQuery) || 
        (item.content && item.content.toLowerCase().includes(lowerCaseQuery))
      );
    });

    setResults(filtered);
  }, [query, searchableItems]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or CTRL+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      
      // ESC to close search
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        inputRef.current &&
        resultsRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleResultClick = (item: SearchResultItem) => {
    navigate(item.path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center border rounded-md px-3 py-2 bg-background cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Search...</span>
        <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-16">
          <div className="w-full max-w-md bg-background rounded-lg shadow-lg overflow-hidden z-50">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks, notes..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              </div>
            </div>
            
            <div ref={resultsRef} className="max-h-72 overflow-y-auto">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleResultClick(item)}
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted-foreground/20 text-foreground">
                          {item.type === 'task' ? 'Task' : 'Note'}
                        </span>
                        <span className="ml-2 font-medium">{item.title}</span>
                      </div>
                      {item.content && (
                        <p className="mt-1 text-sm text-muted-foreground truncate">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  Type to search tasks and notes
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
