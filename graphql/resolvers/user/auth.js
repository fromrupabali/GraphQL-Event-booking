const bcrypt = require('bcryptjs');
const User = require('../../../models/users');
const { events } = require('../merge/merge');
const jwt = require('jsonwebtoken');

module.exports = {
    users: async () => {
        try{
            const users = await User.find()
            return users.map(user => {
                return { 
                    ...user._doc,
                     password: null,
                     createdEvents : events.bind(this, user._doc.createdEvents)
                    };
            })
        }catch(err){
            throw err;
        }
    },

    createUser: async (args) => {
        try{
           const user = await User.findOne({email: args.userInput.email});
      
              if(user){
                 throw new Error('Email already exists');
              }
              const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
              const newUser = new User({
                      email: args.userInput.email,
                      password: hashedPassword
                  });
                 const result = await  newUser.save();
         
                 return {...result._doc};

        }catch(err){
            throw err;
        }
       
    },
    login: async ({email, password}) => {
        try{
            const user = await User.findOne({email: email});
            if(!user){
                throw new Error('Email doesn\'t exists');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual){
                throw new Error('Invalid password');
            }
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                'somespecialsecretkey',
                {
                    expiresIn: '1h'
                });
            return { userId: user.id, token: token, tokenExpiration: 1}

        }catch(err){
            throw err;
        }
    }
};