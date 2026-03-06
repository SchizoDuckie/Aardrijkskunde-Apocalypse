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
