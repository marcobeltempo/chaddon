module.exports = function (app) {

    app.get("/", (req, res) => {
        res.sendFile("./server_status.html", {
            root: "./src/public/"
        });
    });
    
    app.use(function (req, res) {
        res.status(404).sendFile("404.html", {
            root: "./src/public/"
        });
    });
};