const clockwork = {
    intervals: (() => {

        const tagger = require(`./tagger`)


        const workerImpl = require("./worker-impl");
        return workerImpl(tagger);

    })()
}


