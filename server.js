const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',    // Cambia según tu configuración
  password: '123456',    // Cambia si tienes una contraseña
  database: 'matriculados_db'
});

// Verifica la conexión
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con id ' + db.threadId);
});

// Middleware para poder recibir datos en formato JSON
app.use(express.json());

// Ruta para consultar una matrícula
app.get('/consultar/:nro_matricula', (req, res) => {
    const nro_matricula = req.params.nro_matricula;
  
    

    // Consulta a la base de datos
    db.query('SELECT * FROM matriculas WHERE nro_matricula = ?', [nro_matricula], (err, results) => {
      if (err) {
        return res.status(500).send('Error al consultar la base de datos');
      }

      if (results.length > 0) {
        const matricula = results[0];
  

        
        // Determinamos la categoría basándonos en el valor del número de matrícula
        let categoria = '';
        let linkCategoria = '';
  
        if (matricula.nro_matricula.startsWith('I')) {
          categoria = 'Categoría 1';
          linkCategoria = 'https://www.copitec.org.ar/'; // Cambiar por el link real
        } else if (['L', 'A', 'T'].some(prefix => matricula.nro_matricula.startsWith(prefix))) {
          if (matricula.es_superior) {
            categoria = 'Categoría 2';
            linkCategoria = 'https://www.copitec.org.ar/'; // Cambiar por el link real
          } else {
            categoria = 'Categoría 3';
            linkCategoria = 'https://www.copitec.org.ar/'; // Cambiar por el link real
          }
        } else if (matricula.nro_matricula.startsWith('C')) {
          categoria = 'Categoría 3';
          linkCategoria = 'https://www.copitec.org.ar/'; // Cambiar por el link real
        }


        return res.json({
          nombre_completo: matricula.nombre_completo,
          dni: matricula.dni,
          categoria: categoria,
          linkCategoria: linkCategoria
        });

      } else {
        return res.status(404).send('Matrícula no encontrada');
      }
    });
  });




app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


