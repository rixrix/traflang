import { useState, useCallback } from 'react';

interface UseJavaScriptRunnerResult {
  run: (jsCode: string) => Promise<void>;
  output: string;
  isRunning: boolean;
  executionTime: number;
  clearOutput: () => void;
}

export function useJavaScriptRunner(): UseJavaScriptRunnerResult {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(0);

  const clearOutput = useCallback(() => {
    setOutput('');
    setExecutionTime(0);
  }, []);

  const run = useCallback(async (jsCode: string) => {
    if (!jsCode.trim()) {
      setOutput('🛑 No JavaScript code to execute. Click "CheckRoute" first to transpile your TrafLang code.');
      return;
    }

    setIsRunning(true);
    setOutput('🚗 Starting engine... Executing your code...\n\n');
    
    const startTime = performance.now();
    
    try {
      // Create a safe execution environment
      const originalConsole = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      
      let capturedOutput = '';
      
      // Override console methods to capture output
      console.log = (...args) => {
        capturedOutput += args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
      };
      
      console.warn = (...args) => {
        capturedOutput += '⚠️ WARNING: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
      };
      
      console.error = (...args) => {
        capturedOutput += '🛑 ERROR: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ') + '\n';
      };

      // Add a timeout for safety
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('🚧 Execution timeout - code took too long to run')), 5000);
      });

      const executionPromise = new Promise<void>((resolve, reject) => {
        try {
          // Execute the JavaScript code
          eval(jsCode);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      await Promise.race([executionPromise, timeoutPromise]);

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setExecutionTime(duration);

      // Restore original console methods
      console.log = originalConsole;
      console.warn = originalWarn;
      console.error = originalError;

      const finalOutput = capturedOutput || '✅ Code executed successfully (no output)';
      setOutput(finalOutput + `\n\n🎯 Execution completed in ${duration}ms`);

    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setExecutionTime(duration);
      
      // Restore original console methods
      console.log = console.log;
      console.warn = console.warn;
      console.error = console.error;

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`🛑 ROAD HAZARD DETECTED!\n\nExecution failed: ${errorMessage}\n\n🚧 Please check your code and try again.\n\n⏱️ Failed after ${duration}ms`);
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    run,
    output,
    isRunning,
    executionTime,
    clearOutput,
  };
}