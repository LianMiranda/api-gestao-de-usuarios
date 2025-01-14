const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const router = require('./routes/routes');
const { configDotenv } = require('dotenv');
configDotenv()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use("/", router)

app.listen(process.env.API_PORT, () =>{
    console.log(`Rodando na porta ${process.env.API_PORT}`);
})