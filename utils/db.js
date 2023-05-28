import { MongoClient } from 'mongodb';


// const host = process.env.DB_HOST ||'localhost';
// const port = process.env.DB_PORT || 27017;
// const database = process.env.DB_DATABASE || "files_manager";


class DBClient {
    constructor(){

        this.host = process.env.DB_HOST ||'localhost';
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || "files_manager";

        this.url = `mongodb://${host}:${port}`;
        // this.client = new MongoClient(url);

        async function connectClient(url) {
		    
		    // Use connect method to connect to the server
            const client = new MongoClient(url);
            await client.connect();
    	    console.log("Connected");
            return client;
        }

        this.client = connectClient(this.url)

	    
        this.db = this.client.db(database);
		this.userCollection = this.db.collection('users');
        this.fileCollection = this.db.collection('files');

    }


    isAlive(){
        return this.client.isConnected();
    }

    async nbUsers(){
        return await this.userCollection.count();
    }

    async nbFiles(){
        return await this.fileCollection.count();
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
