const express = require('express');
const services =  require('../services/urlservice')

const route = express.Router();

route.post('/generate', services.generate);
route.get('/delete/:id', services.deleteurl);
route.get('/myUrls' ,services.geturls);
route.get('/profile', services.profile);
route.post('/password', services.password);
module.exports= route;