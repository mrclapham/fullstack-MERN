import mongoose from 'mongoose';

export const initDb = () => {
  console.log("process.env.MONGODB_URI ===  ", process.env )

/*
The following come form the docker-compose.yml file (either dev or prod)
      process.env.MONGO_URI 
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
*/

  mongoose
    .connect(process.env.MONGO_URI  || "", {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS
    })
    .then(() => {
      console.log('Mongodb connected....');
      
    })
    .catch(err => console.log(err.message));

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  mongoose.connection.on('error', err => {
    console.log(`ERROR::::::: ${err.message}`);
  });

  mongoose.connection.on('disconnected', (e) => {
    console.log('Mongoose connection is disconnected...',e);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close()
    .then(() => {
        console.log(
          'Mongoose connection is disconnected due to app termination...'
        );
        process.exit(0);
      });
  });
};