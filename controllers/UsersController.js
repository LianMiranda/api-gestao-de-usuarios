const User = require("../models/user")
const bcrypt = require("bcrypt");
const { configDotenv } = require("dotenv");
const jwt = require("jsonwebtoken");
const pug = require('pug');
const path = require("path");
const validator = require('validator');
const tokenService = require("../services/tokenService");
const emailService = require("../services/emailService");
configDotenv()


class UserController{

    async create(req,res){
        const {firstName, lastName, email, password,birthday, profileImage, profileId} = req.body

        if(!email){
            res.status(400).json({message: "Verifique se o email foi preenchido corretamente"})
            return;
        }
        if(!firstName || !lastName){
            res.status(400).json({message: "Verifique se o nome foi preenchido corretamente"})
            return;
        }
        if(!password){
            res.status(400).json({message: "Verifique se a senha foi preenchido corretamente"})
            return;
        }

        try {
            var isEmailValid = await emailService.validateEmail(email)
            var userExists = await User.findEmail(email) 

            if(userExists){
                res.status(406).json({message: "Já existe um usuário com esse email"})
                return;
            }

            if(isEmailValid.status){
                await User.newUser(firstName, lastName, email, password,birthday, profileImage, profileId)
                res.status(200).json({message: "usuario criado"})
            }   
            
        } catch (error) {
            if (error.message === "Formato de e-mail inválido" || error.message === "O domínio do e-mail é inválido") {
                return res.status(400).json({ error: error.message });
            }
            console.log(error);
            return res.status(500).json({ error: "Erro interno ao criar usuário" });
        }
        
    }

    async findAll(req, res){
        var users = await User.findAll()
        if(!users){
            res.status(400).json({message: "Erro ao buscar usuarios"})
        }else{
            res.status(200).json(users)
        }
    }

    async findById(req, res){
        var id = req.params.id
        try {
            var user = await User.findById(id)
    
            if(user == undefined){
                res.status(404).json({message: "Usuário não encontrado."})
            }else{
                res.status(200).json(user)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Erro interno", error: err.message})
            
        }
    }

    async update(req, res){
        var id = req.params.id
        var {firstName, lastName, email, password,birthday, profileImage, profileId} = req.body

        try {
            var isEmailValid = await emailService.validateEmail(email)
            
            if(isEmailValid.status){
                var result = await User.update(id, firstName,lastName, email, password, birthday, profileImage, profileId);
              
                if(result){
                    if(result.status){
                        res.status(200).json({message: "Usuário atualizado"})
                    }else{
                        res.status(406).json(result);
                    }
                }else{
                    res.status(406).json({message: "Usuário não encontrado"});
                }    
            }   
        } catch (error) {
            if (error.message === "Formato de e-mail inválido" || error.message === "O domínio do e-mail é inválido") {
                return res.status(400).json({ message: error.message });
            }

            res.status(500).json({message: "Erro no servidor", error: error});
        }
    }

    async delete(req, res){
        var id = req.params.id;

        var result = await User.delete(id)

        if(result.status){
            res.status(200).json({message: `usuario com id ${id} excluido com sucesso`})
        }else{
            res.status(406).json({error: result.err})
        }
    }

    async login(req, res){
        var {email, password} = req.body

        var user = await User.findByEmail(email)

        if (user) {
            var result = await bcrypt.compare(password, user.password)
            if(result){
                var token = await tokenService.genToken(user, "2h");
                res.status(200).json({status: result, token: token})
            }else{
                res.status(406).json({message: "Senha invalida"})
            }
        } else {
            res.status(400).json({status: false})
        }
    }

    //TODO: RECUPERAÇÃO DE SENHA
     async sendEmailtoRecoverPassword(req, res){
         var email = req.body.email;

         if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ error: "Email inválido" });
         }

         var user = await User.findByEmail(email);

          try { 
              if (user) {
                  const compiledFunction = pug.compileFile('./templates/recoverPassword.pug');

                  var token = await tokenService.genToken(user, "15m")
                  
                  const html = compiledFunction({
                      name: user.name,
                      token: token 
                    });
                    
                var send = await emailService.sendRecoverPasswordEmail(email, html);

                if(send.status === 'success'){
                    res.status(200).json({message: send.message, response: send.response})
                }else if(send.status === 'failed'){
                    res.status(404).json({message: send.message, response: send.response})
                }

            }else{
                res.status(404).json({status: "failed", error: "Usuário não encontrado"})
            }
         } catch (error) {
            res.status(500).json({status: "failed", message: "Erro interno ao enviar o email", error: error})
        }
     }

    async changePassword(req, res){
        var password = req.body.password;
        var tokenRaw = req.headers['authorization']

        if(tokenRaw){
            try {
                const bearer = tokenRaw.split(' ')
                var token = bearer[1]

                var isTokenValid = jwt.verify(token, process.env.SECRET);
                
                if(isTokenValid){
                    var passwordRaw = password;
                    await User.updatePassword(isTokenValid.id, passwordRaw)

                    res.status(200).json({message: "Senha alterada com sucesso"})
                }else{
                    res.status(403).json({error: "token inválido"})
                }
            } catch (error) {
                console.log(error);
                res.status(403).json({message: "Token inválido", error: error})
            }
            
        }else{
            res.status(403).json({error: "token não encontrado"})
        }
    }
}

module.exports = new UserController()