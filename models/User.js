var knex = require("../database/connection");
var bcrypt = require('bcrypt');
const dns = require('dns');
const validator = require('validator');

class User{
    async newUser(name, email, password, profileId){
        try{
            var salt = bcrypt.genSaltSync(10)
            var passwordRaw = password;
            var passwordHash = await bcrypt.hash(passwordRaw, salt)

            await knex.insert({name, email, password: passwordHash, profileId: profileId}).table("user")
        }catch(err){
            console.log(err);
        }
    }

    async findEmail(email){ 
        try{
            var result =  await knex.select("*").from("user").where({email: email})

            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        }catch(err){
            console.log(err);  
            return false   
        }
    }

    async findAll(){
        try {
            var users = await knex.select(["id","name", "email", "profileId"]).table("user");      
            return users;
        } catch (error) {
            console.log(error);  
            return [];
        }
    }

    async findById(id){
        try {
            var user = await knex.select(["id","name",  "email", "profileId"]).table("user").where({id: id})

            if (user.length > 0) {
                return user[0];
            } else {
                return null;
            }

        } catch (error) {
            console.log(error);  
            return undefined;
        }
    }

    async findByEmail(email){
        try {
            var user = await knex.select(["id","name", "email", "password", "profileId"]).table("user").where({email: email})

            if (user.length > 0) {
                return user[0];
            } else {
                return null;
            }

        } catch (error) {
            console.log(error);  
            return undefined;
        }
    }

    async update(id, name, email, profileId){
        var user = await this.findById(id); 

        if(user){
            var updateUser = {}

            if(email){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if(!result){
                        updateUser.email = email;
                    }else{
                        return{status: false, err: "Email já existe!"}
                    }
                }
            }

            if(name){
                updateUser.name = name
            }

            if(profileId){
                updateUser.profileId = profileId
            }

            try {
                await knex.update(updateUser).where({id: id}).table("user");
                return {status:true}
            } catch (error) {
                console.log(error);
                return{status: false, err: error.message}

            }
        }
    }

    async delete(id){
        var user = await this.findById(id);

        if(user){
            try {
                await knex.delete().where({id:id}).table("user")
                return {status: true}
            } catch (error) {
                console.log(error);
            }
        }else{
            return{status: false, err: "Usuario não encontrado."}
        }
    }

    async updatePassword(id, password){
        var user = await this.findById(id)
        if(user){
            try {
                var salt = bcrypt.genSaltSync(10)
                var passwordRaw = password;
                var passwordHash = await bcrypt.hash(passwordRaw, salt)

                await knex.update({password: passwordHash}).where({id: id}).table("user")
                return {status: true}
            } catch (error) {
                console.log(error);
               return {status: false}
            }
        }else{
            return{status: false, err: "Usuario não encontrado."}
        }
    }

    async validateEmail(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Formato de e-mail inválido");
        }
      
        const domain = email.split("@")[1];
      
        const hasValidMx = await new Promise((resolve, reject) => {
          dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
              resolve(false); // Domínio inválido
            } else {
              resolve(true); // Domínio válido
            }
          });
        });
      
        if (!hasValidMx) {
          throw new Error("O domínio do e-mail não aceita mensagens");
        }
      
        return  {status: true}; // E-mail válido
      }
}

module.exports = new User()