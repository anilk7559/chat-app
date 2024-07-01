const mongoose = require('mongoose');

const MONGOOSE_RECONNECT_MS = 1000;

async function reconnect() {
  try {
    mongoose.set('strictQuery', true); 
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error(err);
    console.info(`attempting to reconnect in (${MONGOOSE_RECONNECT_MS}) ms`);
    setTimeout(() => {
      reconnect();
    }, MONGOOSE_RECONNECT_MS);
  }
}

exports.core = async () => {
  mongoose.connection.on('connected', () => {
    if (['development'].indexOf(process.env.NODE_ENV) > -1) {
      console.info(`mongoose connection open to ${process.env.MONGO_URI}`);
    }
  });

  // if the connection throws an error
  mongoose.connection.on('error', console.error);

  // when the connection is disconnected
  mongoose.connection.on('disconnected', () => console.info('mongoose disconnected'));

  // connect to mongodb
  await reconnect();

  return mongoose;
};
