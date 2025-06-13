const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'jobquest-api',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

const publishToKafka = async (topic, message) => {
  try {
    await producer.connect();
    
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify(message),
        timestamp: Date.now().toString()
      }]
    });

    console.log(`Message published to topic: ${topic}`);
  } catch (error) {
    console.error('Error publishing to Kafka:', error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = {
  publishToKafka
};