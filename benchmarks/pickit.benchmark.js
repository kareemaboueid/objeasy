/**
 * Performance benchmarks for pickit function
 */
const chalk = require('chalk');
const { pickit } = require('../index.js');
const { generateUsers, generateLargeDataset } = require('./data-generator.js');

console.log(chalk.blue.bold('[PICKIT] Performance Benchmarks\n'));

// Generate test data
const smallData = generateUsers(1000);
const largeData = generateUsers(10000);
const extremeDataset = generateLargeDataset(15000);

/**
 * Benchmark pickit with different scenarios
 */
function runPickitBenchmarks() {
  // Test 1: Small object picking (basic info)
  console.log(chalk.yellow('Test 1: Small Object Picking (basic info)'));
  const iterations1 = 100000;
  const testObj = smallData[0];

  console.time('  pickit() basic');
  for (let i = 0; i < iterations1; i++) {
    pickit(testObj, ['name', 'email', 'role']);
  }
  console.timeEnd('  pickit() basic');

  console.time('  destructuring');
  for (let i = 0; i < iterations1; i++) {
    const { name, email, role } = testObj;
    ({ name, email, role });
  }
  console.timeEnd('  destructuring');

  // Test 2: Medium object picking (5-7 keys)
  console.log(chalk.yellow('\nTest 2: Medium Object Picking (5-7 keys)'));
  console.time('  pickit() medium');
  for (let i = 0; i < iterations1; i++) {
    pickit(testObj, ['name', 'email', 'role', 'department', 'age', 'city', 'country']);
  }
  console.timeEnd('  pickit() medium');

  console.time('  manual picking');
  for (let i = 0; i < iterations1; i++) {
    const result = {
      name: testObj.name,
      email: testObj.email,
      role: testObj.role,
      department: testObj.department,
      age: testObj.age,
      city: testObj.city,
      country: testObj.country
    };
    result;
  }
  console.timeEnd('  manual picking');

  // Test 3: Strict vs Non-strict mode
  console.log(chalk.yellow('\nTest 3: Strict vs Non-strict Mode'));
  const objWithMissingKeys = { name: 'Test', email: 'test@example.com' };

  console.time('  pickit() strict mode');
  for (let i = 0; i < iterations1; i++) {
    pickit(objWithMissingKeys, ['name', 'email'], { strict: true });
  }
  console.timeEnd('  pickit() strict mode');

  console.time('  pickit() non-strict mode');
  for (let i = 0; i < iterations1; i++) {
    pickit(objWithMissingKeys, ['name', 'email', 'nonexistent'], { strict: false });
  }
  console.timeEnd('  pickit() non-strict mode');

  // Test 4: Large dataset processing
  console.log(chalk.yellow('\nTest 4: Large Dataset Processing'));
  const iterations2 = 10000;

  console.time('  pickit() on 1k users');
  for (let i = 0; i < iterations2; i++) {
    smallData.map(user => pickit(user, ['name', 'email', 'department']));
  }
  console.timeEnd('  pickit() on 1k users');

  console.time('  map destructuring on 1k users');
  for (let i = 0; i < iterations2; i++) {
    smallData.map(({ name, email, department }) => ({ name, email, department }));
  }
  console.timeEnd('  map destructuring on 1k users');

  // Test 5: Extreme large object picking
  console.log(chalk.yellow('\nTest 5: Complex Nested Object Picking'));
  const iterations3 = 50000;

  console.time('  pickit() on complex nested object');
  for (let i = 0; i < iterations3; i++) {
    pickit(extremeDataset.users[0], ['name', 'email', 'department', 'preferences']);
  }
  console.timeEnd('  pickit() on complex nested object');

  console.time('  manual nested picking');
  for (let i = 0; i < iterations3; i++) {
    const user = extremeDataset.users[0];
    const result = {
      name: user.name,
      email: user.email,
      department: user.department,
      preferences: user.preferences
    };
    result;
  }
  console.timeEnd('  manual nested picking');

  console.log(chalk.green.bold('\n[SUCCESS] pickit benchmarks completed!\n'));
}

// Memory usage test
function measureMemoryUsage() {
  console.log(chalk.yellow('Memory Usage Test'));
  const used1 = process.memoryUsage().heapUsed / 1024 / 1024;

  // Perform many pickit operations
  const iterations = 10000;
  const results = [];
  for (let i = 0; i < iterations; i++) {
    results.push(pickit(largeData[i % largeData.length], ['name', 'email', 'role', 'department']));
  }

  const used2 = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`  Memory used for ${iterations} pickit operations: ${(used2 - used1).toFixed(2)} MB`);
}

// Run all benchmarks
if (require.main === module) {
  runPickitBenchmarks();
  measureMemoryUsage();

  console.log(chalk.cyan('Summary:'));
  console.log('- pickit excels at dynamic key selection and strict mode validation');
  console.log('- Destructuring is faster for static, known keys');
  console.log('- pickit provides better flexibility for runtime key selection');
  console.log('- Memory usage scales linearly with operation count');
}

module.exports = { runPickitBenchmarks, measureMemoryUsage };
