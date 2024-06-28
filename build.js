/* eslint-disable no-console */

import builder from 'electron-builder';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

builder.build({
    projectDir: path.resolve(__dirname),
    win: ['portable', 'nsis'],
    config: {
        appId: 'io.github.mark.pim',
        productName: 'PIM',
        copyright: 'Copyright © 2024 Mark Ma',
        directories: {
            output: 'dist/win',
        },
        win: {
            icon: path.resolve(__dirname, 'logo.png'),
        },
        files: [
            'dist/react/**/*',
            'node_modules/**/*',
            'package.json',
            'main.js',
            'preload.js',
        ],
        extends: null,
    },
}).then(
    (data) => console.log(data),
    (err) => console.error(err),
);
