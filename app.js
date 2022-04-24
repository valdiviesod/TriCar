const express = require('express');
const app = express();

// Para poder capturar los datos del formulario 
app.use(express.urlencoded({extended:false}));
app.use(express.json());//Se declara el uso de json

const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

// Directorio de assets
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.use(express.static('img'));

// Estableciendo el motor de plantillas
app.set('view engine','ejs');


//Variables de inicio de sesion
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//Se llama a la conexion de la BD
const connection = require('./database/db');
const req = require('express/lib/request');


app.get('/',(req,res)=>{
	res.render('index')
})

app.get('/login',(req,res)=>{
	res.render('login')
})

app.get('/register',(req,res)=>{
	res.render('register')
})

//Registro
app.post('/register', async (req,res) =>{
	const name = req.body.name;
	const last = req.body.last;
	const adress = req.body.adress;
	const phone = req.body.phone;	
	const id = req.body.id;
	const date = req.body.bdate;
	const email = req.body.email;
	const passwd = req.body.pass;
	const rol = req.body.rol;
	connection.query('INSERT INTO users SET ?', {nombre:name, apellido:last, direccion:adress, telefono:phone, nacimiento:date, email:email, id:id, passwd:passwd, rol:rol}, async(error, results) =>{
		if(error){
			console.log(error)
		}else{
			res.send('El usuario ha sido registrado')
		}

	})


})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});

