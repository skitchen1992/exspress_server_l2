import { SETTINGS } from './utils/settings';
import { app } from './app';

app.listen(SETTINGS.PORT, () => {
  console.log(`App listening on port ${SETTINGS.PORT}`);
});
