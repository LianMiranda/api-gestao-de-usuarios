const User = require("../models/User")

class UserController{

    async create(req,res){
        const {name, email, password} = req.body

        if(!email){
            res.status(400).json({message: "Verifique se o email foi preenchido corretamente"})
            return;
        }
        if(!name){
            res.status(400).json({message: "Verifique se o nome foi preenchido corretamente"})
            return;
        }
        if(!password){
            res.status(400).json({message: "Verifique se a senha foi preenchido corretamente"})
            return;
        }
        else{
            var emailExists = await User.findEmail(email) 

            if(emailExists){
                res.status(406).json({message: "Já existe um usuário com esse email"})
                return;
            }

            await User.newUser(name, email, password)
            res.status(200).json({message: "usuario criado"})
        }
    }

}

module.exports = new UserController()