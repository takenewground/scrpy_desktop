



const APP_NS = "scrpy";
const APP_HOST = "172.29.117.46"
const APP_PORT = "3003"
const APP_URL = `http://${APP_HOST}:${APP_PORT}/`;
// "http://127.0.0.1:1080/"
// const assert = require("assert").strict;
let app = electron.app;
let Win = electron.BrowserWindow;
let screen;
let win_main;


// import ping from './ping.mjs'
// ping(APP_HOST)

setImmediate(main);

function main()
{
    Promise.all([
        wan_boot(),
        app.whenReady().then(function() {
            screen = electron.screen;
            listen()
            ui_init()
        }),
    ])
    .then(ui_load)
    .catch(function(err) {
        console.error(err)
        throw err
    })
}

function listen()
{
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
}

async function wan_boot()
{
    let ok = false;
    console.time("wan_boot");
    try {
        await import('./wan.mjs');
        await wan.boot();
        await wan.cli(`join ${NETWROK_ID}`);
        console.log(`wan joined ${NETWROK_ID}`)
        ok = true
    } catch (err) {
        console.error("ERR: wan_boot:",err)
    }
    console.timeEnd("wan_boot");
    return ok;
}


function ui_init()
{
    console.log("ui_init");
    const [w, h] = get_primary_display_size();
    const width = (w*7/9)|0;
    const height = (h*7/9)|0;
    const minWidth = (w*3/9)|0;
    const minHeight = (h*3/9)|0;

    // console.log({w,h,width, height, minWidth, minHeight})
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
    // (new Win(win_opts)).loadURL(`file://${__dirname}/../../scrpy/build/custom/public/design.html`);
    // console.log(win_main.getTrafficLightPosition())
}

function ui_load() {
    win_main.loadURL(APP_URL);
}


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
