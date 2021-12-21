const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            e_mail:{
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            password:{
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            nick_name:{
                type: Sequelize.STRING(20),
                allowNull: false,
                // unique: true
            }
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){}
};