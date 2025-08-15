// IDE Type Definitions
import { CompilerError } from '../transpiler/types';

export interface IDEState {
  trafCode: string;
  jsCode: string;
  output: string;
  errors: CompilerError[];
  isRunning: boolean;
  isCompiling: boolean;
}

export interface IDEActions {
  compile: () => void;
  transpile: () => void;
  run: () => void;
  clear: () => void;
  updateTrafCode: (code: string) => void;
}

export interface TrafficError {
  type: 'stop' | 'warning' | 'caution' | 'roadblock';
  icon: '🛑' | '⚠️' | '🚧' | '🚫';
  message: string;
  drivingAdvice: string;
}