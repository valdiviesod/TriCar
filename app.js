/*//Configurando sesion en framework express
const express = require('express');
const app = express();

//Corriendo el servidor en el puerto 3000
app.listen(3000, (req, res)=>{
    console.log('SERVER ON -> http://localhost:3000');
});

//Para tomar datos de los formularios
app.use(express.urlencoded({extended:false}));
app.use(express.json());


const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//Directorios para las plantillas 
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//Motor de plantillas
app.set('view engine','ejs');
*/
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

//Se establecen rutas a los formularios
	app.get('/login',(req, res)=>{
		res.render('login');
	})

	app.get('/register',(req, res)=>{
		res.render('register');
	})

app.post('/register', async (req, res)=>{
	const user = req.body.user;
	const name = req.body.name;
    const rol = req.body.rol;
	const pass = req.body.pass;
	let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{            
			res.render('register', {
				alert: true,
				alertTitle: "Registration",
				alertMessage: "¡Successful Registration!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			});
            //res.redirect('/');         
        }
	});
})



//Autenticacion
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHash = await bcrypt.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcrypt.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
				
				//Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});

//Controlar autenticacion en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});


//Limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//Cierra la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});

