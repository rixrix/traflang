// TrafLang Object Operations Tests
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('TrafLang Object Operations', () => {
  function transpileCode(code: string): string {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    expect(lexErrors).toHaveLength(0);
    
    const parser = new Parser(tokens);
    const { program, errors: parseErrors } = parser.parse();
    expect(parseErrors).toHaveLength(0);
    
    const generator = new CodeGenerator();
    return generator.generate(program);
  }

  describe('Object Declaration (Glove)', () => {
    test('should handle basic object declaration', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove {
            brand: "Toyota",
            speed: 60
          }
          Announce car
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let car = {');
      expect(result).toContain('brand: "Toyota"');
      expect(result).toContain('speed: 60');
      expect(result).toContain('console.log(car)');
    });

    test('should handle empty object declaration', () => {
      const code = `
        StartEngine {
          Remember emptyGlove SetTo Glove {}
          Announce emptyGlove
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let emptyGlove = {}');
      expect(result).toContain('console.log(emptyGlove)');
    });

    test('should handle nested object declaration', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove {
            brand: "Toyota",
            engine: Glove {
              type: "V6",
              power: 300
            }
          }
          Announce car
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let car = {');
      expect(result).toContain('brand: "Toyota"');
      expect(result).toContain('engine: {');
      expect(result).toContain('type: "V6"');
      expect(result).toContain('power: 300');
    });
  });

  describe('Object Property Access (Compartment)', () => {
    test('should handle basic property access', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota", speed: 60 }
          Remember brand SetTo car Compartment brand
          Announce brand
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let brand = car.brand');
      expect(result).toContain('console.log(brand)');
    });

    test('should handle nested property access', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove {
            engine: Glove {
              type: "V6"
            }
          }
          Remember engineType SetTo car Compartment engine Compartment type
          Announce engineType
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let engineType = car.engine.type');
      expect(result).toContain('console.log(engineType)');
    });

    test('should handle property assignment', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { speed: 60 }
          car Compartment speed SetTo 80
          Announce car Compartment speed
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('car.speed = 80');
      expect(result).toContain('console.log(car.speed)');
    });
  });

  describe('Object Methods', () => {
    test('should handle CheckCompartment (property access)', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota" }
          Remember brand SetTo car CheckCompartment brand
          Announce brand
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let brand = car.brand');
      expect(result).toContain('console.log(brand)');
    });

    test('should handle HasCompartment (hasOwnProperty)', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota" }
          Remember hasBrand SetTo car HasCompartment "brand"
          Announce hasBrand
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let hasBrand = car.hasOwnProperty("brand")');
      expect(result).toContain('console.log(hasBrand)');
    });

    test('should handle ListCompartments (Object.keys)', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota", speed: 60 }
          Remember keys SetTo ListCompartments car
          Announce keys
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let keys = Object.keys(car)');
      expect(result).toContain('console.log(keys)');
    });

    test('should handle CheckContents (Object.values)', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota", speed: 60 }
          Remember values SetTo CheckContents car
          Announce values
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let values = Object.values(car)');
      expect(result).toContain('console.log(values)');
    });
  });

  describe('Object Operations in Expressions', () => {
    test('should handle object operations in conditional expressions', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { speed: 60 }
          CheckMirror (car Compartment speed FasterThan 50) {
            Announce "Fast car!"
          } TakeAlternate {
            Announce "Slow car"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('if (car.speed > 50)');
      expect(result).toContain('console.log("Fast car!")');
      expect(result).toContain('console.log("Slow car")');
    });

    test('should handle object operations in loops', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { speed: 0 }
          KeepDriving (Remember i SetTo 0; i SlowerThan 5; i SpeedUp) {
            car Compartment speed SpeedUp
          }
          Announce car Compartment speed
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('for (let i = 0; i < 5; i++)');
      expect(result).toContain('car.speed++');
      expect(result).toContain('console.log(car.speed)');
    });
  });

  describe('Object Method Chaining', () => {
    test('should handle chained object operations', () => {
      const code = `
        StartEngine {
          Remember car SetTo Glove { 
            engine: Glove { 
              specs: Glove { 
                power: 300 
              } 
            } 
          }
          Remember power SetTo car Compartment engine Compartment specs Compartment power
          Announce power
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let power = car.engine.specs.power');
      expect(result).toContain('console.log(power)');
    });
  });

  describe('Integration with Other Language Features', () => {
    test('should handle objects in function parameters and returns', () => {
      const code = `
        Drive processCarInfo CarryWith carData {
          Remember brand SetTo carData Compartment brand
          Remember speed SetTo carData Compartment speed
          ParkCar Glove { 
            info: brand Join " - " Join speed,
            processed: Yes
          }
        }
        
        StartEngine {
          Remember car SetTo Glove { brand: "Toyota", speed: 60 }
          Remember result SetTo GoTo processCarInfo Bring car
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function processCarInfo(carData) {');
      expect(result).toContain('let brand = carData.brand');
      expect(result).toContain('let speed = carData.speed');
      expect(result).toContain('return {');
      expect(result).toContain('info: brand + " - " + speed');
      expect(result).toContain('processed: true');
      expect(result).toContain('let result = processCarInfo(car)');
    });

    test('should handle objects with array properties', () => {
      const code = `
        StartEngine {
          Remember garage SetTo Glove {
            cars: Passengers ["Toyota", "Honda", "BMW"],
            capacity: 10
          }
          Remember firstCar SetTo garage Compartment cars[0]
          Remember carCount SetTo garage Compartment cars CountPassengers
          Announce firstCar
          Announce carCount
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('cars: ["Toyota", "Honda", "BMW"]');
      expect(result).toContain('let firstCar = garage.cars[0]');
      expect(result).toContain('let carCount = garage.cars.length');
    });
  });

  describe('Error Cases and Edge Cases', () => {
    test('should handle object operations in complex expressions', () => {
      const code = `
        StartEngine {
          Remember car1 SetTo Glove { speed: 60 }
          Remember car2 SetTo Glove { speed: 80 }
          Remember faster SetTo car1 Compartment speed FasterThan car2 Compartment speed
          Announce faster
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let faster = car1.speed > car2.speed');
      expect(result).toContain('console.log(faster)');
    });
  });
});