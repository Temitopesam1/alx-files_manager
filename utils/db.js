import { MongoClient } from 'mongodb';

// const host = process.env.DB_HOST ||'localhost';
// const port = process.env.DB_PORT || 27017;
// const database = process.env.DB_DATABASE || "files_manager";

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.userCollection = undefined;
    this.fileCollection = undefined;

    async function connectClient(client) {
      // Use connect method to connect to the server
      await client.connect();
      console.log('Connected Successfully!');
    }

    connectClient(this.client)

      .then(this.db = this.client.db(this.database))
      .then(this.userCollection = this.db.collection('users'))
      .then(this.fileCollection = this.db.collection('files'))
      .catch(console.error);
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const number = await this.userCollection.countDocuments();
    return number;
  }

  async nbFiles() {
    const number = await this.fileCollection.countDocuments();
    return number;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
