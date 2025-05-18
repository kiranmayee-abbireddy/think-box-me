import React, { useState } from 'react';
import { Plus, ListFilter, Hourglass } from 'lucide-react';
import { TimeBlock } from '../types/types';
import { TimeBlockItem } from './TimeBlockItem';
import { TimeBlockForm } from './TimeBlockForm';
import { formatDateForDisplay } from '../utils/time';

interface TimeBlockListProps {
  timeBlocks: TimeBlock[];
  onStartBlock: (id: string) => void;
  onPauseBlock: (id: string) => void;
  onCompleteBlock: (id: string) => void;
  onAddBlock: (blockData: Omit<TimeBlock, 'id' | 'isComplete' | 'isActive' | 'elapsedSeconds'>) => void;
  onUpdateBlock: (id: string, blockData: Partial<TimeBlock>) => void;
  onDeleteBlock: (id: string) => void;
  activeBlockId: string | null;
}

type FilterOption = 'all' | 'active' | 'pending' | 'completed';

export const TimeBlockList: React.FC<TimeBlockListProps> = ({
  timeBlocks,
  onStartBlock,
  onPauseBlock,
  onCompleteBlock,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  activeBlockId
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  
  const handleAddClick = () => {
    setEditingBlock(null);
    setShowForm(true);
  };
  
  const handleEditClick = (block: TimeBlock) => {
    setEditingBlock(block);
    setShowForm(true);
  };
  
  const handleFormSubmit = (formData: Omit<TimeBlock, 'id' | 'isComplete' | 'isActive' | 'elapsedSeconds'>) => {
    if (editingBlock) {
      onUpdateBlock(editingBlock.id, formData);
    } else {
      onAddBlock(formData);
    }
    setShowForm(false);
    setEditingBlock(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBlock(null);
  };
  
  // Filter time blocks based on the selected filter option
  const filteredBlocks = timeBlocks.filter(block => {
    switch (filterOption) {
      case 'active':
        return block.isActive;
      case 'pending':
        return !block.isActive && !block.isComplete;
      case 'completed':
        return block.isComplete;
      default:
        return true;
    }
  });
  
  // Sort time blocks: active first, then by start time
  const sortedBlocks = [...filteredBlocks].sort((a, b) => {
    // Active blocks first
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    
    // Then sort by start time
    return a.startTime.localeCompare(b.startTime);
  });
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-inner h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {formatDateForDisplay()}
        </h2>
        <button
          onClick={handleAddClick}
          className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Block
        </button>
      </div>
      
      <div className="flex items-center mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
        <ListFilter className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
        <div className="flex space-x-1 text-sm">
          <button
            onClick={() => setFilterOption('all')}
            className={`px-2 py-1 rounded-md transition-colors ${
              filterOption === 'all' 
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterOption('active')}
            className={`px-2 py-1 rounded-md transition-colors ${
              filterOption === 'active' 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterOption('pending')}
            className={`px-2 py-1 rounded-md transition-colors ${
              filterOption === 'pending' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterOption('completed')}
            className={`px-2 py-1 rounded-md transition-colors ${
              filterOption === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {sortedBlocks.length > 0 ? (
        <div className="space-y-3">
          {sortedBlocks.map(block => (
            <TimeBlockItem
              key={block.id}
              timeBlock={block}
              onStart={() => onStartBlock(block.id)}
              onPause={() => onPauseBlock(block.id)}
              onComplete={() => onCompleteBlock(block.id)}
              onEdit={() => handleEditClick(block)}
              onDelete={() => onDeleteBlock(block.id)}
              isSelected={block.id === activeBlockId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          <Hourglass className="w-12 h-12 mb-2 opacity-30" />
          <p className="text-lg">No time blocks {filterOption !== 'all' ? `(${filterOption})` : ''}</p>
          <button
            onClick={handleAddClick}
            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create your first time block
          </button>
        </div>
      )}
      
      {showForm && (
        <TimeBlockForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingBlock || undefined}
          isEditing={!!editingBlock}
        />
      )}
    </div>
  );
};