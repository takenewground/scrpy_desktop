const fs = require('fs');
const fsa = fs.promises;
const { execFile } = require('child_process');

let sudo;
const sudo_options = {
    name: 'SCRPY PLZ',
    env: {
        _ignore_me_: 'plz',
    }
    //icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NOOP = function () {};

class WAN {

    constructor() {
        this.cli_file = ''
        this.cli_opts = {env:{}}
        this.sudo_cmd = ''
        const that = this;
        this.is_ready = (new Promise(function(res,rej){
            that._is_ready_res = res;
            that._is_ready_rej = rej;
        })).finally(function() {
            that._is_ready_res = NOOP;
            that._is_ready_rej = NOOP;
        })
    }

    async boot() {
        try {
            await this.install_if_needed()
            this._is_ready_res(true)
        } catch (err) {
            this._is_ready_rej(err)
        }
    }

    // On Windows, some files cannot be executed on their own, like .bat or .cmd files. Those files cannot be executed with execFile and either exec or spawn with shell set to true is required to execute them.
    cli(cmd_str) {
        const that = this;
        return new Promise(function (res, rej) {
            execFile(
                that.cli_file,
                cmd_str.split(/[\s]+/),
                that.cli_opts,
                function (error, stdout, stderr){
                    if (error)
                        rej(error)
                    res(stdout)
                }
            )
        })
    }

    needs_install() {return true;}

    async install() {
        const that = this;
        sudo || (sudo = require('sudo-prompt'));
        return new Promise(function (res, rej) {
            sudo.exec(that.sudo_cmd, sudo_options,
                function(error, stdout, stderr) {
                    if (error) {
                        console.log('stdout: ' + stdout);
                        console.warn('stderr: ' + stderr);
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

    async install_if_needed() {
        return (this.needs_install()) ? this.install() : false;
    }

/*
    ZT_DIR="/Library/Application Support/ZeroTier/One"
    ZT_PORT=`cat "${ZT_DIR}/zerotier-one.port"`
    ZT_TOKEN=`cat "${ZT_DIR}/authtoken.secret"`
    ZT_URL=http://localhost:${ZT_PORT}
    curl -H "X-ZT1-Auth: ${ZT_TOKEN}" "${ZT_URL}/status"
*/
}

global.wan = create_wan_macos()

function create_wan_macos()
{
    const WAN_CLI = "/usr/local/bin/zerotier-cli"
    const WAN_DIR = `${dirname(__dirname)}/wan.mac`
    class WAN_MacOS extends WAN {
        constructor() {
            super();
            this.sudo_cmd = `cd "${WAN_DIR}" && ./install`
            this.cli_file = WAN_CLI;
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