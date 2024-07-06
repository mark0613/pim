import { ipcMain } from 'electron';

import { PimData } from './data/PimData.js';

ipcMain.handle('getData', () => PimData.getData() || {});

ipcMain.handle('setData', (_, data) => {
    try {
        PimData.setData(data);
        PimData.store();
    }
    catch (e) {
        console.error(e);
        return false;
    }
    return true;
});
