import { createClient, print } from "redis";


class RedisClient {
  constructor() {
    this.client = createClient();

    // Display any errors in the console
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
  }

  isAlive() {
    return new Promise((resolve) => {
      this.client.ping((err, reply) => {
        if (err) {
          resolve(false);
        } else {
          resolve(reply === 'PONG');
        }
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;

