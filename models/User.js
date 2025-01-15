var knex = require("../database/connection");
var bcrypt = require('bcrypt')

class User{
    async newUser(name, email, password){
        try{
            var salt = bcrypt.genSaltSync(10)
            var passwordRaw = password;
            var passwordHash = await bcrypt.hash(passwordRaw, salt)

            await knex.insert({name, email, password: passwordHash, role: 0}).table("user")
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
            var users = await knex.select(["id","name",  "email", "role"]).table("user");      
            return users;
        } catch (error) {
            console.log(error);  
            return [];
        }

    }

    async findById(id){
        try {
            var user = await knex.select(["id","name",  "email", "role"]).table("user").where({id: id})

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

    async update(id, name, email, role){
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

            if(role){
                updateUser.role = role
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
}

module.exports = new User()