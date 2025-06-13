const cron = require('node-cron');
const { docClient } = require('../config/database');
const { ScanCommand, UpdateItemCommand } = require('@aws-sdk/lib-dynamodb');

const JOBS_TABLE = process.env.JOBS_TABLE || 'Jobs';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Running job cleanup task...');
  
  try {
    // Scan for active jobs that have expired
    const params = {
      TableName: JOBS_TABLE,
      FilterExpression: '#status = :active AND expiresOn < :now',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':active': 'active',
        ':now': new Date().toISOString()
      }
    };

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    if (result.Items && result.Items.length > 0) {
      console.log(`Found ${result.Items.length} expired jobs to update`);

      // Update each expired job
      const updatePromises = result.Items.map(job => {
        const updateParams = {
          TableName: JOBS_TABLE,
          Key: {
            category: job.category,
            jobId: job.jobId
          },
          UpdateExpression: 'SET #status = :expired',
          ExpressionAttributeNames: {
            '#status': 'status'
          },
          ExpressionAttributeValues: {
            ':expired': 'expired'
          }
        };

        return docClient.send(new UpdateItemCommand(updateParams));
      });

      await Promise.all(updatePromises);
      console.log(`✅ Updated ${result.Items.length} expired jobs`);
    } else {
      console.log('No expired jobs found');
    }

  } catch (error) {
    console.error('❌ Error in cleanup job:', error);
  }
});

console.log('📅 Job cleanup cron job scheduled');