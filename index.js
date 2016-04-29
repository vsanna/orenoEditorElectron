'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain; 

let mainWindow;
let settingsWindow;

let menuTemplate = [{
    label:'orenoEditor',
    submenu: [
        { label:'About', accelerator: 'CmdOrCtrl+Shift+A', click:function(){ showAboutDialog(); } } ,
        { type: 'separator' },
        { label:'Settings', accelerator: 'CmdOrCtrl+,', click:function(){ showSettingsWindow(); }},
        { type: 'separator' },
        { label:'Quit', accelerator: 'CmdOrCtrl+Q', click:function(){ app.quit(); }},
    ]
}];

let menu = Menu.buildFromTemplate(menuTemplate);

ipcMain.on('event_name', function(event, color){
    mainWindow.webContents.send('other_event_name', color);
 })

// 同期通信の場合はeventだけを引数に取る
ipcMain.on('event_name', function(event){
    event.returnValue = value; // 渡したい値
})

ipcMain.on('open-developer-tool', function(event){
    mainWindow.webContents.openDevTools(); // devtoolを明けておく
})
// OSのダイアログを表示する
function showAboutDialog(){
    dialog.showMessageBox({
        type: 'info',
        buttons: ['ok'],
        message: 'about',
        detail: 'this app is ...'
    })
}

function createMainWindow(){
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        width: 1000,  
        height: 800, 
        transparent: false, // default: false
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', ()=>{
        mainWindow = null;
    })
}

function showSettingsWindow(){
    settingsWindow = new BrowserWindow({width: 600, height:400});
    settingsWindow.loadURL('file://' + __dirname + '/settings.html');
    settingsWindow.on('closed', ()=>{
        settingsWindow = null;
    })
}

function showAboutWindow(){
    settingsWindow = new BrowserWindow({width: 600, height:400});
    settingsWindow.loadURL('file://' + __dirname + '/about.html');
    settingsWindow.on('closed', ()=>{
        settingsWindow = null;
    })
}
app.on('ready', ()=>{
    createMainWindow();    
});

app.on('window-all-closed', function(){
    if ( process.platform !== 'darwin' ){
        app.quit();
    }
});

app.on('activate', function(){
    if ( mainWindow == null ){
        createMainWindow();    
    }
})
