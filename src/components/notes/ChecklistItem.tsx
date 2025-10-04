import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChecklistItemData } from '@/types/notes';

interface ChecklistItemProps {
  item: ChecklistItemData;
  onUpdate: (id: string, updates: Partial<ChecklistItemData>) => void;
  onDelete: (id: string) => void;
  onAddSubItem: (parentId: string) => void;
  onDeleteSubItem: (parentId: string, subItemId: string) => void;
  onUpdateSubItem: (parentId: string, subItemId: string, updates: Partial<ChecklistItemData>) => void;
  depth?: number;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onUpdate,
  onDelete,
  onAddSubItem,
  onDeleteSubItem,
  onUpdateSubItem,
  depth = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTextClick = () => {
    if (!item.completed) {
      setIsEditing(true);
    }
  };

  const handleTextSubmit = () => {
    if (editText.trim() !== item.text) {
      onUpdate(item.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditText(item.text);
      setIsEditing(false);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onUpdate(item.id, { completed: checked });
  };

  const handleAddSubItem = () => {
    onAddSubItem(item.id);
  };

  const handleDeleteSubItem = (subItemId: string) => {
    onDeleteSubItem(item.id, subItemId);
  };

  const handleUpdateSubItem = (subItemId: string, updates: Partial<ChecklistItemData>) => {
    onUpdateSubItem(item.id, subItemId, updates);
  };

  return (
    <div className={cn("group", depth > 0 && "ml-6 border-l-2 border-gray-100 dark:border-gray-700 pl-3")}>
      <div className="flex items-center gap-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 -mx-2">
        <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 cursor-grab" />
        
        <Checkbox
          checked={item.completed}
          onCheckedChange={handleCheckboxChange}
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-sm text-gray-900 dark:text-gray-100"
              placeholder="Enter checklist item..."
            />
          ) : (
            <span
              onClick={handleTextClick}
              className={cn(
                "cursor-text text-sm block w-full py-1 text-gray-900 dark:text-gray-100",
                item.completed && "line-through text-gray-500 dark:text-gray-400"
              )}
            >
              {item.text || "Enter checklist item..."}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          {depth === 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddSubItem}
              className="h-6 w-6 p-0 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(item.id)}
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Sub-items */}
      {item.subItems && item.subItems.length > 0 && (
        <div className="mt-1">
          {item.subItems.map((subItem) => (
            <ChecklistItem
              key={subItem.id}
              item={subItem}
              onUpdate={(id, updates) => handleUpdateSubItem(id, updates)}
              onDelete={(id) => handleDeleteSubItem(id)}
              onAddSubItem={() => {}} // Sub-items can't have their own sub-items
              onDeleteSubItem={() => {}}
              onUpdateSubItem={() => {}}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;
