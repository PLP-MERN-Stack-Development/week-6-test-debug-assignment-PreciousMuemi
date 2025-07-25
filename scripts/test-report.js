#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Comprehensive Test Suite...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n${colors.blue}${description}...${colors.reset}`);
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    log(`✅ ${description} completed successfully`, 'green');
    return { success: true, output: result };
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    log(error.message, 'red');
    return { success: false, output: error.message };
  }
}

// Test results storage
const testResults = {
  unit: { success: false, output: '' },
  integration: { success: false, output: '' },
  e2e: { success: false, output: '' },
  coverage: { success: false, output: '' }
};

// Run server unit tests
testResults.unit = runCommand(
  'cd server && npm test',
  'Running Server Unit Tests'
);

// Run server integration tests
testResults.integration = runCommand(
  'cd server && npm run test:integration',
  'Running Server Integration Tests'
);

// Run client unit tests
const clientUnitTest = runCommand(
  'cd client && npm test -- --coverage --watchAll=false',
  'Running Client Unit Tests'
);

// Run E2E tests (if server and client are running)
log('\n⚠️  Note: E2E tests require both server and client to be running', 'yellow');
log('Start the development servers with: npm run dev', 'yellow');

// Generate test report
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      coverage: 'N/A'
    },
    details: {
      unit: testResults.unit,
      integration: testResults.integration,
      clientUnit: clientUnitTest,
      e2e: { success: false, output: 'Manual testing required' }
    }
  };

  // Calculate summary
  const allTests = [testResults.unit, testResults.integration, clientUnitTest];
  report.summary.totalTests = allTests.length;
  report.summary.passedTests = allTests.filter(t => t.success).length;
  report.summary.failedTests = allTests.filter(t => !t.success).length;

  // Save report
  const reportPath = path.join(process.cwd(), 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

// Display results
function displayResults(report) {
  log('\n' + '='.repeat(60), 'bold');
  log('📊 TEST EXECUTION SUMMARY', 'bold');
  log('='.repeat(60), 'bold');

  log(`\n📅 Timestamp: ${report.timestamp}`);
  log(`📈 Total Test Suites: ${report.summary.totalTests}`);
  log(`✅ Passed: ${report.summary.passedTests}`, 'green');
  log(`❌ Failed: ${report.summary.failedTests}`, 'red');

  log('\n📋 DETAILED RESULTS:', 'bold');
  
  // Unit tests
  log('\n🔧 Server Unit Tests:');
  if (testResults.unit.success) {
    log('   ✅ PASSED', 'green');
  } else {
    log('   ❌ FAILED', 'red');
    log(`   Error: ${testResults.unit.output}`, 'red');
  }

  // Integration tests
  log('\n🔗 Server Integration Tests:');
  if (testResults.integration.success) {
    log('   ✅ PASSED', 'green');
  } else {
    log('   ❌ FAILED', 'red');
    log(`   Error: ${testResults.integration.output}`, 'red');
  }

  // Client unit tests
  log('\n⚛️  Client Unit Tests:');
  if (clientUnitTest.success) {
    log('   ✅ PASSED', 'green');
  } else {
    log('   ❌ FAILED', 'red');
    log(`   Error: ${clientUnitTest.output}`, 'red');
  }

  // E2E tests
  log('\n🌐 End-to-End Tests:');
  log('   ⚠️  MANUAL TESTING REQUIRED', 'yellow');
  log('   Start servers with: npm run dev', 'yellow');
  log('   Run E2E tests with: npm run test:e2e', 'yellow');

  log('\n' + '='.repeat(60), 'bold');
  
  if (report.summary.failedTests === 0) {
    log('🎉 ALL TESTS PASSED!', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED. Please review the errors above.', 'red');
  }

  log('='.repeat(60), 'bold');
}

// Generate and display report
const report = generateReport();
displayResults(report);

// Exit with appropriate code
process.exit(report.summary.failedTests > 0 ? 1 : 0); 