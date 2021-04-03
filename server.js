const express = require('express')
const API = require('./api');
const api = new API();
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/untick', (req, res) => {
    api.stop();
    res.send('Stopping')
})
  
app.get('/tick', (req, res) => {
    api.start();
    res.send('Starting')
})

app.get('/info', (req, res) => {
    res.json(api.state).send();
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})