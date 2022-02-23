

const APP_NET_ID = "83048a0632f3031e";
const APP_HOST = "172.29.117.46"
const APP_PORT = "3003"
const APP_NS = "scrpy";
const APP_URL = `http://${APP_HOST}:${APP_PORT}/`;
// "http://127.0.0.1:1080/"
// const assert = require("assert").strict;
const app = electron.app;
const Win = electron.BrowserWindow;
const e_net = electron.net;

const IS_MAC = process.platform === 'darwin'
const IS_LINUX = process.platform === 'linux'
const IS_WINDOWS = !IS_MAC && !IS_LINUX

const APP_FILE_NAME = IS_MAC ? "SCRPY.app" : "SCRPY"

let screen;
let main_window;
let main_view;


// const req = e_net.request('https://takenewground.github.io/scrpy_desktop/src/app/wan.mjs');
// req.on("response",function(res){
//     res.on("data", function(chunk){console.log(chunk.toString())})
// })
// req.end()

// import ping from './ping.mjs'
// ping(APP_HOST)

setImmediate(main);


const single_lock = app.requestSingleInstanceLock()
if (!single_lock) {
  app.quit()
}

function main()
{
    Promise.all([
        wan_boot(),
        app.whenReady().then(function() {
            move_if_needed();
            screen = electron.screen;
            listen()
            ui_init()
            ui_preload()
        }),
    ])
    .then(ui_load)
    .catch(function(err) {
        console.error(err)
        throw err
    })
}

function move_if_needed() {
    // TODO:
    if (IS_MAC && !electron.app.isInApplicationsFolder()) {
        app.focus({steal:true});
        electron.dialog.showMessageBoxSync({
            type: 'question',
            message: `${APP_FILE_NAME} will be moved to the Applications folder & relaunch`,
            buttons: ['Continue'],
            defaultId: 0,
        })
        electron.app.moveToApplicationsFolder({
            conflictHandler: (conflictType) => {
                if (conflictType === 'exists') {
                    return true
                }
            }
        })
    }
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
        // await import('./wan.mjs');
        await import('./wan.mjs')
        await wan.boot();
        await wan.cli(`join ${APP_NET_ID}`);
        console.log(`wan joined ${APP_NET_ID}`)
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
    const webPreferences = {
        contextIsolation:false,
        webSecurity:false,
        allowRunningInsecureContent:true,
        experimentalFeatures:true,
        nodeIntegration:false,
        nodeIntegrationInWorker:false,
        nodeIntegrationInSubFrames:false,
        sandbox:false,
        partition:`persist:${APP_NS}`
    };
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
        webPreferences,
    }
    main_window = new Win(win_opts);
    // (new Win(win_opts)).loadURL(`file://${__dirname}/../../scrpy/build/custom/public/design.html`);
    // console.log(main_window.getTrafficLightPosition())
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
        // Print out data received from the second instance.
        // console.log(additionalData)
        // Someone tried to run a second instance, we should focus our window.
        if (main_window) {
          if (main_window.isMinimized())
            main_window.restore()
          main_window.focus()
        }
    })
}
function ui_preload() {
    main_window.loadURL(APP_URL);
}
function ui_load() {
    main_window.loadURL(APP_URL);
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
