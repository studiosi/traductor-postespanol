//////////////////////////////////////////////////////////////////////////////
// REGLAS
// RPC -> reemplazar siempre: sustituir conservando capitalización
// >> ["RPC", cadena_a_buscar, cadena_a_sustituir]
// RS -> sustitución aleatoria: sustituye si eso, conservando capitalización
// >> ["RS", cadena_a_buscar, cadena_a_sustituir, porcentaje_cambio]
// RPR -> reemplazar con prefijo: reemplaza la cadena a buscar por la
// cadena a sustituir si esta precedida por un prefijo. La capitalización
// del prefijo no importa.
// >> ["RPR", cadena_a_buscar, cadena_a_sustituir, prefijo]
// RPRR -> reemplazar con prefijo: reemplaza la cadena a buscar por la
// cadena a sustituir si esta precedida por un prefijo. La capitalización
// del prefijo no importa, en un porcentaje de los casos.
// >> ["RPRR", cadena_a_buscar, cadena_a_sustituir, prefijo, porcentaje_cambio]
// RPNR -> reemplazar con prefijo: reemplaza la cadena a buscar por la
// cadena a sustituir si no esta precedida por un prefijo. La capitalización
// del prefijo no importa.
// >> ["RPR", cadena_a_buscar, cadena_a_sustituir, prefijo]
// RPNRR -> reemplazar con prefijo: reemplaza la cadena a buscar por la
// cadena a sustituir si no esta precedida por un prefijo. La capitalización
// del prefijo no importa, en un porcentaje de los casos.
// >> ["RPRR", cadena_a_buscar, cadena_a_sustituir, prefijo, porcentaje_cambio]
// DWS -> eliminar del principio de la cadena. Si la cadena empieza por el
// prefijo, se elimina el prefijo.
// >> ["DWS", prefijo]
// EA -> elimina los acentos para el idioma castellano
// >> ["EA"]
// FSP -> finalizar si plural: modifica el final de una palabra en plural, es
// decir, terminada en s que no es singular terminado en s. Aleatoriamente
// elige una de estas opciones: dejarla tal cual, quitar la s y añadir entre
// 1 y 3 n, añadir 1 o 2 eses. Nota: debido a que la lista de palabras está
// únicamente sin acentos, no funciona si no se aplica la regla de eliminar
// acentos primero.
// >> ["FSP"]
// RCC -> cambio de capitalización aleatorio. Convierte mayúsculas a
// minúsculas y viceversa en un porcentaje de los casos. Para cada letra se
// "lanza el dado" y se cambia si es necesario.
// >> ["RCC", procentaje]
// AIR -> añadir cadena al inicio si la palabra empieza por un prefijo, en un
// porcentaje de los casos. En el prefijo, se ignora la capitalización.
// >> ["AIR", prefijo, cadena_a_anadir, porcentaje]
// CF -> reemplazar sufijo por cadena en un porcentaje de los casos
// >> ["CF", sufijo, cadena, porcentaje]

const reglas_1 = [
  ["EA"],
  ["RS", "ge", "je", 90],
  ["RS", "gi" , "ji", 90],
  ["RS", "j" , "g", 90],
  ["RS", "j" , "h", 90],
  ["RS", "ce" , "se", 90],
  ["RS", "ci" , "si", 90],
  ["RS", "za" , "sa", 90],
  ["RS", "se" , "ce", 90],
  ["RS", "si" , "ci", 90],
  ["RS", "s" , "z", 90],
  ["RS", "z" , "s", 90],
  ["RS", "ze" , "ce", 90],
  ["RS", "zi" , "ci", 90],
  ["RS", "b" , "v", 90],
  ["RS", "v" , "b", 90],
  ["RS", "qu" , "k", 90],
  ["RS", "k" , "q", 90],
  ["RS", "gen" , "jen", 100],
  ["RS", "berenjena" , "berengena", 100],
  ["RS", "ajeno" , "ageno", 100],
  ["RS", "si" , "ci", 50],
  ["FSP"],
  ["RS", "ch" , "x", 70],
  ["RS", "personas" , "persianas", 100],
  ["RPRR", "ue", "oe", "q", 100],
  ["RS", "nv" , "mb", 50],
  ["RS", "mb" , "nv", 50],
  ["RS", "ahi" , "hay", 90],
  ["RS", "ahi" , "ai", 90],
  ["RS", "hay" , "ahi", 90],
  ["RS", "hay" , "ai", 90],
  ["RS", "ai" , "ahi", 90],
  ["RS", "ai" , "ai", 90],
  ["RS", "alla" , "haya", 90],
  ["RS", "haya" , "alla", 90],
  ["DWS", "h"],
  ["AIR", "a", "h", 60],
  ["RS", "ua", "oa", 80],
  ["CF", "?", " es pregunta ", 60],
  ["CF", "?", " ?¿?¿ ", 60],
  ["CF", ".", "...", 20],
  ["CF", ".", "!!!", 20],
  ["RPRR", ".", "", "..", 100],
  ["CF", ",", "", 100],
  ["CF", ")", "", 100],
]
const reglas_2 = [
  ["EA"],
  ["RS", "ge" , "je", 60],
  ["RS", "gi" , "ji", 60],
  ["RS", "j" , "g", 60],
  ["RS", "j" , "h", 60],
  ["RS", "ce" , "se", 60],
  ["RS", "ci" , "si", 60],
  ["RS", "za" , "sa", 60],
  ["RS", "se" , "ce", 60],
  ["RS", "si" , "ci", 60],
  ["RS", "s" , "z", 60],
  ["RS", "z" , "s", 60],
  ["RS", "ze" , "ce", 60],
  ["RS", "zi" , "ci", 60],
  ["RS", "b" , "v", 60],
  ["RS", "v" , "b", 60],
  ["RS", "qu" , "k", 60],
  ["RS", "k" , "q", 60],
  ["RS", "gen" , "jen", 80],
  ["RS", "berenjena" , "berengena", 100],
  ["RS", "ajeno" , "ageno", 100],
  ["RS", "si" , "ci", 30],
  ["FSP"],
  ["RS", "ch" , "x", 50],
  ["RS", "personas" , "persianas", 90],
  ["RPRR", "ue", "oe", "q", 80],
  ["RS", "nv" , "mb", 30],
  ["RS", "mb" , "nv", 30],
  ["RS", "ahi" , "hay", 70],
  ["RS", "ahi" , "ai", 70],
  ["RS", "hay" , "ahi", 70],
  ["RS", "hay" , "ai", 70],
  ["RS", "ai" , "ahi", 70],
  ["RS", "ai" , "ai", 70],
  ["RS", "alla" , "haya", 70],
  ["RS", "haya" , "alla", 70],
  ["DWS", "h"],
  ["AIR", "a", "h", 30],
  ["RS", "ua", "oa", 80],
  ["CF", "?", " es pregunta ", 30],
  ["CF", "?", " ?¿?¿ ", 30],
  ["CF", ".", "...", 10],
  ["CF", ".", "!!!", 10],
  ["RPRR", ".", "", "..", 100],
  ["CF", ",", "", 100],
  ["CF", ")", "", 100],
]
const reglas_3 = [
  ["EA"],
  ["RS", "ge" , "je", 40],
  ["RS", "gi" , "ji", 40],
  ["RS", "j" , "g", 40],
  ["RS", "j" , "h", 40],
  ["RS", "ce" , "se", 40],
  ["RS", "ci" , "si", 40],
  ["RS", "za" , "sa", 40],
  ["RS", "se" , "ce", 40],
  ["RS", "si" , "ci", 40],
  ["RS", "s" , "z", 40],
  ["RS", "z" , "s", 40],
  ["RS", "ze" , "ce", 40],
  ["RS", "zi" , "ci", 40],
  ["RS", "b" , "v", 40],
  ["RS", "v" , "b", 40],
  ["RS", "qu" , "k", 40],
  ["RS", "k" , "q", 40],
  ["RS", "gen" , "jen", 60],
  ["RS", "berenjena" , "berengena", 100],
  ["RS", "ajeno" , "ageno", 100],
  ["RS", "si" , "ci", 20],
  ["FSP"],
  ["RS", "ch" , "x", 40],
  ["RS", "personas" , "persianas", 80],
  ["RPRR", "ue", "oe", "q", 70],
  ["RS", "nv" , "mb", 30],
  ["RS", "mb" , "nv", 30],
  ["RS", "ahi" , "hay", 60],
  ["RS", "ahi" , "ai", 60],
  ["RS", "hay" , "ahi", 60],
  ["RS", "hay" , "ai", 60],
  ["RS", "ai" , "ahi", 60],
  ["RS", "ai" , "ai", 60],
  ["RS", "alla" , "haya", 60],
  ["RS", "haya" , "alla", 60],
  ["DWS", "h"],
  ["AIR", "a", "h", 10],
  ["RS", "ua", "oa", 70],
  ["CF", "?", " es pregunta ", 10],
  ["CF", "?", " ?¿?¿ ", 10],
  ["CF", ".", "...", 5],
  ["CF", ".", "!!!", 5],
  ["RPRR", ".", "", "..", 100],
  ["CF", ",", "", 100],
  ["CF", ")", "", 100],
]

const reglas = [reglas_1, reglas_2, reglas_3];

module.exports = reglas;
