const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "Postgres1234",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
}); 

/*
1. Crear una ruta GET /joyas:
b. Reciba en la query string los parámetros (2 puntos):
i. limits: Limita la cantidad de joyas a devolver por página
ii. page: Define la página
iii. order_by: Ordena las joyas según el valor de este parámetro, ejemplo:
stock_ASC

*/
const obtenerJoyas= async ({ limits = 10, order_by = "id_ASC", page=1}) => {

    const [campo,direccion] = order_by.split("_")
    const offset = (page-1)*limits

    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s',
    campo, direccion, limits, offset)

    pool.query(formattedQuery);

     try{
    const { rows: inventario } = await pool.query(formattedQuery)
    return inventario
     }
     catch(error){
        console.error("Error al obtener joyas:", error.message)
        throw new Error("No se pudo obtener el inventario de joyas.")
     }
    }

/*
2. Crear una ruta GET /joyas/filtros que reciba los siguientes parámetros en la query
string: (3.5 puntos)
a. precio_max: Filtrar las joyas con un precio mayor al valor recibido
b. precio_min: Filtrar las joyas con un precio menor al valor recibido.
c. categoria: Filtrar las joyas por la categoría
d. metal: Filtrar las joyas por la categoría
*/

/*
5. Usar las consultas parametrizadas para evitar el SQL Injection en la consulta a la
base de datos relacionada con la ruta GET /joyas/filtros
*/

const obtenerJoyasFiltros= async ({ precio_min, precio_max,stock_min,metal,categoria }) => {
    let filtros = []
    const values = []

    const agregarFiltro = (campo, comparador,valor)=>{
    values.push(valor)
    const {length}=filtros
    filtros.push(`${campo} ${comparador} $${length+1}`)
    }
    if (precio_max) agregarFiltro('precio',' <=', precio_max)
    if (precio_min) agregarFiltro('precio', '>=' ,precio_min)
    if (stock_min) agregarFiltro('stock' ,'>=', stock_min)
    if (metal) agregarFiltro('metal',' = ',metal)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
    filtros = filtros.join(" AND ")
    consulta += ` WHERE ${filtros}`
    }
    try{

    const { rows: inventario } = await pool.query(consulta,values)
    return inventario
    }
    catch(error){
        console.error("Error al obtener joyas filtradas:", error.message);
    throw new Error("No se pudo obtener el inventario de joyas filtradas.")
    }
    }




module.exports = {obtenerJoyas,obtenerJoyasFiltros}