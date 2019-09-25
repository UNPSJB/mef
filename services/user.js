const models = require('../models')
let User = models.User;

class UserService{
    constructor(){

    }
    getUsers(){
        // comentario
    }
    findUser(user){
        //find
        const {email,password} = user.body;
        return Promise.resolve(
            User.findOne({
                where:{
                    email
                }
            }).then((data) =>{
                // solo el objeto
                return data.dataValues; 
            })
        );
    }
    createUser(user){
        const { email, password } = user.body;
        return Promise.resolve(
            User.create({
                email,
                password
            })
        );
    }
}

module.exports = UserService;