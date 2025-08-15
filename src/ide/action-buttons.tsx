import { Button } from '@/components/ui/button';
import { IDEActions, IDEState } from './types';
import { 
  Zap, 
  Map, 
  Play, 
  ParkingCircle, 
  Loader2, 
  AlertTriangle, 
  CheckCircle,
  Circle
} from 'lucide-react';

interface ActionButtonsProps {
  actions: IDEActions;
  state: IDEState;
}

export function ActionButtons({ actions, state }: ActionButtonsProps) {
  return (
    <div className="flex gap-3 items-center">
      {/* Primary Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={actions.compile}
          disabled={state.isCompiling}
          variant="outline"
          className="flex items-center gap-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700"
        >
          <Zap className="w-4 h-4" />
          StartEngine
          <span className="text-xs text-indigo-500">(Validate)</span>
        </Button>
        
        <Button 
          onClick={actions.transpile}
          disabled={state.isCompiling || !state.trafCode.trim()}
          variant="outline"
          className="flex items-center gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700"
        >
          <Map className="w-4 h-4" />
          CheckRoute
          <span className="text-xs text-emerald-500">(Transpile)</span>
        </Button>
        
        <Button 
          onClick={actions.run}
          disabled={state.isRunning || !state.jsCode.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Play className="w-4 h-4" />
          HitTheRoad
          <span className="text-xs">(Execute)</span>
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-2 ml-4 border-l border-indigo-200 pl-4">
        <Button 
          onClick={actions.clear}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-indigo-600 hover:bg-red-50 hover:text-red-600"
        >
          <ParkingCircle className="w-4 h-4" />
          ParkInGarage
          <span className="text-xs">(Clear)</span>
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4 ml-auto text-sm">
        {state.isCompiling && (
          <div className="flex items-center gap-2 text-indigo-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Checking route...</span>
            <div className="text-xs text-indigo-500 ml-2">
              ({state.trafCode.split('\n').length} lines, {state.trafCode.length} chars)
            </div>
          </div>
        )}
        
        {state.isRunning && (
          <div className="flex items-center gap-2 text-indigo-600">
            <Circle className="w-3 h-3 fill-current animate-pulse" />
            <span>Driving...</span>
          </div>
        )}

        {state.errors.length > 0 && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{state.errors.length} road hazard{state.errors.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {!state.isCompiling && !state.isRunning && state.errors.length === 0 && state.trafCode.trim() && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>Route clear</span>
          </div>
        )}
      </div>
    </div>
  );
}