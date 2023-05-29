import { MongoClient } from 'mongodb';



class DBClient {


    constructor(){

        const host = process.env.DB_HOST ||'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || "files_manager";

        this.url = `mongodb://${host}:${port}`;
		    
	// Use connect method to connect to the server
        this.client = new MongoClient(this.url, { useUnifiedTopology: true });
        this.client.connect(function(err, client) {
		client.db(database);
          });
	this.db = this.client.db(database);

    }


    isAlive(){
        return "None";
    }

    async nbUsers(){
        this.userCollection = this.db.collection('users');
        return await this.userCollection.countDocuments();
    }

    async nbFiles(){
        this.fileCollection = this.db.collection('files');
        return await this.fileCollection.countDocuments();
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
