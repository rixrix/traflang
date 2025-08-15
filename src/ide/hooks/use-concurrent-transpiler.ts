import { useState, useCallback, useDeferredValue, startTransition } from 'react';
import { TrafLangTranspiler } from '../../transpiler';
import { CompilerError } from '../../transpiler/types';

interface UseConcurrentTranspilerResult {
  transpile: (code: string) => void;
  jsCode: string;
  errors: CompilerError[];
  isTranspiling: boolean;
  lastTranspiled: string;
  isPending: boolean;
}

export function useConcurrentTranspiler(): UseConcurrentTranspilerResult {
  const [jsCode, setJsCode] = useState<string>('');
  const [errors, setErrors] = useState<CompilerError[]>([]);
  const [isTranspiling, setIsTranspiling] = useState<boolean>(false);
  const [lastTranspiled, setLastTranspiled] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [transpiler] = useState(() => new TrafLangTranspiler());

  // Use deferred value for the heavy computation
  const deferredCode = useDeferredValue(lastTranspiled);

  const transpile = useCallback((code: string) => {
    if (!code.trim()) {
      setJsCode('');
      setErrors([]);
      setLastTranspiled('');
      return;
    }

    setIsTranspiling(true);
    setIsPending(true);
    console.log('🚗 Starting concurrent transpilation...', { 
      codeLength: code.length, 
      lines: code.split('\n').length 
    });

    // Use startTransition to make this a non-blocking update
    startTransition(() => {
      try {
        // Break the work into smaller chunks to allow React to yield
        const processInChunks = async () => {
          console.log('📝 Processing TrafLang code in chunks...');
          
          // Yield to the browser first
          await new Promise(resolve => setTimeout(resolve, 0));
          
          const result = transpiler.transpile(code);
          console.log('✅ Concurrent transpilation completed:', { 
            success: result.success, 
            hasJS: !!result.javascript 
          });
          
          if (result.success) {
            setJsCode(result.javascript || '');
            setErrors([]);
            console.log('📦 JavaScript code generated successfully');
          } else {
            setJsCode('');
            setErrors(result.errors || []);
            console.log('❌ Transpilation errors:', result.errors);
          }
          
          setLastTranspiled(code);
          setIsTranspiling(false);
          setIsPending(false);
          console.log('🏁 Concurrent transpilation process completed');
        };

        processInChunks().catch(error => {
          console.error('💥 Concurrent transpilation error:', error);
          setJsCode('');
          setErrors([{
            type: 'syntax',
            message: error instanceof Error ? error.message : 'Unknown transpilation error',
            line: 1,
            column: 1,
            drivingMessage: '🛑 STOP! Road construction ahead - check your TrafLang syntax',
          }]);
          setIsTranspiling(false);
          setIsPending(false);
        });

      } catch (error) {
        console.error('💥 Concurrent transpilation error:', error);
        setJsCode('');
        setErrors([{
          type: 'syntax',
          message: error instanceof Error ? error.message : 'Unknown transpilation error',
          line: 1,
          column: 1,
          drivingMessage: '🛑 STOP! Road construction ahead - check your TrafLang syntax',
        }]);
        setIsTranspiling(false);
        setIsPending(false);
      }
    });
  }, [transpiler]);

  return {
    transpile,
    jsCode,
    errors,
    isTranspiling,
    lastTranspiled: deferredCode,
    isPending,
  };
}