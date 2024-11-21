const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(` Server is running on ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.post('/test',(req,res) => {
    const { data } = req.body;
    console.log(data);
    res.json("3")
})