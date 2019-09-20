// #region Prep

const fs = require('fs')

const read_whole = (file, ignore_missing = false) => {
    try {
        return fs.readFileSync(file).toString()
    } catch (ex) {
        if (ignore_missing) {
            return ''
        } else {
            throw ex
        }
    }
}

// #endregion

// #region Command line args

const argv = require('yargs')
    .option('b', {
        alias: 'keyboard',
        demandOption: true,
        describe: 'the keyboard to build',
        type: 'string'
    })
    .option('m', {
        alias: 'keymap',
        demandOption: true,
        describe: 'the user-specific keymap to load',
        type: 'string'
    })
    .option('c', {
        alias: 'config',
        default: 'default',
        describe: 'the overall firmware config to use',
        type: 'string'
    })
    .option('o', {
        alias: 'output',
        default: 'firmware.ino',
        describe: 'where to generate the output',
        type: 'string'
    })
    .argv

// #endregion

// #region Generating main firmware file

;(async () => {

    let fw = ''

    // load settings

    fw += '//=== User-specific settings ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/keymaps/${keymap}/settings.cpp.tpl`, true)

    fw += '\n\n//=== Keyboard-specific settings ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/settings.cpp.tpl`, true)

    fw += '\n\n//=== Config settings ===\n\n'
    fw += read_whole(`src/config/${config}/settings.cpp.tpl`, true)
    if (config != 'default') {
        fw += read_whole(`src/config/default/settings.cpp.tpl`)
    }


    // load variables

    fw += '\n\n//=== Config variables ===\n\n'
    fw += read_whole(`src/config/${config}/vars.cpp.tpl`)

    fw += '\n\n//=== Keyboard-specific variables ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/vars.cpp.tpl`)

    fw += '\n\n//=== User-specific variables ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/keymaps/${keymap}/vars.cpp.tpl`)


    // load setup

    fw += '\n\nABSOLEM_SETUP_BEGIN\n\n'

    fw += '\n\n//=== Config setup ===\n\n'
    fw += read_whole(`src/config/${config}/setup.cpp.tpl`)

    fw += '\n\n//=== Keyboard-specific setup ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/setup.cpp.tpl`)

    fw += '\n\n//=== User-specific setup ===\n\n'
    fw += read_whole(`src/keyboards/${keyboard}/keymaps/${keymap}/setup.cpp.tpl`)

    const keymapper = require('./keymapper')
    fw += await keymapper.parse(`src/keyboards/${keyboard}/keymaps/${keymap}/keymap.kmp`)

    fw += '\n\nABSOLEM_SETUP_END\n\n'


    // load loop

    fw += '\n\nABSOLEM_LOOP_BEGIN\n\n'
    fw += read_whole(`src/config/${config}/loop.cpp.tpl`)
    fw += '\n\nABSOLEM_LOOP_END\n\n'

})()

// #endregion
