const User = require('../models/user');
const CryptoJS = require('crypto-js')

const userResolver = {
    registre: async ({ username,password }) => {
        
        
            const newUser = {username,password}
            const user = await User.create(newUser)
           
            
            return user;

    },


    login: async ({ username,password }) => {

            const user = await User.findOne({ username }).select('password username')
            
            const decryptedPass = CryptoJS.AES.decrypt(
              user.password,
              process.env.PASSWORD_SECRET_KEY
            ).toString(CryptoJS.enc.Utf8)
        
            if (decryptedPass == password) {
                user.password=decryptedPass
              return user
            }


        
    }
     

};

module.exports = userResolver;