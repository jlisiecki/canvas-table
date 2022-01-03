const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
    dataPortionRequest(startIndex, endIndex, columns) {
        return ipcRenderer.invoke(
            'dataPortionRequest',
            startIndex,
            endIndex,
            columns
        );
    },
    dataLengthRequest() {
        return ipcRenderer.invoke('dataLengthRequest');
    }
});
