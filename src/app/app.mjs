



const APP_NS = "scrpy";
const APP_HOST = "172.29.117.46"
const APP_PORT = "3003"
const APP_URL = `http://${APP_HOST}:${APP_PORT}/`;
// "http://127.0.0.1:1080/"
// const assert = require("assert").strict;
const app = electron.app;
const Win = electron.BrowserWindow;
const screen = electron.screen;
let win_main;

import wan from './wan.mjs'
import ping from './ping.mjs'

try {
console.log('wan.install_if_needed',wan.install_if_needed())
}
catch(err) {
    console.error(err)
}

ping(APP_HOST)

setImmediate(main);

async function main()
{
    ui_init();
}



function ui_init()
{
    const [w, h] = get_primary_display_size();
    const width = (w*7/9)|0;
    const height = (h*7/9)|0;
    const minWidth = (w*3/9)|0;
    const minHeight = (h*3/9)|0;

    console.log({w,h,width, height, minWidth, minHeight})
    const win_opts = {
        width, height, minWidth, minHeight,
        hasShadow: true,
        frame: false,
        transparent: true,
        backgroundColor: "#00000000",
        // https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows
        titleBarStyle: 'hidden',
        trafficLightPosition: { x: 10, y: 10 },
        vibrancy: "sidebar",
        webPreferences: {
            contextIsolation:false,
            webSecurity:false,
            allowRunningInsecureContent:true,
            experimentalFeatures:true,
            nodeIntegration:false,
            nodeIntegrationInWorker:false,
            nodeIntegrationInSubFrames:false,
            sandbox:false,
            partition:`persist:${APP_NS}`
        }
    }
    win_main = new Win(win_opts)
    win_main.loadURL(APP_URL);

    // (new Win(win_opts)).loadURL(`file://${__dirname}/../../scrpy/build/custom/public/design.html`);

    // console.log(win_main.getTrafficLightPosition())

}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    console.log("certificate-error",url);
    if (url.includes("://0.0.0.0") || url.includes("://127.0.0.1")) {
        // url === "https://0.0.0.0:8443/") {
        // Verification logic.
        event.preventDefault()
        callback(true)
    } else {
        callback(false)
    }
})

// app.allowRendererProcessReuse = true;
// app.userAgentFallback

// https://www.electronjs.org/docs/api/app#appgetgpuinfoinfotype

// macos
// app.setActivationPolicy('accessory') // 'regular'

// https://www.electronjs.org/docs/api/app#appsetasdefaultprotocolclientprotocol-path-args

function get_primary_display_size()
{
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    return [width, height]
}
