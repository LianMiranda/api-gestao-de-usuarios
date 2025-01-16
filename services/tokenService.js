const jwt = require("jsonwebtoken");

class tokenService{
    static async genToken(user, expiresIn){
         var token = jwt.sign({id: user.id, email: user.email, profileId: user.profileId}, process.env.SECRET, {expiresIn: expiresIn});
         return token;
    }
}

module.exports = tokenService