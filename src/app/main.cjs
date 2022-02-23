


// https://www.electronjs.org/docs/api/command-line-switches#electron-cli-flags
    // --js-flags=\"--harmony-top-level-await\"
    // node --v8-options



global.require = require;
const electron = global.electron = require("electron");
// require("../../../@e-/electron-conf");

configure();
import("./app.mjs")

function configure() {
    // electron.app.commandLine.appendSwitch('js-flags', `--experimental-loader ${__dirname}/.node-https-loader.mjs`)
    // console.log(__dirname)
    // process.exit(0);
}





// WTF: ESM?! https://github.com/electron/electron/issues/21457
// Idea of runtime mode https://github.com/electron/electron/issues/673

