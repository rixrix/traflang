# 🚗 TrafLang IDE

> **Drive your code with intuitive syntax!**

TrafLang is a programming language that uses driving metaphors to make coding more intuitive and fun. This repository contains a complete web-based IDE for writing, transpiling, and running TrafLang programs.

## ✨ Features

- 🎨 **Professional Code Editor** - Monaco Editor with syntax highlighting
- 🔧 **Real-time Transpilation** - Converts TrafLang to JavaScript as you type
- ▶️ **Instant Execution** - Run your code and see results immediately
- 📝 **Clickable Keywords** - 40+ keywords organized in 7 categories
- 💾 **Auto-Save** - Never lose your work with automatic persistence
- 🛑 **Smart Error Handling** - Clear error messages with driving metaphors
- 📚 **Built-in Help** - Comprehensive reference guide and examples

## 🚀 Quick Start

### Installation

```bash
git clone [repository-url]
cd traflang-transpiler
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start coding with TrafLang!

### Build for Production

```bash
npm run build
npm start
```

## 🎯 TrafLang Syntax

TrafLang uses driving metaphors for programming concepts:

### Basic Program Structure
```traflang
StartEngine {
  Remember greeting SetTo "Hello, TrafLang!"
  Announce greeting
}
```

### Functions
```traflang
Drive calculateSpeed CarryWith distance CarryWith time {
  Remember speed SetTo distance DivideBy time
  ParkCar speed
}

StartEngine {
  Remember result SetTo GoTo calculateSpeed Bring 100 Bring 2
  Announce result
}
```

### Control Flow
```traflang
StartEngine {
  Remember speed SetTo 65
  CheckMirror (speed FasterThan 60) {
    Announce "Slow down!"
  } TakeAlternate {
    Announce "Good speed"
  }
}
```

### Data Structures
```traflang
StartEngine {
  Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
  Remember car SetTo Glove {
    brand: "Toyota",
    model: "Camry"
  }
  
  passengers CheckEach Drive CarryWith person {
    Announce "Passenger: " Join person
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
├── components/ui/          # Reusable UI components
├── ide/                    # IDE components and hooks
│   ├── components/         # IDE-specific components
│   ├── hooks/             # Custom React hooks
│   └── monaco/            # Monaco Editor configuration
└── transpiler/            # TrafLang transpiler
    ├── __tests__/         # Test files
    ├── lexer.ts           # Tokenizer
    ├── parser.ts          # AST parser
    └── code-generator.ts  # JavaScript generator
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Results**: 250/251 tests passing (99.6% success rate)

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 📚 Documentation

- [IDE Features Guide](docs/AWESOME-IDE-SUMMARY.md) - Complete feature overview
- [Language Specifications](.kiro/specs/traflang-transpiler/) - Complete TrafLang specification

## 🎨 IDE Features

### Keyword Categories
- 🏁 **Entry & Functions**: StartEngine, Drive, GoTo, ParkCar
- 💾 **Variables**: Remember, NeverForget, QuickNote
- 🚦 **Control Flow**: CheckMirror, TakeAlternate, KeepDriving
- 📦 **Data Structures**: Passengers, Glove, Compartment
- 🔧 **Array Methods**: Transform, FilterPassengers, CheckEach
- 🎯 **Operators**: Add, Times, SameAs, Join
- 📢 **Output & Debug**: Announce, Warn, DriverNote

### Professional Features
- **Syntax Highlighting**: Color-coded keywords and operators
- **Error Recovery**: Graceful error handling with helpful tips
- **Auto-completion Ready**: Infrastructure for future IntelliSense
- **Code Persistence**: Local storage with auto-save
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚗 Happy Coding!

Start your coding journey with TrafLang - where programming meets the open road! 🛣️✨