const { ipcMain } = require('electron');
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);

    Menu.setApplicationMenu(mainMenu);
});

function createWindow() {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: "Add New Todo",
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('addTodo', (event, todo) => {
    mainWindow.webContents.send('addTodo', todo);
    addWindow.close();
    console.log(todo);
})

const menuTemplate = [
    {
        label: 'File',
        submenu : [
            {
                label : 'New Todo',
                click(){
                    createWindow();
                }
            },
            {
                label : 'Quit',
                accelerator: process.platform === "darwin" ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform === "darwin"){
   menuTemplate.unshift({label: ''});
}

if(process.env.NODE_ENV !== 'production'){
    //production development staging test
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'Reload'
            },
            {
                label: 'Developer Tools',
                accelerator: process.platform === "darwin" ? 'Command+Option+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}


