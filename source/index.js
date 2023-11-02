
    const clockwork = {
        intervals: (() => {

            const tagger = require(`./tagger`)

            //if (typeof Worker !== "undefined") {
                const workerImpl = require("./worker-impl");
                return workerImpl(tagger);
          /*  } else {
                const animframeImpl = require("./animframe-impl");
                return animframeImpl(tagger);
            }*/
        })()
        }


