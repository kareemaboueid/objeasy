/**
 * Performance Benchmarks for objeasy
 */

const { pickit, modifyit } = require('../index');
const chalk = require('chalk');

// Utility function to measure execution time
function benchmark(name, fn, iterations = 100000) {
  const start = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds

  console.log(`  ${name}: ${chalk.cyan(duration.toFixed(2) + 'ms')} (${chalk.gray(iterations + ' iterations')})`);
  return duration;
}

// Test data
const smallObject = { name: 'John', age: 30, role: 'dev' };
const mediumObject = {
  id: 1,
  name: 'John',
  age: 30,
  role: 'dev',
  email: 'john@example.com',
  city: 'New York',
  country: 'USA',
  phone: '123-456-7890',
  salary: 75000,
  department: 'Engineering'
};
const largeObject = {};
for (let i = 0; i < 100; i++) {
  largeObject[`prop${i}`] = `value${i}`;
}

console.log(chalk.bold.blue('objeasy Performance Benchmarks'));
console.log();

// Benchmark 1: pickit vs destructuring (small object)
console.log(chalk.yellow('Test 1: Small Object Picking (3 keys)'));
const pickitSmall = () => pickit(smallObject, ['name', 'age']);
const destructuringSmall = () => {
  const { name, age } = smallObject;
  return { name, age };
};

benchmark('pickit()', pickitSmall);
benchmark('destructuring', destructuringSmall);
console.log();

// Benchmark 2: pickit vs destructuring (medium object)
console.log(chalk.yellow('Test 2: Medium Object Picking (5 keys)'));
const pickitMedium = () => pickit(mediumObject, ['name', 'age', 'role', 'email', 'city']);
const destructuringMedium = () => {
  const { name, age, role, email, city } = mediumObject;
  return { name, age, role, email, city };
};

benchmark('pickit()', pickitMedium);
benchmark('destructuring', destructuringMedium);
console.log();

// Benchmark 3: pickit vs manual property assignment (large object)
console.log(chalk.yellow('Test 3: Large Object Picking (10 keys)'));
const keysToPickLarge = [
  'prop1',
  'prop5',
  'prop10',
  'prop15',
  'prop20',
  'prop25',
  'prop30',
  'prop35',
  'prop40',
  'prop45'
];
const pickitLarge = () => pickit(largeObject, keysToPickLarge);
const manualPickLarge = () => {
  const result = {};
  keysToPickLarge.forEach(key => {
    if (key in largeObject) {
      result[key] = largeObject[key];
    }
  });
  return result;
};

benchmark('pickit()', pickitLarge);
benchmark('manual picking', manualPickLarge);
console.log();

// Benchmark 4: modifyit vs Object.assign
console.log(chalk.yellow('Test 4: Object Modification'));
const modifications = { role: 'senior dev', age: 31 };

const modifyitTest = () => {
  const obj = { ...smallObject };
  modifyit(obj, modifications);
  return obj;
};
const objectAssignTest = () => {
  const obj = { ...smallObject };
  Object.assign(obj, modifications);
  return obj;
};

benchmark('modifyit()', modifyitTest);
benchmark('Object.assign()', objectAssignTest);
console.log();

// Benchmark 5: Memory usage test (approximate)
console.log(chalk.yellow('Test 5: Memory Usage (approximate)'));
const memoryBefore = process.memoryUsage().heapUsed;

// Create many objects with pickit
const results = [];
for (let i = 0; i < 10000; i++) {
  results.push(pickit(mediumObject, ['name', 'age', 'role']));
}

const memoryAfter = process.memoryUsage().heapUsed;
const memoryUsed = (memoryAfter - memoryBefore) / 1024 / 1024; // Convert to MB

console.log(`  Memory used for 10,000 pickit operations: ${chalk.cyan(memoryUsed.toFixed(2) + ' MB')}`);
console.log();

// Benchmark 6: pickit with strict mode
console.log(chalk.yellow('Test 6: Strict Mode Performance'));
const pickitStrict = () => pickit(smallObject, ['name', 'age'], { strict: true });
const pickitNonStrict = () => pickit(smallObject, ['name', 'age', 'nonexistent'], { strict: false });

benchmark('pickit() strict mode', pickitStrict);
benchmark('pickit() non-strict mode', pickitNonStrict);
console.log();

console.log(chalk.green('Benchmarks completed!'));
console.log();
console.log(chalk.bold('Notes:'));
console.log('- Times may vary between runs due to V8 optimizations');
console.log('- Results depend on Node.js version and system performance');
console.log('- Benchmarks use 100,000 iterations for statistical relevance');
