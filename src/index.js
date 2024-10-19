const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes')
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3001


app.use(bodyParser.json())

routes(app);

app.get('/', (req, res)=>{
    res.send('Hello')
})

app.listen(port, ()=>{
    console.log('Server is running in port '+ port)
})