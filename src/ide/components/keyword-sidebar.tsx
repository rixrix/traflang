'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface KeywordSidebarProps {
  onKeywordClick: (keyword: string, snippet: string) => void;
}

// Keyword categories with their keywords and code snippets
const keywordCategories = [
  {
    name: "🏁 Entry & Functions",
    color: "bg-blue-100 text-blue-800",
    keywords: [
      {
        name: "StartEngine",
        snippet: "StartEngine {\n  DriverNote Your main function starts here\n  \n}",
        description: "Main entry point - every program starts here"
      },
      {
        name: "Drive",
        snippet: "Drive functionName CarryWith param {\n  DriverNote Function body\n  ParkCar result\n}",
        description: "Define a function with parameters"
      },
      {
        name: "GoTo",
        snippet: "GoTo functionName Bring argument",
        description: "Call a function with arguments"
      },
      {
        name: "ParkCar",
        snippet: "ParkCar value",
        description: "Return a value from function"
      }
    ]
  },
  {
    name: "💾 Variables",
    color: "bg-green-100 text-green-800",
    keywords: [
      {
        name: "Remember",
        snippet: "Remember variableName SetTo value",
        description: "Create a variable (like 'let')"
      },
      {
        name: "NeverForget",
        snippet: "NeverForget constantName SetTo value",
        description: "Create a constant (like 'const')"
      },
      {
        name: "QuickNote",
        snippet: "QuickNote tempVar SetTo value",
        description: "Create a temporary variable (like 'var')"
      }
    ]
  },
  {
    name: "🚦 Control Flow",
    color: "bg-yellow-100 text-yellow-800",
    keywords: [
      {
        name: "CheckMirror",
        snippet: "CheckMirror (condition) {\n  DriverNote Do something\n}",
        description: "If statement - check a condition"
      },
      {
        name: "TakeAlternate",
        snippet: "} TakeAlternate {\n  DriverNote Alternative path\n}",
        description: "Else statement - alternative path"
      },
      {
        name: "KeepDriving",
        snippet: "KeepDriving WhileDriving (condition) {\n  DriverNote Loop body\n}",
        description: "While loop - keep repeating"
      },
      {
        name: "StopCar",
        snippet: "StopCar",
        description: "Break statement - exit loop"
      },
      {
        name: "KeepGoing",
        snippet: "KeepGoing",
        description: "Continue statement - next iteration"
      }
    ]
  },
  {
    name: "📦 Data Structures",
    color: "bg-purple-100 text-purple-800",
    keywords: [
      {
        name: "Passengers",
        snippet: "Remember arrayName SetTo Passengers [item1, item2, item3]",
        description: "Create an array of items"
      },
      {
        name: "Glove",
        snippet: "Remember objectName SetTo Glove {\n  key1: value1,\n  key2: value2\n}",
        description: "Create an object with properties"
      },
      {
        name: "Compartment",
        snippet: "objectName Compartment propertyName",
        description: "Access object property"
      }
    ]
  },
  {
    name: "🔧 Array Methods",
    color: "bg-orange-100 text-orange-800",
    keywords: [
      {
        name: "Transform",
        snippet: "arrayName Transform Drive CarryWith item {\n  ParkCar item Times 2\n}",
        description: "Transform each item (like map)"
      },
      {
        name: "FilterPassengers",
        snippet: "arrayName FilterPassengers Drive CarryWith item {\n  ParkCar item FasterThan 5\n}",
        description: "Filter items by condition"
      },
      {
        name: "CheckEach",
        snippet: "arrayName CheckEach Drive CarryWith item {\n  Announce item\n}",
        description: "Process each item (like forEach)"
      },
      {
        name: "PickUp",
        snippet: "arrayName PickUp newItem",
        description: "Add item to end (like push)"
      },
      {
        name: "DropOff",
        snippet: "arrayName DropOff",
        description: "Remove last item (like pop)"
      }
    ]
  },
  {
    name: "🎯 Operators",
    color: "bg-red-100 text-red-800",
    keywords: [
      {
        name: "Add / Subtract",
        snippet: "value1 Add value2\nvalue1 Subtract value2",
        description: "Math operations: + and -"
      },
      {
        name: "Times / DivideBy",
        snippet: "value1 Times value2\nvalue1 DivideBy value2",
        description: "Math operations: * and /"
      },
      {
        name: "SameAs / DifferentFrom",
        snippet: "value1 SameAs value2\nvalue1 DifferentFrom value2",
        description: "Equality comparisons: == and !="
      },
      {
        name: "FasterThan / SlowerThan",
        snippet: "value1 FasterThan value2\nvalue1 SlowerThan value2",
        description: "Comparison operators: > and <"
      },
      {
        name: "Join",
        snippet: "string1 Join string2",
        description: "Concatenate strings"
      }
    ]
  },
  {
    name: "📢 Output & Debug",
    color: "bg-teal-100 text-teal-800",
    keywords: [
      {
        name: "Announce",
        snippet: "Announce \"Hello, World!\"",
        description: "Print to console (like console.log)"
      },
      {
        name: "Warn",
        snippet: "Warn \"Warning message\"",
        description: "Print warning (like console.warn)"
      },
      {
        name: "Alert",
        snippet: "Alert \"Error message\"",
        description: "Print error (like console.error)"
      },
      {
        name: "DriverNote",
        snippet: "DriverNote This is a comment",
        description: "Single-line comment"
      }
    ]
  }
];

export function KeywordSidebar({ onKeywordClick }: KeywordSidebarProps) {
  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          🚗 TrafLang Keywords
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Click any keyword to insert into your code
        </p>
      </div>

      {/* Keywords */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {keywordCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${category.color} border-0`}>
                {category.name}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {category.keywords.map((keyword, keywordIndex) => (
                <Button
                  key={keywordIndex}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-200 border border-transparent"
                  onClick={() => onKeywordClick(keyword.name, keyword.snippet)}
                >
                  <div className="w-full">
                    <div className="font-mono font-bold text-blue-700 text-sm">
                      {keyword.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {keyword.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          💡 <strong>Tip:</strong> Keywords are highlighted in the editor
        </div>
      </div>
    </div>
  );
}