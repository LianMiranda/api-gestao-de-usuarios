const { configDotenv } = require("dotenv");
configDotenv()
const jwt = require("jsonwebtoken");

function auth(req, res, next){
    const authToken = req.headers['authorization'] 

    if(authToken){
        const bearer = authToken.split(' ')
        var token = bearer[1]

        try {
            var decoded = jwt.verify(token, process.env.SECRET)
            if(decoded.profileId == 1){
                next()
            }else{
                return res.status(403).json({message: "Você não é um administrador!"})
            }
        } catch (err) {
            console.log(err);
        }
    }else{
        return res.status(403).json({message: "Você não está autenticado"})
    }
}

module.exports = auth;
