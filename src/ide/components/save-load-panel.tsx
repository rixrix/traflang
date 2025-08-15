'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Folder, 
  Trash2, 
  Clock, 
  FileText,
  ChevronDown,
  ChevronUp,
  ParkingCircle
} from 'lucide-react';

interface SavedCode {
  id: string;
  name: string;
  code: string;
  timestamp: number;
}

interface SaveLoadPanelProps {
  savedCodes: SavedCode[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  currentCode: string;
}

export function SaveLoadPanel({ 
  savedCodes, 
  onSave, 
  onLoad, 
  onDelete, 
  currentCode 
}: SaveLoadPanelProps) {
  const [saveName, setSaveName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    if (saveName.trim() && currentCode.trim()) {
      onSave(saveName.trim());
      setSaveName('');
      setIsExpanded(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getCodePreview = (code: string, maxLength: number = 50) => {
    const preview = code.replace(/\n/g, ' ').trim();
    return preview.length > maxLength ? preview.substring(0, maxLength) + '...' : preview;
  };

  return (
    <div className="w-80 bg-white border-l border-indigo-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-indigo-200 bg-indigo-50">
        <h2 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
          <ParkingCircle className="w-5 h-5" />
          Code Garage
        </h2>
        <p className="text-sm text-indigo-600 mt-1">
          Save and load your TrafLang programs
        </p>
      </div>

      {/* Save Section */}
      <div className="p-4 border-b border-indigo-200 bg-indigo-50">
        <div className="space-y-3">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="w-full flex items-center gap-2 justify-center border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            disabled={!currentCode.trim()}
          >
            <Save className="w-4 h-4" />
            Park Your Code
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
          
          {isExpanded && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="Enter a name for your code..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={!saveName.trim() || !currentCode.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setSaveName('');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Codes List */}
      <div className="flex-1 overflow-y-auto p-4">
        {savedCodes.length === 0 ? (
          <div className="text-center text-indigo-400 mt-8">
            <ParkingCircle className="w-16 h-16 mx-auto mb-3 text-indigo-300" />
            <div className="text-sm">
              No saved programs yet
            </div>
            <div className="text-xs text-indigo-300 mt-1">
              Write some code and park it here!
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Recent Programs
              <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-600">
                {savedCodes.length}
              </Badge>
            </div>
            
            {savedCodes.map((savedCode) => (
              <Card key={savedCode.id} className="p-3 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-indigo-800 text-sm flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {savedCode.name}
                      </div>
                      <div className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(savedCode.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded p-2 text-xs font-mono text-indigo-600 border border-indigo-100">
                    {getCodePreview(savedCode.code)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onLoad(savedCode.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <ParkingCircle className="w-3 h-3 mr-1" />
                      Load
                    </Button>
                    <Button
                      onClick={() => onDelete(savedCode.id)}
                      size="sm"
                      variant="ghost"
                      className="text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-indigo-50 border-t border-indigo-200">
        <div className="text-xs text-indigo-500 text-center">
          <div className="flex items-center justify-center gap-1">
            <Folder className="w-3 h-3" />
            Stored locally in your browser
          </div>
        </div>
      </div>
    </div>
  );
}