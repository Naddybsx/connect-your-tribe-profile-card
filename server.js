// Importeert het express pakket, het helpt bij het opzetten van een webserver en het beheren van routes.
// Express is geinstalleerd via npm, en staat vermeld als dependency in package.json
import express from 'express'

// Importeert de liquid templating engine, die je kunt gebruiken om dynamische HTML te maken
// Hierdoor kun je HTML bestanden renderen met daarin variabelen die tijdens runtime worden ingevuld met data.
import { Liquid } from 'liquidjs';

// Hier definieer je een variabele met een person ID, die je later gebruikt om data op te halen
// Deze parameter geeft aan dat je data wilt ophalen van een specifieke persoon, in dit geval mijn ID; 80
const personID = 80

// Haalt data op van de directus API, met behulp van de fetch API
// De Fetch fuctie verstuurt een HTTP GET req naar de opgegveen URL
// De basis URL wordt gecomineerd met de person ID, om mijn specifieke data op te halen
// De data wordt opgeslagen in de variabele personResponse
const personResponse = await fetch('https://fdnd.directus.app/items/person/' + personID)

// De opgehaalde data wordt omgezet naar JSON formaat, zodat het makkelijker te gebruiken is
// Await zorgt ervoor dat de code wacht totdat de data is opgehaald, voordat het verder gaat
// De JSON data wordt opgeslagen in de variabele personResponseJSON
const personResponseJSON = await personResponse.json()

personResponseJSON.data.custom = JSON.parse(personResponseJSON.data.custom);

// Maakt een nieuwe Express applicatie aan, waarin we de server configureren
// Dit is de basis van de server, waarin routes worden gedefinieerd en HTTP req worden afgehandeld
const app = express()

// Gebruik de map 'public' voor statische bestanden (zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stelt Liquid in als view engine,
// Dit zorgt ervoor dat Express weet dat we Liquid gebruiken voor het renderen van HTML
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stelt de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
// De server zal de templates renderen en de HTML naar de browser sturen
app.set('views', './views')

// Definieert een GET route voor de root ("/") van de website
//Dit betekent dat wanneer iemand naar de homepage gaat, deze route wordt uitgevoerd
app.get('/oefenen', async function (request, response) {
    // personResponseJSON.data bevat de opgehaalde data van de API
    // Dit wordt doorgegeven aan de template, zodat het kan worden weergegeven in de HTML
    // De template kan vervolgens de variabele person gebruiken om dynamische inhoud te tonen
   response.render('oefenen.liquid', {person: personResponseJSON.data})
})

app.get('/', async function (request, response) {
  // personResponseJSON.data bevat de opgehaalde data van de API
  // Dit wordt doorgegeven aan de template, zodat het kan worden weergegeven in de HTML
  // De template kan vervolgens de variabele person gebruiken om dynamische inhoud te tonen
 response.render('index.liquid', {person: personResponseJSON.data})
})


// Had je meer pagina's in je oude visitekaartje? Zoals een contact.html?
// Maak daar dan meer Routes voor aan, en koppel ze aan Views
// app.get('/contact', function (request, response) {
   // Render bijvoorbeeld contact.liquid uit de views map, zonder daar iets aan mee te geven
   // response.render('contact.liquid')
// })

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})