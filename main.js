const { app, BrowserWindow } = require('electron');

app.disableHardwareAcceleration();

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.webContents.setFrameRate(5);
    mainWindow.loadFile('index.html');
});

app.on('window-all-closed', () => app.quit());
