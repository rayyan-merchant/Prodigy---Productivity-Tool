
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import ChecklistItem from './ChecklistItem';
import { ChecklistItemData } from '@/types/notes';
import { cn } from '@/lib/utils';

interface ChecklistProps {
  items: ChecklistItemData[];
  onChange: (items: ChecklistItemData[]) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onChange }) => {
  const [showCompleted, setShowCompleted] = useState(true);

  // Separate completed and incomplete items
  const incompleteItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addNewItem = () => {
    const newItem: ChecklistItemData = {
      id: generateId(),
      text: '',
      completed: false,
      subItems: []
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ChecklistItemData>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onChange(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onChange(updatedItems);
  };

  const addSubItem = (parentId: string) => {
    const newSubItem: ChecklistItemData = {
      id: generateId(),
      text: '',
      completed: false
    };

    const updatedItems = items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: [...(item.subItems || []), newSubItem]
        };
      }
      return item;
    });
    onChange(updatedItems);
  };

  const deleteSubItem = (parentId: string, subItemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: (item.subItems || []).filter(subItem => subItem.id !== subItemId)
        };
      }
      return item;
    });
    onChange(updatedItems);
  };

  const updateSubItem = (parentId: string, subItemId: string, updates: Partial<ChecklistItemData>) => {
    const updatedItems = items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: (item.subItems || []).map(subItem => 
            subItem.id === subItemId ? { ...subItem, ...updates } : subItem
          )
        };
      }
      return item;
    });
    onChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      {/* Incomplete Items */}
      <div className="space-y-1">
        {incompleteItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onAddSubItem={addSubItem}
            onDeleteSubItem={deleteSubItem}
            onUpdateSubItem={updateSubItem}
          />
        ))}
      </div>

      {/* Add New Item Button */}
      <Button
        variant="ghost"
        onClick={addNewItem}
        className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 h-8"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add item
      </Button>

      {/* Completed Section */}
      {completedItems.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <Button
            variant="ghost"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 h-8 px-2 mb-2"
          >
            {showCompleted ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Completed ({completedItems.length})
          </Button>
          
          {showCompleted && (
            <div className="space-y-1 opacity-75">
              {completedItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  onAddSubItem={addSubItem}
                  onDeleteSubItem={deleteSubItem}
                  onUpdateSubItem={updateSubItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checklist;
