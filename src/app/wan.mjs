const fs = require('fs');
const fsa = fs.promises;
let sudo;
const sudo_options = {
    name: 'SCRPY PLZ',
    env: {
        NETWORK_ID: "83048a0632f3031e",
    }
    //icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class WAN {
    constructor() {
        this.sudo_cmd = ''
    }
    needs_install() {return true;}
    async install() {
        const that = this;
        sudo || (sudo = require('sudo-prompt'));
        return new Promise(function (res, rej) {
            sudo.exec(that.sudo_cmd, sudo_options,
                function(error, stdout, stderr) {
                    console.log('>>>')
                    console.log('stdout: ' + stdout);
                    console.warn('stderr: ' + stderr);
                    if (error) {
                        console.error(error)
                        rej(error);
                    }
                    else {
                        res()
                    }
                }
            );
        }).then(function () {
            return that.did_install()
        })

    }
    async did_install() {

    }
    async install_if_needed() {
        return (this.needs_install()) ? this.install() : false;
    }
}

export default create_wan_macos()

function create_wan_macos()
{
    const WAN_CLI = "/usr/local/bin/zerotier-cli"
    const WAN_DIR = `${dirname(__dirname)}/wan.mac`
    class WAN_MacOS extends WAN {
        constructor() {
            super();
            this.sudo_cmd = `cd "${WAN_DIR}" && ./install`
        }
        needs_install() {
            const needs = !fs.existsSync(`${WAN_CLI}`);
            // && !fs.existsSync("/....")
            console.log(`wan:needs_install ${needs}`)
            return needs;
        }
        did_install() {

        }
    }
    return new WAN_MacOS();
}