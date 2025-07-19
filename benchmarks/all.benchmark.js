/**
 * Master benchmark runner for all objeasy functions with detailed performance metrics
 */
const chalk = require('chalk');
const { pickit } = require('../index.js');
const { modifyit } = require('../index.js');
const { mergeit } = require('../index.js');
const { transformit } = require('../index.js');
const { generateUsers, generateLargeDataset } = require('./data-generator.js');

console.log(chalk.magenta.bold('[OBJEASY] Complete Performance Suite\n'));

// Performance tracking
const performanceResults = {};

// Utility function to measure performance
function measurePerformance(name, fn, iterations = 1000) {
  const startMemory = process.memoryUsage();
  const startTime = process.hrtime.bigint();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const endTime = process.hrtime.bigint();
  const endMemory = process.memoryUsage();

  const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
  const memoryUsed = (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024; // Convert to MB

  return {
    avgTime: executionTime / iterations,
    totalTime: executionTime,
    memoryUsed: memoryUsed,
    iterations: iterations
  };
}

// Generate test data
const smallData = generateUsers(100);
const largeData = generateUsers(1000);
const complexData = generateLargeDataset(100);

console.log(chalk.gray('Running comprehensive benchmarks for all functions...\n'));

// PICKIT Benchmarks
console.log(chalk.cyan.bold('[RUNNING] PICKIT Performance Analysis...'));
const pickitTests = {
  'Basic Picking': () => pickit(smallData[0], ['name', 'email', 'role']),
  'Large Dataset': () => {
    const randomUser = largeData[Math.floor(Math.random() * largeData.length)];
    return pickit(randomUser, ['id', 'name', 'email', 'age']);
  },
  'Complex Object': () => {
    const complexObj = complexData[0];
    if (complexObj && typeof complexObj === 'object') {
      return pickit(complexObj, ['user', 'metadata']);
    }
    return pickit(smallData[0], ['name', 'email']);
  },
  'Strict Mode': () => pickit(smallData[0], ['name', 'email'], { strict: true }),
  'Deep Picking': () => {
    const nestedObj = {
      user: { profile: { name: smallData[0].name, email: smallData[0].email } },
      settings: { theme: 'dark', notifications: true }
    };
    return pickit(nestedObj, ['user.profile.name', 'settings.theme'], { deep: true });
  }
};

performanceResults.pickit = {};
for (const [testName, testFn] of Object.entries(pickitTests)) {
  const result = measurePerformance(`pickit-${testName}`, testFn, 1000);
  performanceResults.pickit[testName] = result;
}

// MODIFYIT Benchmarks
console.log(chalk.cyan.bold('[RUNNING] MODIFYIT Performance Analysis...'));
const modifyitTests = {
  'Simple Update': () => modifyit(smallData[0], { role: 'senior developer', updated: new Date() }),
  'Multiple Updates': () => modifyit(smallData[0], { name: 'Updated Name', age: 30, role: 'manager' }),
  'Property Removal': () => modifyit(smallData[0], ['password', 'internalId'], { erase: true }),
  'Large Object': () => modifyit(largeData[0], { status: 'processed', timestamp: Date.now() })
};

performanceResults.modifyit = {};
for (const [testName, testFn] of Object.entries(modifyitTests)) {
  const result = measurePerformance(`modifyit-${testName}`, testFn, 1000);
  performanceResults.modifyit[testName] = result;
}

// MERGEIT Benchmarks
console.log(chalk.cyan.bold('[RUNNING] MERGEIT Performance Analysis...'));
const obj1 = { a: 1, b: { c: 2, d: 3 } };
const obj2 = { b: { e: 4 }, f: 5 };
const mergeitTests = {
  'Simple Merge': () => mergeit(obj1, obj2),
  'Deep Merge': () => mergeit(obj1, obj2, { deep: true }),
  'Array Concat': () => mergeit({ arr: [1, 2] }, { arr: [3, 4] }, { arrays: 'concat' }),
  'Multiple Objects': () => mergeit(obj1, obj2, { extra: 'data' })
};

performanceResults.mergeit = {};
for (const [testName, testFn] of Object.entries(mergeitTests)) {
  const result = measurePerformance(`mergeit-${testName}`, testFn, 1000);
  performanceResults.mergeit[testName] = result;
}

// TRANSFORMIT Benchmarks
console.log(chalk.cyan.bold('[RUNNING] TRANSFORMIT Performance Analysis...'));
const transforms = {
  name: val => val.toUpperCase(),
  email: val => val.toLowerCase(),
  age: val => val + 1
};
const transformitTests = {
  'Simple Transform': () => transformit(smallData[0], transforms),
  'Complex Transform': () =>
    transformit(smallData[0], {
      name: val =>
        val
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      profile: (val, obj) => ({ ...val, computed: obj.age * 2 })
    }),
  'Array Transform': () => transformit({ items: [1, 2, 3] }, { items: arr => arr.map(x => x * 2) }),
  'Conditional Transform': () =>
    transformit(smallData[0], {
      status: (val, obj) => (obj.age > 25 ? 'senior' : 'junior')
    })
};

performanceResults.transformit = {};
for (const [testName, testFn] of Object.entries(transformitTests)) {
  const result = measurePerformance(`transformit-${testName}`, testFn, 1000);
  performanceResults.transformit[testName] = result;
}

// Display comprehensive results
console.log(chalk.green.bold('\n[SUCCESS] All benchmarks completed successfully!\n'));

console.log(chalk.magenta.bold('[DETAILED PERFORMANCE METRICS]'));

for (const [functionName, tests] of Object.entries(performanceResults)) {
  console.log(chalk.cyan.bold(`\n${functionName.toUpperCase()} Performance:`));

  let totalAvgTime = 0;
  let totalMemory = 0;
  let testCount = 0;

  for (const [testName, metrics] of Object.entries(tests)) {
    const avgTimeMs = metrics.avgTime.toFixed(4);
    const memoryMB = metrics.memoryUsed.toFixed(2);

    console.log(chalk.white(`  ${testName}:`));
    console.log(chalk.yellow(`    Speed: ${avgTimeMs}ms per operation`));
    console.log(chalk.blue(`    Memory: ${memoryMB}MB delta`));
    console.log('');

    totalAvgTime += metrics.avgTime;
    totalMemory += Math.abs(metrics.memoryUsed);
    testCount++;
  }

  const functionAvgTime = (totalAvgTime / testCount).toFixed(4);
  const functionAvgMemory = (totalMemory / testCount).toFixed(2);

  console.log(chalk.green(`  AVERAGE - Speed: ${functionAvgTime}ms | Memory: ${functionAvgMemory}MB`));
}

// Performance ranking
console.log(chalk.magenta.bold('\n[PERFORMANCE RANKING]'));
console.log();

const functionAverages = {};
for (const [functionName, tests] of Object.entries(performanceResults)) {
  const testValues = Object.values(tests);
  const avgTime = testValues.reduce((sum, test) => sum + test.avgTime, 0) / testValues.length;
  const avgMemory = testValues.reduce((sum, test) => sum + Math.abs(test.memoryUsed), 0) / testValues.length;
  functionAverages[functionName] = { avgTime, avgMemory };
}

// Sort by speed (ascending - faster is better)
const speedRanking = Object.entries(functionAverages)
  .sort(([, a], [, b]) => a.avgTime - b.avgTime)
  .map(([name], index) => `${index + 1}. ${name}`);

// Sort by memory efficiency (ascending - less memory is better)
const memoryRanking = Object.entries(functionAverages)
  .sort(([, a], [, b]) => a.avgMemory - b.avgMemory)
  .map(([name], index) => `${index + 1}. ${name}`);

console.log(chalk.cyan.bold('Speed Ranking (fastest to slowest):'));
speedRanking.forEach(rank => console.log(chalk.yellow(`  ${rank}`)));

console.log(chalk.cyan.bold('\nMemory Efficiency (most to least efficient):'));
memoryRanking.forEach(rank => console.log(chalk.blue(`  ${rank}`)));

console.log();
console.log(chalk.green.bold('[OBJEASY] Complete object manipulation toolkit with detailed metrics!'));

module.exports = { performanceResults };
