
import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, Folder as FolderIcon, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchFilters, Folder } from '@/types/notes';
import { format } from 'date-fns';

interface AdvancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  folders: Folder[];
  availableTags: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  folders,
  availableTags
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined
  );

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handleFilterChange('tags', newTags.length > 0 ? newTags : undefined);
  };

  const handleDateRangeChange = () => {
    if (dateFrom && dateTo) {
      handleFilterChange('dateRange', {
        start: dateFrom.toISOString(),
        end: dateTo.toISOString()
      });
    } else {
      handleFilterChange('dateRange', undefined);
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <Card className="animate-fade-in">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Advanced Filters</h3>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Folder Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <FolderIcon className="h-4 w-4 mr-1" />
                  Folder
                </label>
                <Select
                  value={filters.folderId || ""}
                  onValueChange={(value) => handleFilterChange('folderId', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All folders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All folders</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: folder.color }}
                          />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Favorites
                </label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorites"
                    checked={filters.isFavorite || false}
                    onCheckedChange={(checked) => handleFilterChange('isFavorite', checked || undefined)}
                  />
                  <label htmlFor="favorites" className="text-sm">
                    Show only favorites
                  </label>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date Range
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        {dateFrom ? format(dateFrom, 'MMM dd') : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={(date) => {
                          setDateFrom(date);
                          if (date && dateTo) {
                            setTimeout(handleDateRangeChange, 0);
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        {dateTo ? format(dateTo, 'MMM dd') : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={(date) => {
                          setDateTo(date);
                          if (dateFrom && date) {
                            setTimeout(handleDateRangeChange, 0);
                          }
                        }}
                        disabled={(date) => date > new Date() || (dateFrom && date < dateFrom)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Tags
                </label>
                <div className="max-h-32 overflow-y-auto">
                  {availableTags.length > 0 ? (
                    <div className="space-y-1">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags?.includes(tag) || false}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <label htmlFor={`tag-${tag}`} className="text-sm">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {filters.folderId && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FolderIcon className="h-3 w-3" />
                      {folders.find(f => f.id === filters.folderId)?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('folderId', undefined)}
                      />
                    </Badge>
                  )}
                  {filters.isFavorite && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Favorites
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('isFavorite', undefined)}
                      />
                    </Badge>
                  )}
                  {filters.dateRange && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(filters.dateRange.start), 'MMM dd')} - {format(new Date(filters.dateRange.end), 'MMM dd')}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => {
                          handleFilterChange('dateRange', undefined);
                          setDateFrom(undefined);
                          setDateTo(undefined);
                        }}
                      />
                    </Badge>
                  )}
                  {filters.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
