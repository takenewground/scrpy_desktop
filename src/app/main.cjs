
// https://www.electronjs.org/docs/api/command-line-switches#electron-cli-flags
    // --js-flags=\"--harmony-top-level-await\"
    // node --v8-options

global.require = require;
const electron = global.electron = require("electron");
// require("../../../@e-/electron-conf");
electron.app.whenReady().then(function(){
    console.log("ready");
    import("./app.mjs");
})

// WTF: ESM?! https://github.com/electron/electron/issues/21457
// Idea of runtime mode https://github.com/electron/electron/issues/673

