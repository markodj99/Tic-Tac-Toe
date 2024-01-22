import { upUser } from "../models/user";
import { upSinglePlayerTTT } from "../models/singlePlayerTTT";

const runManualMigrations = async () => {
    try {
      await upUser();
      console.log('Migration of user table is done.');
    } catch (error) {
      console.error('Migration of user resulted in an error:', error);
    }

    try {
      await upSinglePlayerTTT();
      console.log('Migration of singleplayerTTT table is done.');
    } catch (error) {
      console.error('Migration of singleplayerTTT resulted in an error:', error);
    }
};

export default runManualMigrations;
