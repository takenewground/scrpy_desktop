

## mac

How to Use launchd to Run Services in macOS
    https://medium.com/swlh/how-to-use-launchd-to-run-services-in-macos-b972ed1e352

https://developer.apple.com/documentation/security/authorization_services?language=objc


GenerateInfoPlist
    https://gist.github.com/andrius-k/b43d8b235b507dc17330b04e114e7583

install
bundle
/Library
    /Application Support
        /
    /LaunchDaemons
/Applications


## win

How to manually package an Electron app for Windows
    https://www.jviotti.com/2016/12/09/how-to-manually-package-an-electron-app-for-windows.html

Run MSI package from nodejs app
    https://stackoverflow.com/questions/35365332/run-msi-package-from-nodejs-app

## electron
https://github.com/electron/electron/blob/main/lib/browser/init.ts

    // Set application's version.
    if (packageJson.version != null) {
    app.setVersion(packageJson.version);
    }

    // Set application's name.
    if (packageJson.productName != null) {
    app.name = `${packageJson.productName}`.trim();
    } else if (packageJson.name != null) {
    app.name = `${packageJson.name}`.trim();
    }

    // Set application's desktop name.
    if (packageJson.desktopName != null) {
    app.setDesktopName(packageJson.desktopName);
    } else {
    app.setDesktopName(`${app.name}.desktop`);
    }

    // Set v8 flags, deliberately lazy load so that apps that do not use this
    // feature do not pay the price
    if (packageJson.v8Flags != null) {
    require('v8').setFlagsFromString(packageJson.v8Flags);
    }

    app.setAppPath(packagePath);

    ...
    // Set main startup script of the app.
    const mainStartupScript = packageJson.main || 'index.js';