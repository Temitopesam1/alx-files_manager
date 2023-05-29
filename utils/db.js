import { MongoClient } from 'mongodb';



class DBClient {
    constructor(){

        const host = process.env.DB_HOST ||'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || "files_manager";

        this.url = `mongodb://${host}:${port}`;
        this.connected;
		    
		// Use connect method to connect to the server
        this.client = new MongoClient(url);
        this.client.connect(function(err, client) {
            if (err){
                this.connected = false;
            }
            client.db(database);
            this.connected = true;
          });

    }


    isAlive(){
        return this.connected;
    }

    async nbUsers(){
        this.userCollection = this.db.collection('users');
        return await this.userCollection.count();
    }

    async nbFiles(){
        this.fileCollection = this.db.collection('files');
        return await this.fileCollection.count();
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
