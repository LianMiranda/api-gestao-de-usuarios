const bodyParser = require('body-parser');
const express = require('express');
const app = express()
const router = require('./routes/userRoutes');
const user = require('./database/user');
const profile = require('./database/profile');
const associations = require("./database/associations")
const connection = require('./database/connection');
 
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso");
}).catch(err =>{
     console.log("Erro ao conectar com banco de dados "+err);
})

app.use("/", router)

app.listen(process.env.API_PORT, () =>{
    console.log(`Rodando na porta ${process.env.API_PORT}`);
})