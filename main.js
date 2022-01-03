const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const data = require('./sampleData');

app.disableHardwareAcceleration();

ipcMain.handle('dataLengthRequest', (event) => {
    return data.length;
});

ipcMain.handle('dataPortionRequest', (event, startIndex, endIndex, columns) => {
    const portion = [];
    for (let i = startIndex; i <= endIndex; i++) {
        const row = {};
        columns.forEach((column) => {
            if (data?.[i]?.[column.dataProperty] !== undefined) {
                row[column.dataProperty] = data[i][column.dataProperty];
            }
        });
        if (Object.keys(row).length > 0) portion.push(row);
    }
    return portion;
});

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    });

    mainWindow.loadFile('table-fill.html');
});

app.on('window-all-closed', () => app.quit());
