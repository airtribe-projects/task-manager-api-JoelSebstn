const express = require('express');
const app = express();
const port = 3000;
const router = require("./v1/tasks/tasks.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

if (require.main === module) {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
}



module.exports = app;