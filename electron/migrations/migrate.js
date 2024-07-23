import { migrate0001 } from './0001.js';
import { migrate0002 } from './0002.js';

export const migrate = (data) => {
    const migrations = [
        migrate0001,
        migrate0002,
    ];

    return migrations.reduce((acc, migration) => migration(acc), data);
};
