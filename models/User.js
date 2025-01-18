var knex = require("../database/connection");
var bcrypt = require('bcrypt');
const userModel = require("../database/user");
const emailService = require("../services/emailService");

class User{
    async newUser(firstName, lastName, email, password,birthday, profileImage, profileId){
        try{
            var salt = bcrypt.genSaltSync(10)
            var passwordRaw = password;
            var passwordHash = await bcrypt.hash(passwordRaw, salt)

            await userModel.create({
                firstName,
                lastName,
                email,
                password: passwordHash,
                birthday,
                profileImage,
                profileId,
                //status: false,
            })
        }catch(err){
            console.log(err);
        }
    }

     async findEmail(email){ 
         try{
             var result =  await userModel.findOne({where: {email}})
             if(result){
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
             var users = await userModel.findAll()     
             return users;
         } catch (error) {
             console.log(error);  
             return [];
         }
     }

     async findById(id){
         try {
             var user = await userModel.findByPk(id)

             if (user) {
                 return user;
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
             var user = userModel.findOne({where:{email: email}})

             if (user) {
                 return user;
             } else {
                 return null;
             }

         } catch (error) {
             console.log(error);  
             return undefined;
         }
     }

     async update(id, firstName, lastName, email, password,birthday, profileImage, profileId){
         var user = await this.findById(id) 

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

             if(firstName){updateUser.firstName = firstName}
             if(lastName){updateUser.lastName = lastName}
             if(birthday){updateUser.birthday = birthday}
             if(profileImage){updateUser.profileImage = profileImage}
             if(profileId){updateUser.profileId = profileId}

             try {
                 await userModel.update(updateUser, {where:{id: user.id}})
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
                 await userModel.destroy({where: {id: id}})
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

                 await userModel.update(
                    {password: passwordHash},
                    {
                        where:{
                            id: user.id
                        }
                    }
                )
                 return {status: true}
             } catch (error) {
                 console.log(error);
                return {status: false}
             }
         }else{
             return{status: false, err: "Usuario não encontrado."}
         }
     }
}

module.exports = new User()