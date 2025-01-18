const connection = require("./connection")
const Sequelize = require("sequelize");

const Profile = connection.define('profiles', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
   type: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

 async function initializeProfiles() {
     try {
        const profiles = await Profile.findAll()     
               
        if (profiles.length === 0) {
         Profile.bulkCreate([
           { id: 1, type: 'Usuário' },
           { id: 2, type: 'Administrador' }
         ])
         console.log('Perfis iniciais inseridos com sucesso!');
       } else {
         console.log('Perfis já existem, nada a fazer.');
       }
     } catch (error) {
       console.error('Erro ao inicializar perfis:', error);
     }
   }

 initializeProfiles();

//Profile.sync({force: true})

module.exports = Profile;