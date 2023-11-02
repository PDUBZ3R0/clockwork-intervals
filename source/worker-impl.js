function workerImpl(tagger) {
    const code = "squish://worker.js"
    let worker = createWorker(code);

    function createWorker(code) {
        const blob = new Blob([code], {type: 'application/javascript'})
        worker = new Worker(URL.createObjectURL(blob));
        worker.addEventListener("message", function (e) {
            const {task, repeats} = tagger.load(e.id)
            if (!repeats) tagger.remove(e.id);
            task();
        });
        return worker;
    }

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