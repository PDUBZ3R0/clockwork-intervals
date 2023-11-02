{
    let intervals = {};
    self.onmessage = function ({ id, type, milliseconds }) {
        switch (type) {
            case "setTimeout":
                setTimeout(function(){ self.postMessage(id); }, milliseconds);
                break;
            case "setInterval":
                intervals[id] = setInterval(function (){ self.postMessage(id); }, milliseconds);
               break;
            case "clearInterval":
                clearInterval(intervals[id])
                break;
        }
    }
}