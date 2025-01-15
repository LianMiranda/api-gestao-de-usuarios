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
        var {email, name, role} = req.body
        var result = await User.update(id, name, email, role);

        if(result){
            if(result.status){
                res.status(200).json({message: "Usuário atualizado"})
            }else{
                res.status(406).json(result);
            }
        }else{
            res.status(406).json({error: "Erro no servidor"});
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
}

module.exports = new UserController()