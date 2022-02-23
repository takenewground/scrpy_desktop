source ./env.sh


TGT=""

mkdir -p "$OUT_DIR"
mkdir -p "$CACHE_DIR"

clean() {
    rm -rf ${CACHE_DIR}
    rm -rf ${OUT_DIR}
}

mac_x64() {
    TGT="mac_x64"

    e_file="electron-v${ELECTRON_V}-darwin-x64"
    _mac
}

mac_arm64() {
    TGT="mac_arm64"
    e_file="electron-v${ELECTRON_V}-darwin-arm64"
    _mac
}

# win32_64...

_mac() {
    _dir="$PWD"
    e_dir="${CACHE_DIR}/${e_file}"
    if [[ ! -d "${e_dir}" ]] ; then
        cd ${CACHE_DIR}
        echo "downloading https://github.com/electron/electron/releases/download/v${ELECTRON_V}/${e_file}.zip"
        curl -L -o "${e_file}.zip" "https://github.com/electron/electron/releases/download/v${ELECTRON_V}/${e_file}.zip"
        mkdir "${e_file}"
        unzip "${e_file}.zip" -d "${e_file}" || rm -rf "${e_file}"
        rm -f "${e_file}.zip"
    fi
    cd "${_dir}"
    tgt_dir="${OUT_DIR}/${TGT}"
    app_dir="${tgt_dir}/${APP_NAME}.app"
    app_plist="${tgt_dir}/${APP_NAME}.app/Contents/Info.plist"
    # rm -rf "${tgt_dir}"
    echo "building ${TGT}..."
    mkdir -p "${tgt_dir}"
    if [[ ! -d "${app_dir}" ]] ; then
        gcp -r "${e_dir}/Electron.app" "${tgt_dir}"
        mv "${tgt_dir}/Electron.app" "${app_dir}"
        plutil -replace CFBundleDisplayName -string "${APP_NAME}" "${app_plist}"
        plutil -replace CFBundleName -string "${APP_NAME}" "${app_plist}"
        plutil -replace CFBundleIdentifier -string "com.tng.${APP_NAME}" "${app_plist}"
    fi

    rm -rf "${app_dir}/Contents/Resources/app"
    gcp -r "./src/app" "${app_dir}/Contents/Resources"
    # rm -rf "${app_dir}/Contents/Resources/default_app.asar"

    rm -rf "${app_dir}/Contents/Resources/wan.mac"
    gcp -r "./src/wan.mac" "${app_dir}/Contents/Resources"
}

mac() {
    mac_x64
    mac_arm64
}

$@