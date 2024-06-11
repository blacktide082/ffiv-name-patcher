const ff4 = Process.mainModule;
const mappings = {
    "ポーチカ": 　[0x92, 0x01, 0x7C, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x60, 0x00, 0x92, 0x01, 0x4A, 0x00],
    "セシル": 　　[0x92, 0x01, 0x5A, 0x00, 0x92, 0x01, 0x56, 0x00, 0x92, 0x01, 0x39, 0x20],
    "カイン": 　　[0x92, 0x01, 0x4A, 0x00, 0x92, 0x01, 0x43, 0x00, 0x92, 0x01, 0x1C, 0x20],
    "ローザ": 　　[0x92, 0x01, 0x8D, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x55, 0x00],
    "リディア": 　[0x92, 0x01, 0x60, 0x01, 0x92, 0x01, 0x66, 0x00, 0x92, 0x01, 0x42, 0x00, 0x92, 0x01, 0x41, 0x00],
    "テラ": 　　　[0x92, 0x01, 0x65, 0x00, 0x92, 0x01, 0x30, 0x20],
    "ポロム": 　　[0x92, 0x01, 0x7C, 0x00, 0x92, 0x01, 0x8D, 0x00, 0x92, 0x01, 0xAC, 0x20],
    "パロム": 　　[0x92, 0x01, 0x70, 0x00, 0x92, 0x01, 0x8D, 0x00, 0x92, 0x01, 0xAC, 0x20],
    "ギルバート": [0x92, 0x01, 0x4D, 0x00, 0x92, 0x01, 0x39, 0x20, 0x92, 0x01, 0x6F, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x67, 0x00],
    "ヤン": 　　　[0x92, 0x01, 0x1E, 0x20, 0x92, 0x01, 0x1C, 0x20],
    "シド": 　　　[0x92, 0x01, 0x56, 0x00, 0x92, 0x01, 0x68, 0x00],
    "エッジ": 　　[0x92, 0x01, 0x47, 0x00, 0x92, 0x01, 0x62, 0x00, 0x92, 0x01, 0x57, 0x00],
    "フースーヤ": [0x92, 0x01, 0x74, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x58, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x1E, 0x20],
    "ゴルベーザ": [0x92, 0x01, 0x53, 0x00, 0x92, 0x01, 0x39, 0x20, 0x92, 0x01, 0x78, 0x00, 0x81, 0x00, 0x5B, 0x00, 0x92, 0x01, 0x55, 0x00],
};

function main() {
    console.log("Installing hook...");
    const results = Memory.scanSync(ff4.base, ff4.size, '53 8B 5D 08 8B C3 2B C1');
    if (results.length === 0) {
        console.error("Could not install hook! Please file an issue.");
        return;
    }

    let count = 0;
    let timeout = 0;
    Interceptor.attach(results[0].address, function (args) {
        const bytes = read(this.context.ecx);
        for (const [key, value] of Object.entries(mappings)) {
            if (!match(bytes, value)) continue;

            this.context.ecx.writeUtf16String(key);
            count++;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log(`Successfully applied fix for ${count} name(s)!`);
                count = 0;
            }, 100);
            break;
        }
    });

    console.log("Hook successfully installed.");
    console.log("Waiting for names to be written to memory...");
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