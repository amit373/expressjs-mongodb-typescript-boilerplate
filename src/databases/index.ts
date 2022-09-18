import mongoose from 'mongoose';
import { config } from '@app/config';

const {
  DB: { DB_HOST, DB_PORT, DB_DATABASE },
} = config;

const dbConnection: any = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

export function connectToDatabase(): Promise<any> {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbConnection.url, dbConnection.options);
    const database = mongoose.connection;
    database.on('error', err => {
      database['isConnected'] = false;
      reject(err);
    });
    database.on('open', () => {
      database['isConnected'] = true;
      resolve(database);
    });
  });
}

export function databaseStatus() {
  return {
    state: mongoose.connection.readyState === 1 ? 'up' : 'down',
    dbState: mongoose.STATES[mongoose.connection.readyState],
  };
}
