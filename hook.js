const ff4 = Process.mainModule;
const patterns = {
    "ポーチカ": 　"92 01 7c 00 81 00 5b 00 92 01 60 00 92 01 4a 00",
    "セシル": 　　"92 01 5a 00 92 01 56 00 92 01 39 20",
    "カイン": 　　"92 01 4a 00 92 01 43 00 92 01 1c 20",
    "ローザ": 　　"92 01 8d 00 81 00 5b 00 92 01 55 00",
    "リディア": 　"92 01 60 01 92 01 66 00 92 01 42 00 92 01 41 00",
    "テラ": 　　　"92 01 65 00 92 01 30 20",
    "ポロム": 　　"92 01 7c 00 92 01 8d 00 92 01 ac 20",
    "パロム": 　　"92 01 70 00 92 01 8d 00 92 01 ac 20",
    "ギルバート": "92 01 4d 00 92 01 39 20 92 01 6f 00 81 00 5b 00 92 01 67 00",
    "ヤン": 　　　"92 01 1e 20 92 01 1c 20",
    "シド": 　　　"92 01 56 00 92 01 68 00",
    "エッジ": 　　"92 01 47 00 92 01 62 00 92 01 57 00",
    "フースーヤ": "92 01 74 00 81 00 5b 00 92 01 58 00 81 00 5b 00 92 01 1e 20",
    "ゴルベーザ": "92 01 53 00 92 01 39 20 92 01 78 00 81 00 5b 00 92 01 55 00",
};

function main() {
    console.log("Installing hook...");
    const results = Memory.scanSync(ff4.base, ff4.size, '6A 00 6A 00 FF D3');
    if (results.length === 0) {
        console.error("Could not install hooks! Please file an issue.");
        return;
    }

    for (const result of results) {
        Interceptor.attach(result.address.add(0x4), function (args) {
            this.context.esp.writeU32(0x000003A4);
        });
    }
    console.log("Hooks successfully installed.");

    console.log("Finding names in memory...");
    let names = [];
    for (const [name, pattern] of Object.entries(patterns)) {
        const results = Memory.scanSync(ff4.base, ff4.size, pattern);
        for (const result of results) {
            result.address.writeUtf16String(name);
            names.push(name);
        }
    }
    const count = names.filter((value, index, array) => array.indexOf(value) === index).length;
    console.log(`Applied fix for ${count} name${count > 1 ? 's' : ''}!`);

    console.log("Waiting for names to be written to memory... please leave the process running.");
}

function success(names) {
    if (names.length === 0) {
        return;
    }

    names.length = 0;
}

function read(address) {
    const bytes = [];
    let byte = null;
    while ((byte = address.readU16()) != 0x0) {
        bytes.push(byte & 0xFF);
        bytes.push(byte >> 0x8);
        address = address.add(2);
    }
    return bytes;
}

function match(bytes, value) {
    if (bytes.length < value.length) {
        return false;
    }
    for (let i = 0; i < value.length; i++) {
        if (bytes[i] !== value[i]) {
            return false;
        }
    }
    return true;
}

main();