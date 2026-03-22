// ============================================================
// DATA & HELPERS
// ============================================================
function mkId(n) { return n.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).slice(2, 6) }
function mkLoc(name, lat, lng, tags = {}) { return { id: mkId(name), name, lat: +lat, lng: +lng, tags } }
function pick(a) { return a[Math.floor(Math.random() * a.length)] }

const HOMEWORK = {
  "tegel7": {
    label: "Tegel 7: Noord-Europa", description: "Landen, hoofdsteden, zeeen", hw: true, locations: [
      // Positions matched to textbook map (tegel7.jpg)
      // 1. Scandinavie (Gebied/flag) - flag icon in central Scandinavia
      mkLoc("Scandinavie", 63.0, 13.5, { type: "gebied", fact: "Scandinavie betekent 'land van de duisternis' - in de winter is het soms 24 uur donker!" }),
      // 2. Noorwegen (Land/square) - square in southern Norway
      mkLoc("Noorwegen", 60.5, 7.0, { type: "land", fact: "Noorwegen heeft meer dan 1000 fjorden! De langste is 204 km." }),
      // 3. Oslo (Plaats/circle - hoofdstad) - circle near southern Norway
      mkLoc("Oslo", 59.91, 10.75, { type: "capital", capitalOf: "Noorwegen", fact: "In Oslo staat een enorme skischans midden in de stad!" }),
      // 4. Zweden (Land/square) - square in central Sweden
      mkLoc("Zweden", 61.5, 15.0, { type: "land", fact: "Zweden heeft meer dan 200.000 eilanden!" }),
      // 5. Denemarken (Land/square) - square on Jutland peninsula
      mkLoc("Denemarken", 55.5, 9.5, { type: "land", fact: "LEGO komt uit Denemarken! Het woord betekent 'speel goed' in het Deens." }),
      // 6. Kopenhagen (Plaats/circle - hoofdstad) - circle at Copenhagen
      mkLoc("Kopenhagen", 55.68, 12.57, { type: "capital", capitalOf: "Denemarken", fact: "In Kopenhagen staat het Zeemeerminbeeldje - maar het is maar 1,25 meter hoog!" }),
      // 7. Polen (Land/square) - square at bottom of map
      mkLoc("Polen", 52.5, 19.0, { type: "land", fact: "Polen heeft het grootste kasteel ter wereld: Malbork!" }),
      // 8. Noordzee (Water/waves) - waves west of Norway
      mkLoc("Noordzee", 58.0, 2.5, { type: "water", fact: "Onder de Noordzee liggen olie- en gasvelden met meer dan 180 boorplatforms!" }),
      // 9. Oostzee (Water/waves) - waves in the Baltic Sea
      mkLoc("Oostzee", 57.5, 18.5, { type: "water", fact: "De Oostzee is bijna zoet water! Maar een vijfde van de oceaan qua zout." }),
      // 10. IJsland (Land/square) - square on Iceland
      mkLoc("IJsland", 65.0, -19.0, { type: "land", fact: "IJsland heeft geen leger! En er zijn meer schapen dan mensen." }),
    ]
  },
  "tegel8": {
    label: "Tegel 8: Zweden & Finland", description: "Scandinavie in detail", hw: true, locations: [
      // Positions matched to textbook map (tegel8.jpg)
      // 1. Scandinavie (Gebied/flag) - flag in central Scandinavia
      mkLoc("Scandinavie", 63.5, 16.0, { type: "gebied", fact: "Vikingen kwamen uit Scandinavie - ze ontdekten Amerika 500 jaar voor Columbus!" }),
      // 2. Noorwegen (Land/square) - square far west
      mkLoc("Noorwegen", 63.0, 6.0, { type: "land", fact: "In Noord-Noorwegen kun je het noorderlicht zien!" }),
      // 3. Zweden (Land/square) - square in southern Sweden
      mkLoc("Zweden", 58.5, 14.0, { type: "land", fact: "Zweden heeft het IJshotel: elk jaar opnieuw gebouwd van ijs en sneeuw!" }),
      // 4. Stockholm (Plaats/circle - hoofdstad) - circle on east coast Sweden
      mkLoc("Stockholm", 59.33, 18.07, { type: "capital", capitalOf: "Zweden", fact: "Stockholm is gebouwd op 14 eilanden met 57 bruggen!" }),
      // 5. Oostzee (Water/waves) - waves in southern Baltic
      mkLoc("Oostzee", 56.0, 17.5, { type: "water", fact: "In de winter vriest de Oostzee soms zo hard dat je eroverheen kunt lopen!" }),
      // 6. Helsinki (Plaats/circle - hoofdstad) - circle on south Finnish coast
      mkLoc("Helsinki", 60.17, 24.94, { type: "capital", capitalOf: "Finland", fact: "Helsinki heeft meer sauna's dan auto's!" }),
      // 7. Finland (Land/square) - square in central Finland
      mkLoc("Finland", 63.5, 27.0, { type: "land", fact: "Finland heeft 188.000 meren! Het land van de duizend meren." }),
      // 8. Rusland (Land/square) - square to the east
      mkLoc("Rusland", 62.0, 33.0, { type: "land", fact: "Rusland is zo groot dat het 11 tijdzones heeft!" }),
      // 9. Denemarken (Land/square) - square at bottom left
      mkLoc("Denemarken", 56.0, 10.0, { type: "land", fact: "Denemarken is een van de gelukkigste landen ter wereld!" }),
    ]
  },
  "tegel9": {
    label: "Tegel 9: Spanje en Portugal", description: "Iberisch schiereiland", hw: true, locations: [
      // Positions matched to textbook map (tegel9.jpeg)
      // 1. Frankrijk (Land/square) - square top-right of map
      mkLoc("Frankrijk", 44.0, 1.0, { type: "land", fact: "Frankrijk is het meest bezochte land ter wereld met 90 miljoen toeristen per jaar!" }),
      // 2. Middellandse Zee (Water/waves) - waves south-east of Spain
      mkLoc("Middellandse Zee", 38.5, 2.0, { type: "water", fact: "De Middellandse Zee is bijna helemaal omringd door land - slechts 14 km breed bij Gibraltar!" }),
      // 3. Pyreneeën (Bijzonderheid/star) - star on Spain-France border
      mkLoc("Pyreneeën", 42.7, 0.5, { type: "bijzonderheid", fact: "De Pyreneeën zijn 430 km lang en vormen een natuurlijke grens tussen Spanje en Frankrijk!" }),
      // 4. Spanje (Land/square) - square in central-south Spain
      mkLoc("Spanje", 39.5, -3.0, { type: "land", fact: "Spanje heeft het grootste aantal UNESCO werelderfgoederen in Europa!" }),
      // 5. Barcelona (Plaats/circle) - circle on east coast
      mkLoc("Barcelona", 41.39, 2.17, { type: "city", fact: "De Sagrada Familia in Barcelona wordt al sinds 1882 gebouwd en is nog steeds niet af!" }),
      // 6. Madrid (Plaats/circle - hoofdstad) - circle in central Spain
      mkLoc("Madrid", 40.42, -3.70, { type: "capital", capitalOf: "Spanje", fact: "Madrid ligt precies in het midden van Spanje op een hoogvlakte van 650 meter!" }),
      // 7. Straat van Gibraltar (Water/waves) - waves at bottom between Spain and Africa
      mkLoc("Straat van Gibraltar", 35.97, -5.5, { type: "water", fact: "De Straat van Gibraltar is maar 14 km breed - je kunt Afrika zien vanuit Spanje!" }),
      // 8. Portugal (Land/square) - square on west coast
      mkLoc("Portugal", 39.5, -8.0, { type: "land", fact: "Portugal is het oudste land van Europa met dezelfde grenzen sinds 1249!" }),
      // 9. Lissabon (Plaats/circle - hoofdstad) - circle on Portuguese coast
      mkLoc("Lissabon", 38.72, -9.14, { type: "capital", capitalOf: "Portugal", fact: "Lissabon is ouder dan Rome - al meer dan 3000 jaar oud!" }),
    ]
  },
  "tegel10": {
    label: "Tegel 10: Italië, Griekenland, Cyprus en Istanbul", description: "Zuid-Europa en oostelijk Middellandse Zee", hw: true, locations: [
      // Positions matched to textbook map (tegel10.jpeg)
      // 1. Alpen (Bijzonderheid/star) - star in northern Italy
      mkLoc("Alpen", 46.8, 10.5, { type: "bijzonderheid", fact: "De Alpen zijn het hoogste gebergte van Europa - de Mont Blanc is 4.808 meter hoog!" }),
      // 2. Italië (Land/square) - square in central Italy
      mkLoc("Italië", 42.5, 12.5, { type: "land", fact: "Italië heeft de vorm van een laars! En er zijn meer dan 1500 meren." }),
      // 3. Po (Water/waves) - waves in northern Italy (river)
      mkLoc("Po", 45.0, 10.5, { type: "water", fact: "De Po is de langste rivier van Italië met 652 km!" }),
      // 4. Milaan (Plaats/circle) - circle in northern Italy
      mkLoc("Milaan", 45.46, 9.19, { type: "city", fact: "Milaan is de modehoofstad van de wereld!" }),
      // 5. Rome (Plaats/circle - hoofdstad) - circle in central Italy
      mkLoc("Rome", 41.90, 12.50, { type: "capital", capitalOf: "Italië", fact: "Rome wordt de 'Eeuwige Stad' genoemd en is bijna 3000 jaar oud!" }),
      // 6. Sicilië (Gebied/flag) - flag on Sicily island
      mkLoc("Sicilië", 37.5, 14.0, { type: "gebied", fact: "Sicilië heeft de Etna, de hoogste actieve vulkaan van Europa!" }),
      // 7. Middellandse Zee (Water/waves) - waves south of Italy
      mkLoc("Middellandse Zee", 36.0, 16.0, { type: "water", fact: "De Middellandse Zee is gemiddeld 1.500 meter diep!" }),
      // 8. Griekenland (Land/square) - square in Greece
      mkLoc("Griekenland", 39.0, 22.0, { type: "land", fact: "Griekenland heeft meer dan 6.000 eilanden, maar er wonen mensen op slechts 227!" }),
      // 9. Athene (Plaats/circle - hoofdstad) - circle in southern Greece
      mkLoc("Athene", 37.98, 23.73, { type: "capital", capitalOf: "Griekenland", fact: "Athene is de bakermat van de democratie - al 2.500 jaar geleden!" }),
      // 10. Istanbul (Plaats/circle) - circle at Turkey
      mkLoc("Istanbul", 41.01, 28.98, { type: "city", fact: "Istanbul is de enige stad ter wereld die op twee continenten ligt: Europa en Azië!" }),
      // 11. Cyprus (Land/square) - square on Cyprus island
      mkLoc("Cyprus", 35.13, 33.43, { type: "land", fact: "Cyprus is het derde grootste eiland in de Middellandse Zee!" }),
    ]
  },
  "tegel11": {
    label: "Tegel 11: Noordoost-Europa", description: "Baltische staten, Rusland en omgeving", hw: true, locations: [
      // Positions matched to textbook map (tegel11.jpg.jpeg)
      // 1. Kaspische Zee (Water/waves) - waves far south-east
      mkLoc("Kaspische Zee", 42.0, 50.0, { type: "water", fact: "De Kaspische Zee is eigenlijk het grootste meer ter wereld - groter dan heel Duitsland!" }),
      // 2. Oostzee (Water/waves) - waves far west
      mkLoc("Oostzee", 57.5, 19.5, { type: "water", fact: "De Oostzee is een van de minst zoute zeeën ter wereld!" }),
      // 3. Zwarte Zee (Water/waves) - waves far south
      mkLoc("Zwarte Zee", 43.0, 35.0, { type: "water", fact: "De Zwarte Zee heet zo omdat het water heel donker lijkt bij storm!" }),
      // 4. Wolga (Water/waves) - waves in central Russia
      mkLoc("Wolga", 54.0, 45.0, { type: "water", fact: "De Wolga is de langste rivier van Europa met 3.530 km!" }),
      // 5. Litouwen (Land/square) - square on Lithuania
      mkLoc("Litouwen", 55.5, 24.0, { type: "land", fact: "Litouwen heeft het geografische middelpunt van Europa!" }),
      // 6. Letland (Land/square) - square on Latvia
      mkLoc("Letland", 57.0, 25.0, { type: "land", fact: "Letland heeft meer dan 12.000 rivieren en 3.000 meren!" }),
      // 7. Estland (Land/square) - square on Estonia
      mkLoc("Estland", 58.8, 25.5, { type: "land", fact: "Estland is het meest digitale land ter wereld - je kunt er zelfs online stemmen!" }),
      // 8. Rusland (Land/square) - square in central Russia
      mkLoc("Rusland", 55.0, 38.0, { type: "land", fact: "Rusland is zo groot dat het 11 tijdzones heeft!" }),
      // 9. Sint-Petersburg (Plaats/circle) - circle on north-west Russia
      mkLoc("Sint-Petersburg", 59.93, 30.32, { type: "city", fact: "Sint-Petersburg heeft de Hermitage, een van de grootste musea ter wereld met 3 miljoen kunstwerken!" }),
      // 10. Moskou (Plaats/circle - hoofdstad) - circle in western Russia
      mkLoc("Moskou", 55.76, 37.62, { type: "capital", capitalOf: "Rusland", fact: "De metro van Moskou is zo mooi dat het een ondergronds paleis wordt genoemd!" }),
      // 11. Oekraïne (Land/square) - square on Ukraine
      mkLoc("Oekraïne", 49.0, 32.0, { type: "land", fact: "Oekraïne is het grootste land dat helemaal in Europa ligt!" }),
      // 12. Kaukasus (Bijzonderheid/star) - star in south between Black and Caspian seas
      mkLoc("Kaukasus", 42.5, 44.5, { type: "bijzonderheid", fact: "De Kaukasus heeft de hoogste berg van Europa: de Elbrus (5.642 meter)!" }),
      // 13. Oeralgebergte (Bijzonderheid/star) - star far north-east
      mkLoc("Oeralgebergte", 58.0, 59.0, { type: "bijzonderheid", fact: "Het Oeralgebergte is de grens tussen Europa en Azië - 2.500 km lang!" }),
      // 14. Wit-Rusland (Land/square) - square on Belarus
      mkLoc("Wit-Rusland", 53.5, 28.0, { type: "land", fact: "Wit-Rusland heet officieel Belarus en heeft het grootste oerbos van Europa: Bialowieza!" }),
    ]
  }
};

const EXTRAS = {
  "europa": {
    label: "Europa Hoofdsteden", description: "Hoofdsteden van heel Europa", locations: [
      mkLoc("Lissabon", 38.72, -9.14, { type: "capital", capitalOf: "Portugal", fact: "Lissabon is ouder dan Rome!" }),
      mkLoc("Madrid", 40.42, -3.70, { type: "capital", capitalOf: "Spanje", fact: "Madrid heeft het oudste restaurant ter wereld: Botin, open sinds 1725!" }),
      mkLoc("Parijs", 48.86, 2.35, { type: "capital", capitalOf: "Frankrijk", fact: "De Eiffeltoren wordt elke 7 jaar opnieuw geverfd - 60 ton verf!" }),
      mkLoc("Londen", 51.51, -0.13, { type: "capital", capitalOf: "VK", fact: "In Londen rijden rode dubbeldekker bussen al meer dan 60 jaar!" }),
      mkLoc("Amsterdam", 52.37, 4.90, { type: "capital", capitalOf: "Nederland", fact: "Amsterdam heeft meer dan 1.500 bruggen - meer dan Venetie!" }),
      mkLoc("Brussel", 50.85, 4.35, { type: "capital", capitalOf: "Belgie", fact: "Brussel heeft meer dan 2.000 chocoladewinkels!" }),
      mkLoc("Berlijn", 52.52, 13.41, { type: "capital", capitalOf: "Duitsland", fact: "Berlijn is 9x zo groot als Parijs maar heeft minder inwoners!" }),
      mkLoc("Rome", 41.90, 12.50, { type: "capital", capitalOf: "Italie", fact: "Er worden elke dag 3.000 euro aan munten uit de Trevi-fontein gehaald!" }),
      mkLoc("Wenen", 48.21, 16.37, { type: "capital", capitalOf: "Oostenrijk", fact: "Wenen werd 10 jaar op rij verkozen tot de meest leefbare stad!" }),
      mkLoc("Praag", 50.08, 14.44, { type: "capital", capitalOf: "Tsjechie", fact: "De Praagse astronomische klok werkt al sinds 1410!" }),
      mkLoc("Warschau", 52.23, 21.01, { type: "capital", capitalOf: "Polen", fact: "Warschau werd in WO2 bijna helemaal verwoest en toen exact herbouwd!" }),
      mkLoc("Kopenhagen", 55.68, 12.57, { type: "capital", capitalOf: "Denemarken", fact: "Kopenhagen wil de eerste CO2-neutrale hoofdstad zijn!" }),
      mkLoc("Stockholm", 59.33, 18.07, { type: "capital", capitalOf: "Zweden", fact: "Stockholm heeft een metro met stations die eruitzien als grotten!" }),
      mkLoc("Oslo", 59.91, 10.75, { type: "capital", capitalOf: "Noorwegen", fact: "Oslo's opera heeft een dak waar je overheen kunt lopen!" }),
      mkLoc("Helsinki", 60.17, 24.94, { type: "capital", capitalOf: "Finland", fact: "Finland heeft meer sauna's dan auto's!" }),
      mkLoc("Athene", 37.98, 23.73, { type: "capital", capitalOf: "Griekenland", fact: "Athene is vernoemd naar de godin Athena!" }),
      mkLoc("Boedapest", 47.50, 19.04, { type: "capital", capitalOf: "Hongarije", fact: "Boedapest is eigenlijk twee steden: Buda en Pest, gescheiden door de Donau!" }),
      mkLoc("Dublin", 53.35, -6.26, { type: "capital", capitalOf: "Ierland", fact: "In Dublin is er een brug die maar 1x per dag opengaat!" }),
      mkLoc("Bern", 46.95, 7.45, { type: "capital", capitalOf: "Zwitserland", fact: "Bern is vernoemd naar een beer - het wapen van de stad is ook een beer!" }),
    ]
  }
};

let customSets = JSON.parse(localStorage.getItem('aa-custom-sets') || '[]');

function saveCustomSets() {
  localStorage.setItem('aa-custom-sets', JSON.stringify(customSets));
}
