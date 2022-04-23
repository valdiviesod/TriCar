const mysql = require("mysql");
const conecction = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.DB_DATABASE
});

conecction.connect((error) => {
    if(error){
        console.log("Error de conexion -> " + error);
        return;
    }
    console.log("Conexion exitosa")
});
module.exports = conecction;