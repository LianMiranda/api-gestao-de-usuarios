require('dotenv').config()

var knex = require('knex')({
    client: "mysql2",
    connection:{
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
})

async function initializeProfiles() {
    try {
      const profiles = await knex('profile').select('id');
  
       if (profiles.length === 0) {
        await knex.insert([
          { id: 1, type: 'Usuário' },
          { id: 2, type: 'Administrador' }
        ]).table('profile')
        console.log('Perfis iniciais inseridos com sucesso!');
      } else {
        console.log('Perfis já existem, nada a fazer.');
      }
    } catch (error) {
      console.error('Erro ao inicializar perfis:', error);
    }
  }

initializeProfiles();

module.exports = knex