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

const bcrypt = require('bcryptjs');


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
const bcryptjs = require('bcryptjs');


app.get('/',(req,res)=>{
	res.render('index')
})

app.get('/login',(req,res)=>{
	res.render('login')
})

app.get('/register',(req,res)=>{
	res.render('register')
})

app.get('/conductor',(req,res)=>{
	res.render('conductor')
})

app.get('/prueba',(req,res)=>{
	res.render('prueba')
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
	let passwordHash = await bcrypt.hash(passwd, 8);
	connection.query('INSERT INTO users SET ?', {nombre:name, apellido:last, direccion:adress, telefono:phone, nacimiento:date, email:email, id:id, passwd:passwordHash, rol:rol}, async(error, results) =>{
		if(error){
			console.log(error)
		}else{
			res.render('register', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "¡Registro exitoso!",
				alertIcon: 'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			})
		}

	})

})

app.post('/auth', async(req, res)=> {
	const user = req.body.email
	const passwd = req.body.pass
	let passwordHash = await bcryptjs.hash(passwd, 8);
	if (user && passwd){
		connection.query('SELECT * FROM users WHERE email = ?', [user] , async(error, results)=>{
			if(results.length ==0 || !(await bcryptjs.compare(passwd, results[0].passwd))){
				res.send('Usuario o contraseña incorrectas');


			}else{
				res.send('Inicio de sesion exitoso');
			}
		})
	}
})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});

