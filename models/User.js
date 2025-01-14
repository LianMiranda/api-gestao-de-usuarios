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
}

module.exports = new User()