
import tagger from './tagger.js';
import workerimpl from "./worker-impl.js"
import animimpl from "./animframe-impl.js"

export const Intervals = (() => {
    if (typeof window.Worker !== "undefined") {
        return workerimpl(tagger);
    } else {
        return animimpl(tagger);
    }
})()
