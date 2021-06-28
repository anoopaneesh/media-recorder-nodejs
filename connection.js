var mysql = require('mysql')
const hostString = 'bdfrukzi9v3wpqy0u0sv-mysql.services.clever-cloud.com'
const usernameString = 'upz3btgvcnm8o01l'
const passwordString = 'CHoRY7mucjZ6q1mZ9PSr'
const databaseString = 'bdfrukzi9v3wpqy0u0sv'
let database = null
function getDB() {
  if(!database){
    database = mysql.createConnection({
        host: hostString,
        user: usernameString,
        password: passwordString,
        database: databaseString,
      })
  }
  return database
}

module.exports = getDB
