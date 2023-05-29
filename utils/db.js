import { MongoClient } from 'mongodb';


const host = process.env.DB_HOST ||'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || "files_manager";


class DBClient {
    constructor(){

        // this.host = process.env.DB_HOST ||'localhost';
        // this.port = process.env.DB_PORT || 27017;
        // this.database = process.env.DB_DATABASE || "files_manager";

        this.url = `mongodb://${host}:${port}`;
        this.connected = false;

        async function connectClient(url) {
		    
		    // Use connect method to connect to the server
            const client = new MongoClient(url);
            await client.connect();
            if (this.client.isConnected()){
                this.connected = true;
                return client;
            }
        }

        this.client = connectClient(this.url)
	    
        this.db = this.client.db(database);
		this.userCollection = this.db.collection('users');
        this.fileCollection = this.db.collection('files');

    }


    isAlive(){
        return this.connected;
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
