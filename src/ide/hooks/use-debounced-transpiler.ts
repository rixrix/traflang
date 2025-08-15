import { useEffect, useRef } from 'react';
import { useTranspiler } from './use-transpiler';

interface UseDebouncedTranspilerOptions {
  delay?: number;
  enabled?: boolean;
}

export function useDebouncedTranspiler(
  code: string,
  options: UseDebouncedTranspilerOptions = {}
) {
  const { delay = 500, enabled = true } = options;
  const transpilerResult = useTranspiler();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced transpilation
    timeoutRef.current = setTimeout(() => {
      transpilerResult.transpile(code);
    }, delay);

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, delay, enabled, transpilerResult.transpile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return transpilerResult;
}