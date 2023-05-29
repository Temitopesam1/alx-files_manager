import { MongoClient } from 'mongodb';



class DBClient {


    constructor(){

        const host = process.env.DB_HOST ||'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || "files_manager";

        this.url = `mongodb://${host}:${port}`;
		    
	// Use connect method to connect to the server
        this.client = new MongoClient(this.url, { useUnifiedTopology: true });
        this.client.connect()
	    this.db = this.client.db(database);
        this.userCollection = this.db.collection('users');
        this.fileCollection = this.db.collection('files');
    }


    isAlive(){
        return this.client.isConnected();
    }

    async nbUsers(){
        return await this.userCollection.countDocuments();
    }

    async nbFiles(){
        return await this.fileCollection.countDocuments();
    }
    user = this.userCollection;
}

const dbClient = new DBClient();
module.exports = dbClient;
