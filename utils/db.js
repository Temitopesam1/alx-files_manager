import { MongoClient } from 'mongodb';


const host = process.env.DB_HOST ||'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || "files_manager";


class DBClient {
    constructor(){
        const DBObj = async () =>{
		    const url = `mongodb://${host}:${port}`;
		    const client = new MongoClient(url);

		    // Use connect method to connect to the server
            await client.connect();
    	    console.log("Connected");
            return client;
        }
        this.client = DBObj();
	    
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
