const shortid = require('shortid');
const schema = require('../schema/urlschema')
const  mongo  = require('../db/mongo');
const getTitleAtUrl = require('get-title-at-url');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const generate = async ( req, res) =>{
    try{
    const {error, value}= await schema.generateschema.validate(req.body)
    if(error) return res.status(400).send({error:error.details[0].message});

    value.shortid = shortid.generate();
    value.clicked = 0;
    value.user = req.user;

    getTitleAtUrl(value.url, async function (title) {
        const registeredurl = await mongo.db.collection('urlshortner').insertOne({...value, tname:title});
        // res.send(registeredurl);
        const data = await mongo.db.collection('urlshortner').findOne({_id :registeredurl.insertedId });
        res.send(data);
    });
   
    }
    catch{
        res.status(400).send("something went wrong")
    }
}
const geturls = async (req, res ) =>{
    try{
        const deleteurl = await mongo.db.collection('urlshortner').find({user:req.user}).toArray();
        res.send(deleteurl);
        }
        catch{
            res.status(400).send("failed to get")
        }
}

const deleteurl = async ( req, res) =>{
    try{
    const deleteurl = await mongo.db.collection('urlshortner').findOneAndDelete({$and:[{user:req.user}, {shortid:req.params.id}]});
    res.send(deleteurl);
    }
    catch{
        res.status(400).send("failed to delete")
    }
}
// userdetails
const profile = async ( req, res) =>{
    try{
    // const data = await mongo.db.collection('userdetails').findOne({_id:req.user});
    const user = await mongo.db.collection('userdetails').findOne({_id: ObjectId( req.user)});
    console.log(user);
    res.send(user);
    }
    catch{
        res.status(400).send("failed to fetch profile")
    }
}
const password =async(req, res) =>{
    try{
    const{error , value} = await schema.Newpasswordschema.validate(req.body);
    if(error) return res.status(403).send({error:error.details[0].message})
    const salt = await bcrypt.genSalt();
    value.password = await bcrypt.hash(value.password , salt);
    await mongo.db.collection('userdetails').updateOne({_id: ObjectId(req.user)} , {$set:{password: value.password}} );
    return res.send({message: "password changed"})
    }
    catch{
        res.send({error:"failed to change password"})
    }
}

module.exports = {
    generate,
    deleteurl,
    geturls,
    profile,
    password
}