function workerImpl(tagger) {
    const code = "squish://worker.js"

    function createWorker() {
        const blob = new Blob([code], {type: 'application/javascript'})
        let _w = new Worker(URL.createObjectURL(blob));
        _w.addEventListener("message", function (e) {
            const {task, repeats} = tagger.load(e.id)
            if (!repeats) tagger.remove(e.id);
            task();
        });
        return _w;
    }

    let worker = createWorker();

    return {
        setInterval (task, milliseconds) {
            const id = tagger.save(task, true);
            worker.postMessage({id, type: "setInterval", milliseconds})
            return id;
        },
        setTimeout (task, milliseconds) {
            const id = tagger.save(task, false);
            worker.postMessage({id, type: "setTimeout", milliseconds})
            return id;
        },
        clearInterval(id) {
            worker.postMessage({id, type: "clearInterval"})
        },
        clearTimeout(id) {
            worker.postMessage({id, type: "clearInterval"})
        }
    }
}

module.exports = workerImpl