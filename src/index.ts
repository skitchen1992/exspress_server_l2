import { SETTINGS } from './utils/settings';
import { app } from './app';
import { connectToDb } from './db';

const startApp = async () => {
  if (!(await connectToDb(SETTINGS.MONGO_DB_URL || ''))) {
    console.log('Not connected to data base');
    process.exit(1);
  }

  app.listen(SETTINGS.PORT, () => {
    console.log(`App listening on port ${SETTINGS.PORT}`);
  });
};

startApp();
