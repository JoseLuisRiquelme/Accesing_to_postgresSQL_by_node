const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON'))
const{obtenerJoyas,obtenerJoyasFiltros}=require('./consultas')

/*
3. Implementar middlewares para generar informes o reportes de alguna actividad o
evento específico que ocurra en cada una de las rutas
*/

const generarInformeSolicitudes = (req, res, next) => {
    const fechaHora = new Date().toISOString();
    console.log(`[${fechaHora}] - Ruta: ${req.method} ${req.originalUrl}`);
    next();
  };
app.use(generarInformeSolicitudes);

/*
1.
a. Devuelva la estructura HATEOAS de todas las joyas almacenadas en la base
de datos
*/

const prepararHATEOAS = (joyas) => {
    const results = joyas.map((m) => {
    return {
    name: m.nombre,
    href: `/joyas/joya/${m.id}`,
    }
    }).slice(0, 4)
    const total = joyas.length
    const HATEOAS = {
    total,
    results
    }
    return HATEOAS
    }
    


app.get('/joyas', async (req, res) => {
/*4.
 Usar try catch para capturar los posibles errores durante una consulta y la lógica de
cada ruta creada.
*/
    try {
    const queryStrings  = req.query
    const joyas = await obtenerJoyas(queryStrings)
    const HATEOAS = await prepararHATEOAS(joyas)
    res.json(HATEOAS)
    }
    catch (error) {
        console.error('Error al obtener joyas:', error.message);
        res.status(500).json({ error: 'Error al obtener joyas' });
      } 
})

app.get('/joyas/filtros', async (req, res) => {
    try {
    const queryStrings = req.query
    const joyas = await obtenerJoyasFiltros(queryStrings)
    res.json(joyas)
} catch (error) {
    console.error('Error al obtener joyas filtradas:', error.message);
    res.status(500).json({ error: 'Error al obtener joyas filtradas' });
  }
    })
