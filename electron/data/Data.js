import fs from 'fs';
import os from 'os';
import path from 'path';

export class DataManager {
    static data = null;

    static checkFilename() {
        if (!this.filename) {
            throw new Error('Filename not specified.');
        }
    }

    static getFilePath() {
        this.checkFilename();
        const userFolder = os.homedir();
        const pimFolder = path.join(userFolder, 'pim');

        if (!fs.existsSync(pimFolder)) {
            fs.mkdirSync(pimFolder, { recursive: true });
        }

        return path.join(pimFolder, `${this.filename}.json`);
    }

    static load() {
        this.checkFilename();
        if (this.data === null) {
            const filePath = this.getFilePath();

            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8');
                this.data = JSON.parse(rawData);
            }
            else {
                this.data = {};
            }
        }
        return this.data;
    }

    static store() {
        this.checkFilename();
        const filePath = this.getFilePath();

        const dataToStore = JSON.stringify(this.data, null, 2);
        fs.writeFileSync(filePath, dataToStore, 'utf8');
    }

    static getData() {
        this.checkFilename();
        return this.data;
    }

    static setData(newData) {
        this.checkFilename();
        this.data = newData;
    }
}
