const input = process.argv[2]
const output = process.argv[3]
const path = require("path");
const fs = require("fs");
const {minify} = require("terser");

function assimilate(name, code, type, matcher) {
    return new Promise(resolve => {
        (async () => {
            let check = code.match(matcher);
   //         console.log("assimilate", name, type, matcher, check && check.length > 1);
            if (check) {
                let file = path.join("source", check[2]+(type === "require" ? ".js":""));
        //        console.log(file, fs.existsSync(file));
                let raw = fs.readFileSync(file, "utf-8");
                let content = await squish(file, raw);
                if (type === "require") content = content.replace(/module\.exports.*$/, '')

                let output = (type === "worker") ? "`" + await minify(content).code + "`" : content
          //      console.log(check[0], output);
                let recode = code.replace(check[0], output);
                let recurse = await assimilate(name, recode, type, matcher)
                resolve(recurse);
            } else {
                resolve(code)
            }
        })()
    })
}

function squish(name,source) {
    return new Promise(resolve => {
        (async () => {
            let changed = await assimilate(name,source, "require", /(let|const) .* = require\(.(.*).\)/);
         //   console.log("squish require:", changed ? changed.length : 0)
            changed = await assimilate(name,changed, "worker", /"(squish:)\/\/(.*\.js)"/);
         //   console.log("squish worker:", changed ? changed.length : 0)
            resolve(changed);
        })()
    })
}

let mainfile = fs.readFileSync(path.resolve(input), "utf-8")
squish(input,mainfile).then(final => {
        minify(final).then(write =>{
        console.log(write.code)
        fs.writeFileSync(output, write.code);
    })
});