const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongo = require('./db/mongo');
const authroutes = require('./routes/auth');
const urlroutes = require('./routes/url');
const jwt= require('jsonwebtoken');


const port = process.env.PORT || 3001;
dotenv.config();

(async () => {
    try {
      // db connection
      await mongo.connect();

      //middlewares
      app.use(cors())
      app.use(express.json());
      
      //routes
      app.use('/auth',authroutes)
      //checking for token
      app.get('/:id', async (req, res) =>{
        const {value} = await mongo.db.collection('urlshortner').findOneAndUpdate({shortid:req.params.id} , {$inc:{clicked : 1}})
        if(value)
          res.send(value);
        else
          res.status(404).send({error:"wrong"});
      })

      app.use((req , res , next)=>{
          try{
              let  token = req.headers['authorization'].split(' ')[1];
              const user = jwt.verify(token, process.env.pass)
              // console.log(user)
              req.user = user.UserId
              next();
          }
          catch(error){
              res.sendStatus(403);
          }
      })
      app.use('/short',urlroutes);
  
      app.listen(port, () => {
        console.log("server is up at port " + port);
      });
  
    } catch (error) {
      console.log("Error while starting app");
    }
  })();