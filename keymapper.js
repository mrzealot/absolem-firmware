const readline = require('readline')
const read_lines = file => {
    return readline.createInterface({
        input: fs.createReadStream(file)
    })
}


const modifier = mod => {
    const mods = {
        C: 'MOD_LC',
        S: 'MOD_LS',
        A: 'MOD_LA',
        G: 'MOD_LG',
        c: 'MOD_RC',
        s: 'MOD_RS',
        a: 'MOD_RA',
        g: 'MOD_RG',
    }
    let arr = []
    for (const char of mod) {
        arr.push(mods[char])
    }
    return `(${arr.join('|')})`
}

const letter = (string) => {
    if (string.length > 1) {
        if (string.includes('+')) {
            const [mod, key] = string.split('+')
            return `(${modifier(mod)}|string2code["${key}"].first), string2code["${key}"].second` 
        } else {
            throw new Error(`Bad letter <${string}>`)
        }
    } else {
        return `string2code["${string}"].first, string2code["${string}"].second`
    }
}

const rule = (index, string) => {
    if (string == '??' || string == '__') {
        return
    }
    if (string.includes('(')) {
        const parts = string.split('(')
        const fn = parts[0]
        const args = parts[1]
            .replace(')', '')
            .split(',')
            .filter(e => !!e)
        // if (fn == '') TODO
    } else {
        return `interpreter.addRule(${index}, kc(${letter(string)}));\n`
    }
}

const parse = async file => {

    let result = ''

    let mode = ''
    let map = []
    let arr = []

    const process = () => {
        if (mode == 'map') {
            map = arr.map(n => parseInt(n))
        } else {
            let i = 0
            const layer = parseInt(mode)
            for (const item of arr) {
                i++
                const index = layer + (map[i] || i)
                result += rule(index, item)
            }
        }
    }

    for await (const line of read_lines(file)) {
        if (line.includes(':::')) {
            process()
            mode = line.replace(':::', '').trim().toLocaleLowerCase()
        } else {
            arr = arr.concat(line.split(/\s+/g).filter(e => !!e))
        }
    }

    return result
}

module.exports = parse