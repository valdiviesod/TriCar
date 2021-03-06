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

//Renderizado de las vistas con ejs


app.get('/login',(req,res)=>{
	res.render('login')
})

app.get('/register',(req,res)=>{
	res.render('register')
})

app.get('/seleccionRuta',(req,res)=>{
	res.render('seleccionRuta')
})






//Registro y mensajes de advertencias
app.post('/register', async (req,res) =>{
	const name = req.body.name;
	const last = req.body.last;
	const adress = req.body.adress;
	const phone = req.body.phone;	
	const id = req.body.id;
	const date = req.body.bdate;
	const email = req.body.email;
	const passwd = req.body.pass;
	let passwordHash = await bcrypt.hash(passwd, 8);
	connection.query('INSERT INTO users SET ?', {nombre:name, apellido:last, direccion:adress, telefono:phone, nacimiento:date, email:email, id:id, passwd:passwordHash}, async(error, results) =>{
		if(error){
			console.log(error)
		}else{
			res.render('register', {
				alert: true,
				alertTitle: "Registro",
				alertMessage: "┬íRegistro exitoso!",
				alertIcon: 'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			})
		}

	})

})

//Validacion de usuarios
app.post('/auth', async(req, res)=> {
	const user = req.body.email
	const passwd = req.body.pass
	let passwordHash = await bcryptjs.hash(passwd, 8);
	if (user && passwd){
		connection.query('SELECT * FROM users WHERE email = ?', [user] , async(error, results)=>{
			if(results.length ==0 || !(await bcryptjs.compare(passwd, results[0].passwd))){
				res.render('login',{
					alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contrase├▒a incorrectas",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'    
				});


			}else{
				req.session.loggedin = true;                
<<<<<<< HEAD
				req.session.name = results[0].name;
=======
				req.session.name = results[0].nombre + " " + results[0].apellido;
>>>>>>> temp-branch
				res.render('login', {
					alert: true,
					alertTitle: "Conexi├│n exitosa",
					alertMessage: "┬íInicio de sesion exitoso!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});   
			}
			res.end();
		})

	}else{
		res.render('login', {
			alert: true,
			alertTitle: "Advertencia",
			alertMessage: "Por favor ingrese un usuario y una contrase├▒a",
			alertIcon:'warning',
			showConfirmButton: true,
			timer: false,
			ruta: 'login'
		});   
	}
});

//Autenticacion para todas las paginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('inicioUsuario',{
			login: true,
			email: req.session.email		
		});		
	} else {
		res.render('index',{
			login:false,
			email:'Debe iniciar sesi├│n',			
		});				
	}
	res.end();
});

app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') 
	})
});


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});

