const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { databaseConfig } = require('./serverConfig');

class DatabaseManager {
  constructor() {
    this.primaryClient = null;
    this.fallbackClient = null;
    this.currentClient = null;
    this.initializeClients();
  }

  initializeClients() {
    try {
      // Primary database client
      this.primaryClient = new DynamoDBClient(databaseConfig.primary);
      this.primaryDocClient = DynamoDBDocumentClient.from(this.primaryClient);
      
      // Fallback database client
      if (databaseConfig.fallback.credentials.accessKeyId) {
        this.fallbackClient = new DynamoDBClient(databaseConfig.fallback);
        this.fallbackDocClient = DynamoDBDocumentClient.from(this.fallbackClient);
      }
      
      this.currentClient = this.primaryDocClient;
      console.log('✅ Database clients initialized');
    } catch (error) {
      console.error('❌ Failed to initialize database clients:', error);
    }
  }

  async executeWithFallback(operation) {
    try {
      // Try primary database first
      return await this.currentClient.send(operation);
    } catch (error) {
      console.error('❌ Primary database error:', error.message);
      
      if (this.fallbackDocClient && this.currentClient === this.primaryDocClient) {
        console.log('🔄 Switching to fallback database...');
        this.currentClient = this.fallbackDocClient;
        
        try {
          return await this.currentClient.send(operation);
        } catch (fallbackError) {
          console.error('❌ Fallback database error:', fallbackError.message);
          throw new Error('Both primary and fallback databases are unavailable');
        }
      }
      
      throw error;
    }
  }

  async healthCheck() {
    try {
      const { ListTablesCommand } = require('@aws-sdk/client-dynamodb');
      await this.executeWithFallback(new ListTablesCommand({ Limit: 1 }));
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error.message);
      return false;
    }
  }

  getClient() {
    return {
      send: (command) => this.executeWithFallback(command)
    };
  }
}

const dbManager = new DatabaseManager();
const docClient = dbManager.getClient();

module.exports = { docClient, dbManager };