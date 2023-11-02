const clockwork = {
    intervals: (() => {

        const tagger = (_ => {

    let intervals = 0;
    let tasks = {};

    return {
        id(task) {
            const id = `${intervals}:${btoa(task.toString().replace(/\s/g, "").substring(0, 24))}`;
            intervals++;
            return id;
        },

        save({task, repeats}) {
            const id = this.id(task);
            tasks[id] = {
                task,
                repeats
            };
            return id;
        },

        load(id) {
            return tasks[id];
        },

        remove(id) {
            tasks[id] = undefined;
        }
    }
})()




        function workerImpl(tagger) {
    const code = `{let e={};self.onmessage=function({id:s,type:t,milliseconds:a}){switch(t){case"setTimeout":setTimeout((function(){self.postMessage(s)}),a);break;case"setInterval":e[s]=setInterval((function(){self.postMessage(s)}),a);break;case"clearInterval":clearInterval(e[s])}}}`

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


        return workerImpl(tagger);

    })()
}


