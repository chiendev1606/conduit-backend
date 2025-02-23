import { DatabaseModuleOptions } from 'libs/database/src/database.module';

export const constructDBUrl = (
  config: Omit<DatabaseModuleOptions, 'DB_URL'>,
) => {
  return `postgresql://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
};
