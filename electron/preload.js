const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    ['chrome', 'node', 'electron'].forEach((type) => {
        replaceText(`${type}-version`, process.versions[type]);
    });
});

contextBridge.exposeInMainWorld('api', {
    getData: () => ipcRenderer.invoke('getData'),
    setData: (data) => ipcRenderer.invoke('setData', data),
});
