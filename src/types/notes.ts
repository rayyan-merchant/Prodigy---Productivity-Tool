
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  isFavorite: boolean;
  isEncrypted: boolean;
  encryptedContent?: string;
  passwordHash?: string;
  salt?: string;
  isLocked: boolean;
  lockPasswordHash?: string;
  lockSalt?: string;
  isChecklist?: boolean;
  checklistItems?: ChecklistItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItemData {
  id: string;
  text: string;
  completed: boolean;
  subItems?: ChecklistItemData[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  tags?: string[];
  folder?: string;
  folderId?: string;
  favorite?: boolean;
  isFavorite?: boolean;
  encrypted?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
