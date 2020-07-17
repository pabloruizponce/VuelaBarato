const express = require('express')
const morgan = require('morgan')
const path = require('path')
const got =  require('got')
const fs = require('fs')
const bodyParser = require('body-parser')
const nodemailer = require("nodemailer")

const crendentials = fs.readFileSync(__dirname + '/credentials.txt').toString().split("\n")

let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
        user: crendentials[0], // generated ethereal user
        pass: crendentials[1], // generated ethereal password
    },
});

async function sendReport() {

    let files = fs.readFileSync(__dirname + '/public/url.txt').toString().split("\n")

    let URLs = []

    for (let file of files) {
        if(file != '') {
            URLs.push(decodeURL(file))
        }
    }

    rawData = await getData(URLs)
    nFlights = 0

    for (let data of rawData) {
        nFlights += data["fares"].length
    }

    info = await transporter.sendMail({
        from: '"Vuela Barato ✈" <' + crendentials[0] + '>', // sender address
        to: crendentials[0], // list of receivers
        subject: "Report Vuela Barato ✈", // Subject line
        html: '<img src="cid:vuelabaratologo" style="width:300px"/><br>El numero total de vuelos con tu busqueda es<b> ' + nFlights +
              '</b>. Revisa la pagina web para saber cuales son.<br><br>Un saludo,<br><b>Pablo Ruiz</b>', // html body
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/public/logo.png',
            cid: 'vuelabaratologo' //same cid value as in the html img src
        }]
    })

    console.log("Report enviado")
    setTimeout(sendReport, 1*1000*60)
}



function createWeb(dataRAW) {

    let web = `

    <!DOCTYPE HTML>
    <html>
      <head>
            <link href='https://fonts.googleapis.com/css?family=Assistant' rel='stylesheet'>
            <link rel="stylesheet" href="style.css">
            <link href='https://fonts.googleapis.com/css?family=Assistant' rel='stylesheet'>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
            <img src='./logo.png' class="logo" onclick='window.location.href=window.location.href'>

    `
    for (let data of dataRAW) {
        for (let flight of data["fares"]) {

            let arrivalDate = flight["outbound"]["arrivalDate"].split("T")
            let departureDate = flight["outbound"]["departureDate"].split("T")
    
            web += `
                <div class="flight">
                    <div class="element"><b>
            ` 
            + flight["outbound"]["departureAirport"]["name"] + `</b><br> `
            + departureDate[0] + ` <br> ` + departureDate[1] + 
            `
                    </div>
                    <div class="element"><b>
            ` 
            + flight["outbound"]["arrivalAirport"]["name"]  + `</b><br> `
            + arrivalDate[0] + ` <br> ` + arrivalDate[1] + 
            `
                    </div>
                    <div class="price">
            ` 
            + flight["outbound"]["price"]["value"] + ` `
            + flight["outbound"]["price"]["currencySymbol"] + 
            `
                    </div>
                </div><br>
            `
        }
    }
    

    web += `
    </body>
    </html>
    `


    return web
}

async function getData(fURLs) {

    let datareaded = []

    for (let URL of fURLs) {
        try {
            const response = await got(URL);
            datareaded.push(JSON.parse(response.body))
        } catch(error) {
            console.log(error.response.body)
        }
    
    }

    return datareaded;
} 

function decodeURL(fURL) {
    let newURL = new URL(fURL)
    let param = newURL.searchParams

    const dictionary = {
        'from': 'departureAirportIataCode', 
        'to': 'arrivalAirportIataCode', 
        'out-from-date': 'outboundDepartureDateFrom', 
        'out-to-date': 'outboundDepartureDateTo', 
        'budget': 'priceValueTo', 
        'trip-length-from': 'durationFrom', 
        'trip-length-to': 'durationTo', 
        'in-from-date': 'inboundDepartureDateFrom', 
        'in-to-date': 'inboundDepartureDateTo', 
        'trip-type-category': 'arrivalAirportCategoryCode'
    }
    
    let encodedURL = "https://www.ryanair.com/api/farfnd/3/"

    if (param.has('in-from-date')){
        encodedURL += "roundTripFares"
    } else {
        encodedURL += "oneWayFares"
    }
    
    encodedURL += "?&language=es&limit=16&market=es-es&offset=0"

    for (let key of param.keys()) {
        encodedURL += '&' + dictionary[key] + '=' + param.get(key)
    }

    return encodedURL
}

const app = express();

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(morgan('dev'))

app.get('/', async (req, res) => {

    let files = fs.readFileSync(__dirname + '/public/url.txt').toString().split("\n")

    console.log(files)
    let URLs = []

    for (let file of files) {
        if(file != '') {
            URLs.push(decodeURL(file))
        }
    }

    res.send(createWeb(await getData(URLs)))
})

app.get('/url', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.post('/url', (req, res) => {
    console.log(req.body.url)
    if (req.body.url == 'remove') {
        fs.writeFileSync(__dirname + '/public/url.txt', '')
        res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + "?good=2")
    } else {
        if(/https?:\/\/(www\.)?ryanair.com\/es\/es\/vuelos-baratos(\/[a-zA-Z0-9?=-]*)?/.test(req.body.url)) {
            fs.appendFileSync(__dirname + '/public/url.txt', req.body.url + "\n")
            res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + "?good=1")
        } else {
            res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + "?error=1")
        }
    }

})

app.use(express.static(path.join(__dirname, 'public')))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    sendReport()
    console.log("API working")
})