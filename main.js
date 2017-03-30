const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { dialog, ipcMain } = require('electron');

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 600, height: 600});

  mainWindow.loadURL(url.format({
    protocol: 'file:',
    pathname: path.resolve(__dirname, 'index.html'),
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('del-confirmation', (event, todo) => {
  let isDelete = dialog.showMessageBox({
    type: 'none',
    buttons: ['취소', '삭제'],
    title: '삭제 확인!',
    message: `정말 ${todo.title} 을 지울거에요??`
  });
  if (isDelete === 1) {
    event.sender.send('del-confirmation', todo);
  }
});
