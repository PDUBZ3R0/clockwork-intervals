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

module.exports = tagger;