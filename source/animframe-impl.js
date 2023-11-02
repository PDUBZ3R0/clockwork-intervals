function animframeImpl(tagger) {
    let running = false;
    let processing = false;
    let tasks = {};
    let concurrency = 0;

    function processTimers(count) {
        if (!processing) {
            processing = true
            for (let tdx in tasks) {
                if (tasks[tdx].execute <= count) {
                    const runme = tasks[tdx].task;
                    if (tasks[tdx].repeat) {
                        tasks[tdx].execute += tasks[tdx].repeat
                    } else {
                        tasks[tdx] = undefined;
                        concurrency--;
                        running = concurrency > 0;
                    }
                    runme();
                }
            }
            processing = false;
        }
    }

    function start() {
        while (running) {
            requestAnimationFrame(processTimers)
        }
    }

    function setup(task, milliseconds, repeat) {
        let id = tagger.id(task);
        let started = new Date().getTime();
        tasks[id]({
            execute: started + milliseconds,
            repeat: (repeat ? milliseconds : undefined),
            task
        });
        concurrency++
        running = true;
        start();
    }

    function clear(id) {
        if (!processing) {
            processing = true
            tasks[id] = undefined;
            concurrency--;
            running = concurrency > 0;
            processing = false;
        }
    }

    return {
        setTimeout(task, milliseconds) {
            return setup(task, milliseconds, false);
        },
        setInterval(task, milliseconds) {
            return setup(task, milliseconds, true);
        },
        clearTimeout: clear,
        clearInterval: clear
    }
}

module.exports = animframeImpl