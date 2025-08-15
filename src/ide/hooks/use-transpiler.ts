import { useState, useCallback, useEffect } from 'react';
import { TrafLangTranspiler } from '../../transpiler';
import { CompilerError } from '../../transpiler/types';

interface UseTranspilerResult {
  transpile: (code: string) => void;
  jsCode: string;
  errors: CompilerError[];
  isTranspiling: boolean;
  lastTranspiled: string;
}

export function useTranspiler(): UseTranspilerResult {
  const [jsCode, setJsCode] = useState<string>('');
  const [errors, setErrors] = useState<CompilerError[]>([]);
  const [isTranspiling, setIsTranspiling] = useState<boolean>(false);
  const [lastTranspiled, setLastTranspiled] = useState<string>('');
  const [transpiler] = useState(() => new TrafLangTranspiler());

  const transpile = useCallback((code: string) => {
    if (!code.trim()) {
      setJsCode('');
      setErrors([]);
      setLastTranspiled('');
      return;
    }

    setIsTranspiling(true);
    
    try {
      const result = transpiler.transpile(code);
      
      if (result.success) {
        setJsCode(result.javascript || '');
        setErrors([]);
      } else {
        setJsCode('');
        setErrors(result.errors || []);
      }
      
      setLastTranspiled(code);
    } catch (error) {
      console.error('Transpilation error:', error);
      setJsCode('');
      setErrors([{
        type: 'syntax',
        message: error instanceof Error ? error.message : 'Unknown transpilation error',
        line: 1,
        column: 1,
        drivingMessage: '🛑 STOP! Road construction ahead - check your TrafLang syntax',
      }]);
    } finally {
      setIsTranspiling(false);
    }
  }, [transpiler]);

  return {
    transpile,
    jsCode,
    errors,
    isTranspiling,
    lastTranspiled,
  };
}