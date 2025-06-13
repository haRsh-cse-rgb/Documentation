const { docClient } = require('../../../config/database');
const { PutItemCommand } = require('@aws-sdk/lib-dynamodb');
const { publishToKafka } = require('../../../services/kafka');

const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE || 'Subscriptions';

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email, categories } = req.body;

    // Store subscriptions in DynamoDB
    const subscriptionPromises = categories.map(category => {
      const params = {
        TableName: SUBSCRIPTIONS_TABLE,
        Item: {
          email,
          category,
          subscribedAt: new Date().toISOString()
        }
      };
      return docClient.send(new PutItemCommand(params));
    });

    await Promise.all(subscriptionPromises);

    // Publish to Kafka for async processing
    await publishToKafka('new-subscriptions', {
      email,
      categories,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      message: 'Successfully subscribed to newsletter',
      email,
      categories
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
};

module.exports = {
  subscribe
};