const express = require('express');
const app = express();

app.listen(3000, (req, res)=>{
    console.log('SERVER ON -> http://localhost:3000');
});

app.use(express.urlencoded({extended:false}));
app.use(express.json());


const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});


app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view engine','ejs');