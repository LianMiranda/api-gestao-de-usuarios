const connection = require("./connection")
const Sequelize = require("sequelize")
const Profile = require("./profile")

const User = connection.define('users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: false
    },
    profileImage: {
        type: Sequelize.BLOB,
        allowNull: true
    },
    profileId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
//     status: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//     }
})

//User.sync({force: true})

module.exports = User;