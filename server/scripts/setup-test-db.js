const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function setupTestDB() {
  let mongoServer;
  
  try {
    console.log('Setting up test database...');
    
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to test database
    await mongoose.connect(mongoUri);
    
    console.log('Test database setup complete!');
    console.log('MongoDB URI:', mongoUri);
    
    // Create some sample data for testing
    const Task = require('../src/models/Task');
    
    const sampleTasks = [
      {
        title: 'Complete Project Documentation',
        description: 'Write comprehensive documentation for the MERN stack project',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        title: 'Implement User Authentication',
        description: 'Add JWT-based authentication system',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        title: 'Write Unit Tests',
        description: 'Create comprehensive unit tests for all components',
        status: 'completed',
        priority: 'medium',
        completedAt: new Date()
      },
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated testing and deployment',
        status: 'pending',
        priority: 'low'
      }
    ];
    
    await Task.insertMany(sampleTasks);
    console.log('Sample data created successfully!');
    
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
    }
  }
}

if (require.main === module) {
  setupTestDB();
}

module.exports = setupTestDB; 