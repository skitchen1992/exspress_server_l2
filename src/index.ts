import { SETTINGS } from './utils/settings';
import { app } from './app';
import { connectToDb } from './db';

const url = SETTINGS.MONGO_DB_URL || 'mongodb://localhost:27017';

const startApp = async () => {
  if (!(await connectToDb(url))) {
    console.log('Not connected to data base');
    process.exit(1);
  }

  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`);
  });
};

startApp();
console.log();
