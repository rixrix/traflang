import { useState, useEffect, useCallback } from 'react';

interface SavedCode {
  id: string;
  name: string;
  code: string;
  timestamp: number;
}

interface UseLocalStorageResult {
  savedCodes: SavedCode[];
  currentCode: string;
  saveCode: (name: string, code: string) => void;
  loadCode: (id: string) => string | null;
  deleteCode: (id: string) => void;
}

const STORAGE_KEY = 'traflang-saved-codes';

export function useLocalStorage(): UseLocalStorageResult {
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');

  // Load saved codes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedCodes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved codes:', error);
    }
  }, []);

  // Save codes to localStorage whenever savedCodes changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCodes));
    } catch (error) {
      console.error('Error saving codes:', error);
    }
  }, [savedCodes]);

  const saveCode = useCallback((name: string, code: string) => {
    const newCode: SavedCode = {
      id: Date.now().toString(),
      name: name.trim() || `Untitled ${Date.now()}`,
      code,
      timestamp: Date.now(),
    };

    setSavedCodes(prev => [newCode, ...prev.slice(0, 9)]); // Keep only 10 most recent
    setCurrentCode(code);
  }, []);

  const loadCode = useCallback((id: string) => {
    const codeToLoad = savedCodes.find(code => code.id === id);
    if (codeToLoad) {
      setCurrentCode(codeToLoad.code);
      return codeToLoad.code;
    }
    return null;
  }, [savedCodes]);

  const deleteCode = useCallback((id: string) => {
    setSavedCodes(prev => prev.filter(code => code.id !== id));
  }, []);

  return {
    savedCodes,
    currentCode,
    saveCode,
    loadCode,
    deleteCode,
  };
}