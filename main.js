import {
    app,
    BrowserWindow,
    globalShortcut,
    Menu,
} from 'electron';
import isDev from 'electron-is-dev';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/* eslint-disable import/extensions */
import './electron/app.js';

import { PimData } from './electron/data/PimData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'electron/preload.js'),
        },
    });
    Menu.setApplicationMenu(null);

    if (isDev) {
        mainWindow.loadURL('http://127.0.0.1:3000/');
    }
    else {
        mainWindow.loadFile(join(__dirname, 'dist/react/index.html'));
    }
    return mainWindow;
}

function registerShortcuts(window) {
    globalShortcut.register('F5', () => {
        window.reload();
    });
}

app.whenReady().then(() => {
    const window = createWindow();
    registerShortcuts(window);

    PimData.load();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    PimData.store();

    if (process.platform !== 'darwin') app.quit();
});
