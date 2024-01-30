// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Haal data op uit de FDND API, wacht tot dit klaar is (await)
const { data } = await fetch('https://fdnd.directus.app/items/Person/9')
  .then((response) => response.json())
  .catch((error) => error)
// console.log(data); // uncomment om de opgehaalde data te checken

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine en stel de 'views' map in
app.set('view engine', 'ejs')
app.set('views', './views')

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Render index.ejs uit de views map en geef uit FDND API opgehaalde data mee
  response.render('index', data)
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
