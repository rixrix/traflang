'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Code2,
  Play,
  Car,
  Activity,
  Database,
  Wrench,
  Calculator,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface TabbedSidebarProps {
  onKeywordClick: (keyword: string, snippet: string) => void;
  onExampleClick: (example: string) => void;
}

interface KeywordCategory {
  name: string;
  icon: React.ReactNode;
  keywords: Array<{
    name: string;
    snippet: string;
    description: string;
  }>;
}

interface CodeExample {
  title: string;
  description: string;
  category: string;
  code: string;
}

interface ExampleCategory {
  name: string;
  icon: React.ReactNode;
  examples: CodeExample[];
}

const keywordCategories: KeywordCategory[] = [
  {
    name: 'Entry & Functions',
    icon: <Car className="w-4 h-4" />,
    keywords: [
      {
        name: 'StartEngine',
        snippet:
          'StartEngine {\n  DriverNote Your main function starts here\n  \n}',
        description: 'Main entry point - every program starts here',
      },
      {
        name: 'Drive',
        snippet:
          'Drive functionName CarryWith param1 CarryWith param2 {\n  DriverNote Function body here\n  ParkCar result\n}',
        description: 'Define a function with parameters',
      },
      {
        name: 'GoTo',
        snippet: 'GoTo functionName Bring arg1 Bring arg2',
        description: 'Call a function with arguments',
      },
      {
        name: 'ParkCar',
        snippet: 'ParkCar value',
        description: 'Return a value from function',
      },
    ],
  },
  {
    name: 'Variables',
    icon: <Database className="w-4 h-4" />,
    keywords: [
      {
        name: 'Remember',
        snippet: 'Remember variableName SetTo value',
        description: 'Declare a mutable variable (let)',
      },
      {
        name: 'NeverForget',
        snippet: 'NeverForget constantName SetTo value',
        description: 'Declare a constant (const)',
      },
      {
        name: 'QuickNote',
        snippet: 'QuickNote tempVar SetTo value',
        description: 'Declare a temporary variable (var)',
      },
      {
        name: 'SetTo',
        snippet: 'variableName SetTo newValue',
        description: 'Assign a new value to variable',
      },
    ],
  },
  {
    name: 'Control Flow',
    icon: <Activity className="w-4 h-4" />,
    keywords: [
      {
        name: 'CheckMirror',
        snippet: 'CheckMirror (condition) {\n  DriverNote Code when true\n}',
        description: 'If statement - check a condition',
      },
      {
        name: 'TakeAlternate',
        snippet:
          'CheckMirror (condition) {\n  DriverNote When true\n} TakeAlternate {\n  DriverNote When false\n}',
        description: 'Else statement - alternative path',
      },
      {
        name: 'KeepDriving',
        snippet:
          'KeepDriving WhileDriving (condition) {\n  DriverNote Loop body\n}',
        description: 'While loop - repeat while condition is true',
      },
      {
        name: 'Cruise',
        snippet:
          'Cruise item Through collection {\n  DriverNote Process each item\n}',
        description: 'For-of loop - iterate through collection',
      },
      {
        name: 'TrafficLight',
        snippet:
          'TrafficLight condition {\n  DriverNote Complex conditional logic\n}',
        description: 'Advanced conditional with traffic metaphor',
      },
    ],
  },
  {
    name: 'Data Structures',
    icon: <Database className="w-4 h-4" />,
    keywords: [
      {
        name: 'Passengers',
        snippet: 'Passengers ["item1", "item2", "item3"]',
        description: 'Create an array of items',
      },
      {
        name: 'Glove',
        snippet: 'Glove {\n  key1: "value1",\n  key2: "value2"\n}',
        description: 'Create an object with properties',
      },
      {
        name: 'Compartment',
        snippet: 'object.compartmentName',
        description: 'Access object property',
      },
    ],
  },
  {
    name: 'Array Methods',
    icon: <Wrench className="w-4 h-4" />,
    keywords: [
      {
        name: 'PickUp',
        snippet: 'arrayName PickUp newItem',
        description: 'Add item to end of array (push)',
      },
      {
        name: 'DropOff',
        snippet: 'arrayName DropOff',
        description: 'Remove last item from array (pop)',
      },
      {
        name: 'Transform',
        snippet:
          'arrayName Transform Drive CarryWith item {\n  ParkCar item Times 2\n}',
        description: 'Transform each item in array (map)',
      },
      {
        name: 'FilterPassengers',
        snippet:
          'arrayName FilterPassengers Drive CarryWith item {\n  ParkCar item FasterThan 10\n}',
        description: 'Filter array items by condition',
      },
      {
        name: 'CheckEach',
        snippet:
          'arrayName CheckEach Drive CarryWith item {\n  Announce item\n}',
        description: 'Execute function for each item (forEach)',
      },
    ],
  },
  {
    name: 'Operators',
    icon: <Calculator className="w-4 h-4" />,
    keywords: [
      {
        name: 'Add / Times / DivideBy',
        snippet:
          'value1 Add value2\nvalue1 Times value2\nvalue1 DivideBy value2',
        description: 'Mathematical operations',
      },
      {
        name: 'Join',
        snippet: '"Hello" Join " " Join "World"',
        description: 'String concatenation',
      },
      {
        name: 'SameAs / FasterThan',
        snippet: 'value1 SameAs value2\nvalue1 FasterThan value2',
        description: 'Comparison operations',
      },
      {
        name: 'And / Or / Not',
        snippet:
          'condition1 And condition2\ncondition1 Or condition2\nNot condition',
        description: 'Logical operations',
      },
    ],
  },
  {
    name: 'Output & Debug',
    icon: <MessageSquare className="w-4 h-4" />,
    keywords: [
      {
        name: 'Announce',
        snippet: 'Announce "Hello World!"',
        description: 'Output message to console (console.log)',
      },
      {
        name: 'Warn',
        snippet: 'Warn "Warning message"',
        description: 'Output warning message',
      },
      {
        name: 'Alert',
        snippet: 'Alert "Error occurred"',
        description: 'Output error message',
      },
      {
        name: 'DriverNote',
        snippet: 'DriverNote This is a comment',
        description: 'Single line comment',
      },
      {
        name: 'AskPassenger',
        snippet: 'AskPassenger "What is your name?"',
        description: 'Prompt user for input',
      },
    ],
  },
];

const codeExamples: CodeExample[] = [
  // Basic Examples
  {
    title: 'Hello World',
    description: 'Basic program structure with output',
    category: 'Basic',
    code: `StartEngine {
  Announce "Hello, TrafLang!"
  Announce "Welcome to driving-themed programming!"
}`,
  },
  {
    title: 'Variables & Math',
    description: 'Working with variables and calculations',
    category: 'Basic',
    code: `StartEngine {
  Remember speed SetTo 60
  NeverForget maxSpeed SetTo 120
  Remember distance SetTo speed Times 2
  Announce "Distance: " Join distance
  Announce "Speed is safe: " Join (speed AtMostAs maxSpeed)
}`,
  },
  {
    title: 'All Variable Types',
    description: 'Remember (let), NeverForget (const), QuickNote (var)',
    category: 'Basic',
    code: `StartEngine {
  Remember speed SetTo 60
  NeverForget maxSpeed SetTo 120
  QuickNote tempSpeed SetTo 80
  
  speed SetTo speed Add 10
  Announce "New speed: " Join speed
}`,
  },

  // Control Flow Examples
  {
    title: 'If-Else Statements',
    description: 'Using CheckMirror and TakeAlternate',
    category: 'Control Flow',
    code: `StartEngine {
  Remember speed SetTo 65
  
  CheckMirror (speed FasterThan 60) {
    Announce "Slow down! Speed limit exceeded"
  } TakeAlternate {
    Announce "Good speed, continue driving"
  }
}`,
  },
  {
    title: 'Nested Conditions',
    description: 'Multiple levels of if-else statements',
    category: 'Control Flow',
    code: `StartEngine {
  Remember speed SetTo 75
  Remember weather SetTo "rainy"
  
  CheckMirror (weather SameAs "rainy") {
    CheckMirror (speed FasterThan 50) {
      Announce "Too fast for rainy weather!"
    } TakeAlternate {
      Announce "Safe speed for rain"
    }
  } TakeAlternate {
    Announce "Good weather for driving"
  }
}`,
  },
  {
    title: 'Traffic Light System',
    description: 'Complex conditional logic with TrafficLight',
    category: 'Control Flow',
    code: `StartEngine {
  Remember lightColor SetTo "green"
  
  TrafficLight (lightColor) {
    CheckMirror (lightColor SameAs "red") {
      Announce "Stop! Red light"
    }
    CheckMirror (lightColor SameAs "yellow") {
      Announce "Slow down, prepare to stop"
    }
    CheckMirror (lightColor SameAs "green") {
      Announce "Go! Green light"
    }
  }
}`,
  },

  // Loop Examples
  {
    title: 'While Loop',
    description: 'Using KeepDriving for repetition',
    category: 'Loops',
    code: `StartEngine {
  Remember countdown SetTo 5
  
  KeepDriving WhileDriving (countdown FasterThan 0) {
    Announce countdown
    countdown SetTo countdown Subtract 1
  }
  Announce "Blast off!"
}`,
  },
  {
    title: 'For Loop with Counter',
    description: 'Manual drive loop with counter',
    category: 'Loops',
    code: `StartEngine {
  ManualDrive i From 1 To 5 {
    Announce "Lap " Join i
  }
  Announce "Race complete!"
}`,
  },
  {
    title: 'For-Of Loop',
    description: 'Iterating through arrays with Cruise',
    category: 'Loops',
    code: `StartEngine {
  Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
  
  Cruise passenger Through passengers {
    Announce "Picking up " Join passenger
  }
  Announce "All passengers aboard!"
}`,
  },
  {
    title: 'Loop with Break',
    description: 'Using StopCar to exit early',
    category: 'Loops',
    code: `StartEngine {
  Remember fuel SetTo 100
  
  KeepDriving WhileDriving (fuel FasterThan 0) {
    Announce "Fuel: " Join fuel
    fuel SetTo fuel Subtract 20
    
    CheckMirror (fuel AtMostAs 20) {
      Announce "Low fuel! Finding gas station..."
      StopCar
    }
  }
  Announce "Stopped for refueling"
}`,
  },

  // Array Examples
  {
    title: 'Array Creation & Access',
    description: 'Working with Passengers arrays',
    category: 'Arrays',
    code: `StartEngine {
  Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
  
  Announce "First passenger: " Join passengers[0]
  Announce "Total passengers: " Join (CountPassengers passengers)
  
  passengers PickUp "Diana"
  Announce "After pickup: " Join (CountPassengers passengers)
}`,
  },
  {
    title: 'Array Methods',
    description: 'Transform, Filter, and ForEach',
    category: 'Arrays',
    code: `StartEngine {
  Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
  
  Remember doubled SetTo numbers Transform Drive CarryWith n {
    ParkCar n Times 2
  }
  
  Remember evens SetTo numbers FilterPassengers Drive CarryWith n {
    ParkCar (n DivideBy 2 Times 2) SameAs n
  }
  
  Announce "Doubled: " Join doubled
  Announce "Evens: " Join evens
}`,
  },
  {
    title: 'Array Push and Pop',
    description: 'Adding and removing elements',
    category: 'Arrays',
    code: `StartEngine {
  Remember route SetTo Passengers ["Start", "Highway", "City"]
  
  route PickUp "Destination"
  Announce "Full route: " Join route
  
  Remember lastStop SetTo route DropOff
  Announce "Removed: " Join lastStop
  Announce "Remaining: " Join route
}`,
  },

  // Object Examples
  {
    title: 'Object Creation',
    description: 'Using Glove compartment for objects',
    category: 'Objects',
    code: `StartEngine {
  Remember car SetTo Glove {
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    mileage: 15000
  }
  
  Announce "Car: " Join car.brand Join " " Join car.model
  Announce "Year: " Join car.year
  Announce "Mileage: " Join car.mileage Join " miles"
}`,
  },
  {
    title: 'Nested Objects',
    description: 'Objects containing other objects',
    category: 'Objects',
    code: `StartEngine {
  Remember vehicle SetTo Glove {
    car: Glove {
      brand: "Honda",
      model: "Civic"
    },
    owner: Glove {
      name: "John",
      license: "DL123456"
    }
  }
  
  Announce vehicle.owner.name Join " drives a " Join vehicle.car.brand
}`,
  },
  {
    title: 'Object with Methods',
    description: 'Objects with function properties',
    category: 'Objects',
    code: `StartEngine {
  Remember car SetTo Glove {
    speed: 0,
    accelerate: Drive {
      car.speed SetTo car.speed Add 10
      Announce "Speed: " Join car.speed
    }
  }
  
  GoTo car.accelerate
  GoTo car.accelerate
  Announce "Final speed: " Join car.speed
}`,
  },

  // Function Examples
  {
    title: 'Function Declaration',
    description: 'Creating and calling functions',
    category: 'Functions',
    code: `Drive calculateFuelCost CarryWith distance CarryWith pricePerLiter {
  Remember consumption SetTo distance DivideBy 10
  ParkCar consumption Times pricePerLiter
}

StartEngine {
  Remember cost SetTo GoTo calculateFuelCost Bring 150 Bring 1.5
  Announce "Fuel cost: $" Join cost
}`,
  },
  {
    title: 'Multiple Functions',
    description: 'Functions calling other functions',
    category: 'Functions',
    code: `Drive calculateSpeed CarryWith distance CarryWith time {
  ParkCar distance DivideBy time
}

Drive reportSpeed CarryWith dist CarryWith hrs {
  Remember speed SetTo GoTo calculateSpeed Bring dist Bring hrs
  Announce "Average speed: " Join speed Join " mph"
  ParkCar speed
}

StartEngine {
  GoTo reportSpeed Bring 120 Bring 2
}`,
  },
  {
    title: 'Anonymous Functions',
    description: 'Inline function expressions',
    category: 'Functions',
    code: `StartEngine {
  Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
  
  Remember squared SetTo numbers Transform Drive CarryWith n {
    ParkCar n Times n
  }
  
  Announce "Squared numbers: " Join squared
}`,
  },

  // String Examples
  {
    title: 'String Operations',
    description: 'Concatenation and manipulation',
    category: 'Strings',
    code: `StartEngine {
  Remember firstName SetTo "Traf"
  Remember lastName SetTo "Lang"
  Remember fullName SetTo firstName Join " " Join lastName
  
  Announce "Full name: " Join fullName
  Announce "Length: " Join (CountPassengers fullName)
  
  Remember words SetTo fullName Split " "
  Announce "Words: " Join (CountPassengers words)
}`,
  },
  {
    title: 'String Methods',
    description: 'Various string operations',
    category: 'Strings',
    code: `StartEngine {
  Remember message SetTo "  Hello TrafLang World  "
  
  Remember trimmed SetTo message Trim
  Remember upper SetTo trimmed ToUpperCase
  Remember lower SetTo trimmed ToLowerCase
  
  Announce "Original: [" Join message Join "]"
  Announce "Trimmed: [" Join trimmed Join "]"
  Announce "Upper: " Join upper
  Announce "Lower: " Join lower
}`,
  },

  // Error Handling Examples
  {
    title: 'Try-Catch-Finally',
    description: 'Error handling with TryRoute',
    category: 'Error Handling',
    code: `StartEngine {
  TryRoute {
    Remember speed SetTo 150
    CheckMirror (speed FasterThan 120) {
      ThrowHazard "Speed limit exceeded!"
    }
  } IfLost CarryWith error {
    Alert "Caught error: " Join error
  } Finally {
    Announce "Safety check complete"
  }
}`,
  },
  {
    title: 'Safe Division',
    description: 'Handling division by zero',
    category: 'Error Handling',
    code: `Drive safeDivide CarryWith a CarryWith b {
  TryRoute {
    CheckMirror (b SameAs 0) {
      ThrowHazard "Cannot divide by zero!"
    }
    ParkCar a DivideBy b
  } IfLost CarryWith error {
    Alert error
    ParkCar 0
  }
}

StartEngine {
  Remember result SetTo GoTo safeDivide Bring 10 Bring 0
  Announce "Result: " Join result
}`,
  },

  // Advanced Examples
  {
    title: 'Speed Monitor System',
    description: 'Complete speed monitoring with alerts',
    category: 'Advanced',
    code: `Drive createSpeedMonitor {
  Remember monitor SetTo Glove {
    speeds: Passengers [],
    maxSpeed: 120,
    
    addSpeed: Drive CarryWith speed {
      monitor.speeds PickUp speed
      CheckMirror (speed FasterThan monitor.maxSpeed) {
        Warn "Speed limit exceeded: " Join speed
      }
    },
    
    getAverage: Drive {
      Remember total SetTo 0
      monitor.speeds CheckEach Drive CarryWith s {
        total SetTo total Add s
      }
      ParkCar total DivideBy (CountPassengers monitor.speeds)
    }
  }
  ParkCar monitor
}

StartEngine {
  Remember speedMonitor SetTo GoTo createSpeedMonitor
  
  GoTo speedMonitor.addSpeed Bring 60
  GoTo speedMonitor.addSpeed Bring 80
  GoTo speedMonitor.addSpeed Bring 130
  
  Remember avg SetTo GoTo speedMonitor.getAverage
  Announce "Average speed: " Join avg
}`,
  },
  {
    title: 'Passenger Management',
    description: 'Complete passenger tracking system',
    category: 'Advanced',
    code: `Drive createBus {
  Remember bus SetTo Glove {
    passengers: Passengers [],
    capacity: 20,
    
    board: Drive CarryWith name {
      CheckMirror ((CountPassengers bus.passengers) SlowerThan bus.capacity) {
        bus.passengers PickUp name
        Announce name Join " boarded the bus"
      } TakeAlternate {
        Warn "Bus is full!"
      }
    },
    
    disembark: Drive {
      CheckMirror ((CountPassengers bus.passengers) FasterThan 0) {
        Remember person SetTo bus.passengers DropOff
        Announce person Join " left the bus"
        ParkCar person
      } TakeAlternate {
        Warn "Bus is empty!"
        ParkCar null
      }
    },
    
    listPassengers: Drive {
      Announce "Current passengers:"
      bus.passengers CheckEach Drive CarryWith p {
        Announce " - " Join p
      }
    }
  }
  ParkCar bus
}

StartEngine {
  Remember schoolBus SetTo GoTo createBus
  
  GoTo schoolBus.board Bring "Alice"
  GoTo schoolBus.board Bring "Bob"
  GoTo schoolBus.board Bring "Charlie"
  
  GoTo schoolBus.listPassengers
  
  GoTo schoolBus.disembark
  GoTo schoolBus.listPassengers
}`,
  },
  {
    title: 'Traffic Simulation',
    description: 'Simulating traffic flow with multiple cars',
    category: 'Advanced',
    code: `Drive createCar CarryWith name CarryWith initialSpeed {
  ParkCar Glove {
    name: name,
    speed: initialSpeed,
    position: 0,
    
    move: Drive {
      this.position SetTo this.position Add this.speed
    },
    
    changeSpeed: Drive CarryWith newSpeed {
      this.speed SetTo newSpeed
    }
  }
}

StartEngine {
  Remember cars SetTo Passengers [
    GoTo createCar Bring "Toyota" Bring 60,
    GoTo createCar Bring "Honda" Bring 55,
    GoTo createCar Bring "Ford" Bring 65
  ]
  
  Remember time SetTo 0
  KeepDriving WhileDriving (time SlowerThan 3) {
    Announce "\nTime: " Join time Join " hour(s)"
    
    cars CheckEach Drive CarryWith car {
      GoTo car.move
      Announce car.name Join " at position " Join car.position
    }
    
    time SetTo time Add 1
  }
}`,
  },
  {
    title: 'Data Processing Pipeline',
    description: 'Complex data transformation example',
    category: 'Advanced',
    code: `StartEngine {
  Remember data SetTo Passengers [10, 25, 30, 45, 50, 65, 70, 85, 90]
  
  DriverNote Filter speeds over 60
  Remember fastSpeeds SetTo data FilterPassengers Drive CarryWith speed {
    ParkCar speed FasterThan 60
  }
  
  DriverNote Convert to safe speeds (80% of original)
  Remember safeSpeeds SetTo fastSpeeds Transform Drive CarryWith speed {
    ParkCar speed Times 0.8
  }
  
  DriverNote Calculate average
  Remember total SetTo 0
  safeSpeeds CheckEach Drive CarryWith speed {
    total SetTo total Add speed
  }
  Remember average SetTo total DivideBy (CountPassengers safeSpeeds)
  
  Announce "Original fast speeds: " Join fastSpeeds
  Announce "Safe speeds (80%): " Join safeSpeeds
  Announce "Average safe speed: " Join average
}`,
  },
];

// Group examples by category
const exampleCategories: ExampleCategory[] = [
  {
    name: 'Basic',
    icon: <Car className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Basic'),
  },
  {
    name: 'Control Flow',
    icon: <Activity className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Control Flow'),
  },
  {
    name: 'Loops',
    icon: <Wrench className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Loops'),
  },
  {
    name: 'Arrays',
    icon: <Database className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Arrays'),
  },
  {
    name: 'Objects',
    icon: <Database className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Objects'),
  },
  {
    name: 'Functions',
    icon: <Wrench className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Functions'),
  },
  {
    name: 'Strings',
    icon: <MessageSquare className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Strings'),
  },
  {
    name: 'Error Handling',
    icon: <Activity className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Error Handling'),
  },
  {
    name: 'Advanced',
    icon: <Calculator className="w-4 h-4" />,
    examples: codeExamples.filter(ex => ex.category === 'Advanced'),
  },
];

export function TabbedSidebar({
  onKeywordClick,
  onExampleClick,
}: TabbedSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Entry & Functions'])
  );
  const [expandedExampleCategories, setExpandedExampleCategories] = useState<
    Set<string>
  >(new Set(['Basic']));
  const [activeTab, setActiveTab] = useState<'keywords' | 'examples'>(
    'keywords'
  );

  // Calculate totals
  const totalKeywords = keywordCategories.reduce(
    (sum, cat) => sum + cat.keywords.length,
    0
  );
  const totalExamples = codeExamples.length;

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleExampleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedExampleCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedExampleCategories(newExpanded);
  };

  return (
    <div className="w-80 border-r border-indigo-200 bg-gradient-to-b from-indigo-50 to-white h-full flex flex-col">
      {/* Custom Tab Header */}
      <div className="border-b border-indigo-200 bg-indigo-100 flex-shrink-0">
        <div className="grid grid-cols-2 p-1">
          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'keywords'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            <Book className="w-4 h-4" />
            Keywords
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'examples'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Examples
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'keywords' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-indigo-200 bg-indigo-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-indigo-800">
                Click keywords to insert code
              </div>
              <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                {totalKeywords} keywords
              </div>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-scroll"
            style={{
              maxHeight: 'calc(100vh - 300px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#a5b4fc #e0e7ff',
            }}
          >
            <div className="p-4 space-y-3">
              {keywordCategories.map(category => (
                <div key={category.name} className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(category.name)}
                    className="w-full justify-start p-2 h-auto text-indigo-700 hover:bg-indigo-100"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {category.icon}
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 ml-auto transition-transform ${
                          expandedCategories.has(category.name)
                            ? 'rotate-90'
                            : ''
                        }`}
                      />
                    </div>
                  </Button>

                  {expandedCategories.has(category.name) && (
                    <div className="ml-6 space-y-1">
                      {category.keywords.map(keyword => (
                        <Button
                          key={keyword.name}
                          variant="ghost"
                          onClick={() =>
                            onKeywordClick(keyword.name, keyword.snippet)
                          }
                          className="w-full justify-start p-2 h-auto text-left hover:bg-indigo-50 group"
                        >
                          <div className="w-full">
                            <div className="flex items-center gap-2">
                              <code className="text-indigo-600 font-mono text-sm font-medium">
                                {keyword.name}
                              </code>
                              <Play className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {keyword.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-indigo-200 bg-indigo-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-indigo-800">
                Click to load into editor
              </div>
              <div className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                {totalExamples} examples
              </div>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-scroll"
            style={{
              maxHeight: 'calc(100vh - 300px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#a5b4fc #e0e7ff',
            }}
          >
            <div className="p-4 space-y-3">
              {exampleCategories.map(category => (
                <div key={category.name} className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleExampleCategory(category.name)}
                    className="w-full justify-start p-2 h-auto text-indigo-700 hover:bg-indigo-100"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {category.icon}
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-indigo-100 text-indigo-600 ml-1"
                      >
                        {category.examples.length}
                      </Badge>
                      <ChevronRight
                        className={`w-4 h-4 ml-auto transition-transform ${
                          expandedExampleCategories.has(category.name)
                            ? 'rotate-90'
                            : ''
                        }`}
                      />
                    </div>
                  </Button>

                  {expandedExampleCategories.has(category.name) && (
                    <div className="ml-6 space-y-2">
                      {category.examples.map((example, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => onExampleClick(example.code)}
                          className="w-full justify-start p-3 h-auto text-left hover:bg-indigo-50 border border-indigo-200 rounded-lg group"
                        >
                          <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-indigo-700">
                                {example.title}
                              </span>
                              <Play className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </div>
                            <p className="text-xs text-slate-600 mb-2">
                              {example.description}
                            </p>
                            <code className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
                              {example.code.split('\n')[0]}...
                            </code>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
