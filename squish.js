#!/usr/local/bin/node
const path = require("path");
const fs = require("fs");
const {minify} = require("terser");
const {program} = require("commander")

let minify_active = true

mini = function (input) {
    return new Promise(resolve => {
        if (!minify_active) {
            resolve (input)
        } else {
            minify(input).then(result => resolve(result.code));
        }
    });
};

program.option("--minify [enabled]", "minify results", true);
program.argument("<input>")
program.argument("<output>")
program.action((input, output, options)=> {
    console.log(`Input file: ${input}`)
    let mainfile = fs.readFileSync(path.resolve(input), "utf-8");
    minify_active = options.minify;

    (async()=> {
        let final = await squish(input, mainfile);
        console.log(`Writing output to: ${output}`);
        fs.writeFileSync(output, final);
    })()
})

program.parse();

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

                let output = (type === "worker") ? "`" + await mini(content) + "`" : content
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
            let changed = await assimilate(name,source, "require", /(let|const) .* = require\(.(.*).\);?/);
         //   console.log("squish require:", changed ? changed.length : 0)
            changed = await assimilate(name,changed, "worker", /"(squish:)\/\/(.*\.js)"/);
         //   console.log("squish worker:", changed ? changed.length : 0)
            let final = await mini(changed);
            resolve(final);
        })()
    })
}
