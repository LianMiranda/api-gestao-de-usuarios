class HomeController {
    async index(req, res){
        res.send("APP RODANDO")
    }
}

module.exports = new HomeController()