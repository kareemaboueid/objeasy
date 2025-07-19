/**
 * Performance benchmarks for mergeit function
 */
const chalk = require('chalk');
const { mergeit } = require('../index.js');
const { generateUsers, generateLargeDataset } = require('./data-generator.js');

console.log(chalk.blue.bold('[MERGEIT] Performance Benchmarks\n'));

// Generate test data
const smallData = generateUsers(1000);
const largeData = generateUsers(10000);
const extremeDataset = generateLargeDataset(15000);

function runMergeitBenchmarks() {
  // Test 1: Simple object merging
  console.log(chalk.yellow('Test 1: Simple Object Merging'));
  const iterations1 = 50000;
  const baseObj = smallData[0];
  const updateObj = { role: 'senior developer', salary: baseObj.salary * 1.2 };

  console.time('  mergeit() simple merge');
  for (let i = 0; i < iterations1; i++) {
    mergeit(baseObj, updateObj);
  }
  console.timeEnd('  mergeit() simple merge');

  console.time('  Object.assign() simple merge');
  for (let i = 0; i < iterations1; i++) {
    Object.assign({}, baseObj, updateObj);
  }
  console.timeEnd('  Object.assign() simple merge');

  console.time('  spread operator simple merge');
  for (let i = 0; i < iterations1; i++) {
    ({ ...baseObj, ...updateObj });
  }
  console.timeEnd('  spread operator simple merge');

  // Test 2: Deep object merging
  console.log(chalk.yellow('\nTest 2: Deep Object Merging'));
  const deepObj1 = {
    user: baseObj,
    settings: { theme: 'dark', notifications: true },
    metadata: { created: Date.now(), version: 1 }
  };
  const deepObj2 = {
    settings: { language: 'en', notifications: false },
    metadata: { updated: Date.now() }
  };

  console.time('  mergeit() deep merge');
  for (let i = 0; i < iterations1; i++) {
    mergeit(deepObj1, deepObj2, { deep: true });
  }
  console.timeEnd('  mergeit() deep merge');

  console.time('  mergeit() shallow merge');
  for (let i = 0; i < iterations1; i++) {
    mergeit(deepObj1, deepObj2, { deep: false });
  }
  console.timeEnd('  mergeit() shallow merge');

  // Test 3: Array merging
  console.log(chalk.yellow('\nTest 3: Array Merging'));
  const objWithArrays1 = {
    skills: ['JavaScript', 'React'],
    projects: [{ name: 'Alpha', status: 'active' }]
  };
  const objWithArrays2 = {
    skills: ['Node.js', 'TypeScript'],
    projects: [{ name: 'Beta', status: 'planning' }]
  };

  console.time('  mergeit() array concat');
  for (let i = 0; i < iterations1; i++) {
    mergeit(objWithArrays1, objWithArrays2, { arrays: true });
  }
  console.timeEnd('  mergeit() array concat');

  console.time('  mergeit() array replace');
  for (let i = 0; i < iterations1; i++) {
    mergeit(objWithArrays1, objWithArrays2, { arrays: false });
  }
  console.timeEnd('  mergeit() array replace');

  // Test 4: Multiple object merging
  console.log(chalk.yellow('\nTest 4: Multiple Object Merging'));
  const obj1 = { a: 1, b: 2 };
  const obj2 = { c: 3, d: 4 };
  const obj3 = { e: 5, f: 6 };
  const obj4 = { g: 7, h: 8 };

  console.time('  mergeit() multiple objects');
  for (let i = 0; i < iterations1; i++) {
    mergeit(obj1, obj2, obj3, obj4);
  }
  console.timeEnd('  mergeit() multiple objects');

  console.time('  Object.assign() multiple objects');
  for (let i = 0; i < iterations1; i++) {
    Object.assign({}, obj1, obj2, obj3, obj4);
  }
  console.timeEnd('  Object.assign() multiple objects');

  // Test 5: Large object merging
  console.log(chalk.yellow('\nTest 5: Large Object Merging'));
  const iterations2 = 10000;
  const largeObj1 = extremeDataset.users[0];
  const largeObj2 = {
    ...extremeDataset.users[1],
    id: largeObj1.id, // Keep same ID
    mergedAt: Date.now()
  };

  console.time('  mergeit() large objects');
  for (let i = 0; i < iterations2; i++) {
    mergeit(largeObj1, largeObj2);
  }
  console.timeEnd('  mergeit() large objects');

  console.time('  spread operator large objects');
  for (let i = 0; i < iterations2; i++) {
    ({ ...largeObj1, ...largeObj2 });
  }
  console.timeEnd('  spread operator large objects');

  // Test 6: Complex nested merging
  console.log(chalk.yellow('\nTest 6: Complex Nested Structure'));
  const complex1 = {
    level1: {
      level2: {
        level3: { data: [1, 2, 3], info: 'original' }
      }
    }
  };
  const complex2 = {
    level1: {
      level2: {
        level3: { data: [4, 5, 6], extra: 'new' }
      }
    }
  };

  console.time('  mergeit() complex nested');
  for (let i = 0; i < iterations1; i++) {
    mergeit(complex1, complex2, { deep: true, arrays: true });
  }
  console.timeEnd('  mergeit() complex nested');

  console.log(chalk.green.bold('\n[SUCCESS] mergeit benchmarks completed!\n'));
}

// Memory usage test
function measureMemoryUsage() {
  console.log(chalk.yellow('Memory Usage Test'));
  const used1 = process.memoryUsage().heapUsed / 1024 / 1024;

  // Perform many mergeit operations
  const iterations = 5000;
  const results = [];
  for (let i = 0; i < iterations; i++) {
    const user1 = largeData[i % largeData.length];
    const user2 = largeData[(i + 1) % largeData.length];
    results.push(
      mergeit(user1, {
        mergedWith: user2.name,
        mergedAt: Date.now()
      })
    );
  }

  const used2 = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`  Memory used for ${iterations} mergeit operations: ${(used2 - used1).toFixed(2)} MB`);
}

// Run all benchmarks
if (require.main === module) {
  runMergeitBenchmarks();
  measureMemoryUsage();

  console.log(chalk.cyan('Summary:'));
  console.log('- mergeit excels at deep merging with configurable options');
  console.log('- Shallow merging is competitive with native methods');
  console.log('- Array merging strategies provide flexibility');
  console.log('- Deep merging trades performance for functionality');
}

module.exports = { runMergeitBenchmarks, measureMemoryUsage };
