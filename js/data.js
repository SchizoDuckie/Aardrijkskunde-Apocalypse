// ============================================================
// DATA & HELPERS
// ============================================================
function mkId(n) { return n.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).slice(2, 6) }
function mkLoc(name, lat, lng, tags = {}) { return { id: mkId(name), name, lat: +lat, lng: +lng, tags } }
function pick(a) { return a[Math.floor(Math.random() * a.length)] }

const HOMEWORK = {
  "tegel1": {
    label: "Groep 8 tegel 1: De wereldkaart", description: "Continenten, oceanen en denkbeeldige lijnen", hw: true, locations: [
      // Positions matched to textbook map (tegel1.jpg)
      // 1. Noordpoolcirkel (Bijzonderheid/lijn) - label sits above Scandinavia on the line
      mkLoc("Noordpoolcirkel", 66.5, 15.0, { type: "bijzonderheid", fact: "Boven de Noordpoolcirkel gaat de zon in de zomer soms wekenlang niet onder!" }),
      // 2. Indische Oceaan (Water/waves) - waves just south of the equator, between Africa and Australia
      mkLoc("Indische Oceaan", -8.0, 75.0, { type: "water", fact: "De Indische Oceaan is de warmste oceaan van de wereld!" }),
      // 3. Zuid-Amerika (Gebied/flag) - flag on South America
      mkLoc("Zuid-Amerika", -15.0, -60.0, { type: "gebied", fact: "In Zuid-Amerika ligt de Amazone, het grootste regenwoud ter wereld!" }),
      // 4. Azie (Gebied/flag) - flag on Asia
      mkLoc("Azie", 50.0, 90.0, { type: "gebied", fact: "Azie is het grootste continent - er woont meer dan de helft van alle mensen op aarde!" }),
      // 5. Grote (of Stille) Oceaan (Water/waves) - waves west of South America
      mkLoc("Grote Oceaan", -10.0, -140.0, { type: "water", fact: "De Grote Oceaan is zo groot dat alle continenten er samen in zouden passen!" }),
      // 6. Europa (Gebied/flag) - flag on Europe
      mkLoc("Europa", 50.0, 15.0, { type: "gebied", fact: "Europa is na Australie het kleinste continent, maar heeft wel meer dan 40 landen!" }),
      // 7. Antarctica (Gebied/flag) - flag on Antarctica
      mkLoc("Antarctica", -80.0, 20.0, { type: "gebied", fact: "In Antarctica ligt 90% van al het ijs op aarde!" }),
      // 8. Evenaar (Bijzonderheid/lijn) - line through Africa/South America/Asia
      mkLoc("Evenaar", 0.0, 20.0, { type: "bijzonderheid", fact: "Op de evenaar duren dag en nacht altijd precies 12 uur!" }),
      // 9. Afrika (Gebied/flag) - flag in northern Africa (Sahara), above the equator line
      mkLoc("Afrika", 18.0, 20.0, { type: "gebied", fact: "Afrika is het enige continent dat in alle vier de windrichtingen door de evenaar en beide keerkringen wordt gesneden!" }),
      // 10. Noord-Amerika (Gebied/flag) - flag on North America
      mkLoc("Noord-Amerika", 45.0, -100.0, { type: "gebied", fact: "In Noord-Amerika ligt de Grand Canyon, die wel 1,6 km diep is!" }),
      // 11. Atlantische Oceaan (Water/waves) - waves in the Caribbean, between North and South America
      mkLoc("Atlantische Oceaan", 18.0, -70.0, { type: "water", fact: "De Atlantische Oceaan wordt elk jaar een paar centimeter breder!" }),
      // 12. Zuidpoolcirkel (Bijzonderheid/lijn) - line around Antarctica
      mkLoc("Zuidpoolcirkel", -66.5, 0.0, { type: "bijzonderheid", fact: "Onder de Zuidpoolcirkel is het 's winters wekenlang aaneengesloten donker!" }),
      // 13. Noordelijke IJszee (Water/waves) - waves above Novaya Zemlya/northern Russia
      mkLoc("Noordelijke IJszee", 81.0, 50.0, { type: "water", fact: "De Noordelijke IJszee is de kleinste en ondiepste oceaan ter wereld!" }),
      // 14. Oceanie (Gebied/flag) - flag on islands east of Australia (between Australia and New Zealand)
      mkLoc("Oceanie", -20.0, 165.0, { type: "gebied", fact: "Oceanie bestaat uit Australie en duizenden kleine eilanden in de Grote Oceaan!" }),
    ]
  },
  "tegel2": {
    label: "Groep 8 tegel 2: Het Midden-Oosten", description: "Landen, hoofdsteden, zeeen en gebieden", hw: true, theme: "bezorg", locations: [
      // Positions matched to textbook map (groep8-tegel2.jpg)
      // Cities/capitals use real coordinates; other markers were measured on the photo and
      // converted to lat/lng with a projection fit on 17 control points (cities + coastline).
      // 1. Mekka (Plaats/dot) - near the Red Sea coast
      mkLoc("Mekka", 21.42, 39.83, { type: "city", dish: "een doos verse dadels", dishEn: "a box of fresh dates", emoji: "🌴", dishInfo: "Dadels zijn zoete vruchten van de dadelpalm. In Saudi-Arabie eet je ze bij elk bezoek!", dishInfoEn: "Dates are sweet fruits from the date palm. In Saudi Arabia they're served at every visit!", fact: "Elk jaar komen er meer dan 2 miljoen pelgrims naar Mekka voor de hadj!" }),
      // 2. Dubai (Plaats/dot) - on the Gulf coast of the Emirates
      mkLoc("Dubai", 25.20, 55.27, { type: "city", dish: "een reep Dubai-chocolade", dishEn: "a bar of Dubai chocolate", emoji: "🍫", dishInfo: "Dubai-chocolade is chocola gevuld met pistache en knapperige deegdraadjes. Hij ging viraal op TikTok!", dishInfoEn: "Dubai chocolate is filled with pistachio and crunchy pastry threads. It went viral on TikTok!", fact: "In Dubai staat de Burj Khalifa, met 828 meter het hoogste gebouw ter wereld!" }),
      // 3. Irak (Land/triangle) - western Iraq
      mkLoc("Irak", 33.93, 41.94, { type: "land", dish: "een masgouf-vis", dishEn: "a masgouf fish", emoji: "🐟", dishInfo: "Masgouf is een hele vis uit de Tigris, opengesneden en urenlang naast een houtvuur gegrild. Het nationale gerecht van Irak!", dishInfoEn: "Masgouf is a whole fish from the Tigris, cut open and grilled for hours next to a wood fire. Iraq's national dish!", fact: "In Irak lag Mesopotamie, waar 5000 jaar geleden het schrift werd uitgevonden!" }),
      // 4. Turkije (Land/triangle) - central Anatolia, below Ankara
      mkLoc("Turkije", 38.77, 33.69, { type: "land", dish: "een doos Turks fruit", dishEn: "a box of Turkish delight", emoji: "🍬", dishInfo: "Turks fruit (lokum) is een zacht, taai snoepje met poedersuiker. Het bestaat al meer dan 200 jaar!", dishInfoEn: "Turkish delight (lokum) is a soft, chewy sweet covered in powdered sugar. It's over 200 years old!", fact: "Turkije ligt voor 97% in Azie en voor 3% in Europa!" }),
      // 5. Saudi-Arabie (Land/triangle) - western Saudi-Arabia
      mkLoc("Saudi-Arabië", 25.47, 40.80, { type: "land", dish: "een pan kabsa", dishEn: "a pot of kabsa", emoji: "🍗", dishInfo: "Kabsa is rijst met kip en veel kruiden, het nationale gerecht van Saudi-Arabie. Je eet het van een grote schaal met z'n allen!", dishInfoEn: "Kabsa is rice with chicken and lots of spices, Saudi Arabia's national dish. Everyone eats from one big platter!", fact: "Saudi-Arabie is meer dan 50 keer zo groot als Nederland en heeft geen enkele rivier!" }),
      // 6. Israel (Land/triangle) - just south of Jerusalem
      mkLoc("Israël", 31.07, 34.91, { type: "land", dish: "een bak hummus", dishEn: "a tub of hummus", emoji: "🥣", dishInfo: "Hummus is een smeuige dip van gepureerde kikkererwten met sesampasta. Je dipt er brood in!", dishInfoEn: "Hummus is a creamy dip of mashed chickpeas and sesame paste. You dip bread in it!", fact: "In Israel ligt de Dode Zee, het laagste punt op land: 430 meter onder zeeniveau!" }),
      // 7. Bosporus (Zee/waves) - strait at Istanbul; marker sits in the Black Sea just above the
      // northern mouth, because at game zoom the strait itself is hidden under the Istanbul dot
      mkLoc("Bosporus", 41.75, 29.40, { type: "water", dish: "een balik ekmek", dishEn: "a balik ekmek", emoji: "🥪", dishInfo: "Balik ekmek betekent 'vis-brood': een broodje met gegrilde makreel, verkocht vanaf bootjes aan de Bosporus!", dishInfoEn: "Balik ekmek means 'fish bread': a sandwich with grilled mackerel, sold from boats on the Bosporus!", fact: "De Bosporus is op het smalste punt maar 700 meter breed en scheidt Europa van Azie!" }),
      // 8. Syrie (Land/triangle) - western Syria
      mkLoc("Syrië", 34.89, 37.27, { type: "land", dish: "een rol shoarma", dishEn: "a shawarma wrap", emoji: "🌯", dishInfo: "Shoarma is vlees dat aan een draaiende spies wordt gegrild en in dunne plakjes wordt gesneden!", dishInfoEn: "Shawarma is meat grilled on a rotating spit and sliced into thin strips!", fact: "Damascus in Syrie is een van de oudste steden ter wereld - al meer dan 4000 jaar bewoond!" }),
      // 9. Westelijke Jordaanoever (Streek/gebied pin) - pin tip on northern West Bank
      mkLoc("Westelijke Jordaanoever", 32.25, 35.25, { type: "gebied", dish: "een plaat knafeh", dishEn: "a tray of knafeh", emoji: "🍰", dishInfo: "Knafeh is een warm toetje van smeltende kaas onder knapperige deegdraadjes met suikersiroop. De stad Nablus is er beroemd om!", dishInfoEn: "Knafeh is a warm dessert of melting cheese under crunchy pastry threads with sugar syrup. The city of Nablus is famous for it!", fact: "De Westelijke Jordaanoever is ongeveer 6 keer zo klein als Nederland!" }),
      // 10. Riad (Hoofdstad/square) - central Saudi-Arabia
      mkLoc("Riad", 24.71, 46.68, { type: "capital", capitalOf: "Saudi-Arabië", dish: "een kan Arabische koffie", dishEn: "a pot of Arabic coffee", emoji: "☕", dishInfo: "Arabische koffie (gahwa) is lichtgekleurde koffie met kardemom, geschonken in piepkleine kopjes zonder oor!", dishInfoEn: "Arabic coffee (gahwa) is light coffee with cardamom, poured into tiny cups without handles!", fact: "In Riad kan het in de zomer wel 50 graden worden!" }),
      // 11. Ankara (Hoofdstad/square) - central Turkey
      mkLoc("Ankara", 39.93, 32.86, { type: "capital", capitalOf: "Turkije", dish: "een döner kebab", dishEn: "a döner kebab", emoji: "🥙", dishInfo: "Döner betekent 'draaiend' in het Turks: het vlees draait rond langs het vuur!", dishInfoEn: "Döner means 'turning' in Turkish: the meat turns round and round next to the fire!", fact: "Ankara is pas sinds 1923 de hoofdstad - daarvoor was dat Istanbul!" }),
      // 12. Gazastrook (Streek/gebied pin) - pin tip on the Gaza coast
      mkLoc("Gazastrook", 31.45, 34.40, { type: "gebied", dish: "een pan maftoul", dishEn: "a pot of maftoul", emoji: "🍲", dishInfo: "Maftoul zijn met de hand gerolde balletjes van tarwe, een soort grote couscous, met kip en kikkererwten!", dishInfoEn: "Maftoul are hand-rolled wheat balls, like big couscous, served with chicken and chickpeas!", fact: "De Gazastrook is maar 41 km lang, maar er wonen ruim 2 miljoen mensen!" }),
      // 13. Jeruzalem (Hoofdstad/square) - between Gaza and the West Bank
      mkLoc("Jeruzalem", 31.77, 35.21, { type: "capital", capitalOf: "Israël", dish: "een Jeruzalem-bagel", dishEn: "a Jerusalem bagel", emoji: "🥯", dishInfo: "De Jeruzalem-bagel is een lang, ovaal broodje met sesamzaad. Je eet hem met een zakje kruiden (za'atar)!", dishInfoEn: "The Jerusalem bagel is a long, oval bread with sesame seeds. You eat it with a little bag of herbs (za'atar)!", fact: "Jeruzalem is heilig voor drie godsdiensten: jodendom, christendom en islam!" }),
      // 14. Teheran (Hoofdstad/square) - just south of the Caspian Sea
      mkLoc("Teheran", 35.69, 51.39, { type: "capital", capitalOf: "Iran", dish: "een bak saffraan-ijs", dishEn: "a tub of saffron ice cream", emoji: "🍨", dishInfo: "Bastani is Perzisch ijs met saffraan, rozenwater en pistache. Saffraan is het duurste kruid ter wereld!", dishInfoEn: "Bastani is Persian ice cream with saffron, rosewater and pistachio. Saffron is the most expensive spice in the world!", fact: "Teheran ligt aan de voet van bergen van bijna 4000 meter hoog!" }),
      // 15. Istanbul (Plaats/dot) - on the Bosporus
      mkLoc("Istanbul", 41.01, 28.98, { type: "city", dish: "een zak simits", dishEn: "a bag of simits", emoji: "🥨", dishInfo: "Een simit is een knapperige broodring met sesamzaad. In Istanbul verkopen straatventers ze vanaf karretjes!", dishInfoEn: "A simit is a crunchy bread ring with sesame seeds. In Istanbul street sellers sell them from carts!", fact: "Istanbul is de enige wereldstad die op twee continenten ligt: Europa en Azie!" }),
      // 16. Iran (Land/triangle) - central Iran
      mkLoc("Iran", 32.47, 53.50, { type: "land", dish: "een pan tahdig", dishEn: "a pot of tahdig", emoji: "🍚", dishInfo: "Tahdig betekent 'bodem van de pan': de knapperige, goudbruine rijstkorst. In Iran vecht iedereen erom!", dishInfoEn: "Tahdig means 'bottom of the pot': the crispy, golden rice crust. In Iran everyone fights over it!", fact: "Iran heette vroeger Perzie - daar komen de beroemde Perzische tapijten vandaan!" }),
      // 17. Het Midden-Oosten (Streek/gebied pin) - pin tip in southern Iraq, north of Kuwait
      mkLoc("Het Midden-Oosten", 30.66, 46.51, { type: "gebied", dish: "een mega-mezzeschotel", dishEn: "a mega mezze platter", emoji: "🫓", dishInfo: "Mezze zijn allemaal kleine hapjes tegelijk op tafel, zoals hummus, falafel, olijven en brood. Iedereen pakt wat!", dishInfoEn: "Mezze are lots of small dishes on the table at once, like hummus, falafel, olives and bread. Everyone grabs some!", fact: "In het Midden-Oosten zit bijna de helft van alle olie op aarde!" }),
      // 18. Perzische Golf (Zee/waves) - northern part of the Gulf
      mkLoc("Perzische Golf", 28.39, 49.83, { type: "water", dish: "een emmer garnalen", dishEn: "a bucket of shrimp", emoji: "🍤", dishInfo: "In de Perzische Golf wordt veel op garnalen gevist. In Bahrein en Koeweit eten ze die met gekruide rijst!", dishInfoEn: "Lots of shrimp are caught in the Persian Gulf. In Bahrain and Kuwait they eat them with spiced rice!", fact: "De Perzische Golf is gemiddeld maar 50 meter diep - ondieper dan de meeste zeeen!" }),
      // 19. Bagdad (Hoofdstad/square) - central Iraq
      mkLoc("Bagdad", 33.31, 44.36, { type: "capital", capitalOf: "Irak", dish: "een doos kleicha-koekjes", dishEn: "a box of kleicha cookies", emoji: "🍪", dishInfo: "Kleicha zijn de nationale koekjes van Irak, gevuld met dadels of noten. Ze worden gebakken voor feestdagen!", dishInfoEn: "Kleicha are Iraq's national cookies, filled with dates or nuts. They're baked for holidays!", fact: "Ruim 1000 jaar geleden was Bagdad de grootste stad ter wereld!" }),
      // 20. Rode Zee (Zee/waves) - Red Sea between Egypt and Saudi-Arabia
      mkLoc("Rode Zee", 24.64, 36.56, { type: "water", dish: "een zak falafel", dishEn: "a bag of falafel", emoji: "🧆", dishInfo: "Falafel zijn gefrituurde balletjes van kikkererwten of tuinbonen. In Egypte heten ze ta'ameya!", dishInfoEn: "Falafel are fried balls of chickpeas or fava beans. In Egypt they're called ta'ameya!", fact: "De Rode Zee is een van de zoutste zeeen ter wereld en wordt elk jaar een beetje breder!" }),
    ]
  },
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

// Dutch country name -> Natural Earth name in world-atlas, used to glow a country's outline
const COUNTRY_OUTLINES = {
  "Noorwegen": "Norway", "Zweden": "Sweden", "Denemarken": "Denmark", "Finland": "Finland", "IJsland": "Iceland",
  "Polen": "Poland", "Rusland": "Russia", "Frankrijk": "France", "Spanje": "Spain", "Portugal": "Portugal",
  "Italië": "Italy", "Italie": "Italy", "Griekenland": "Greece", "Cyprus": "Cyprus",
  "Litouwen": "Lithuania", "Letland": "Latvia", "Estland": "Estonia", "Oekraïne": "Ukraine", "Wit-Rusland": "Belarus",
  "Turkije": "Turkey", "Irak": "Iraq", "Iran": "Iran", "Saudi-Arabië": "Saudi Arabia", "Israël": "Israel", "Syrië": "Syria",
  "Nederland": "Netherlands", "België": "Belgium", "Belgie": "Belgium", "Duitsland": "Germany", "Oostenrijk": "Austria",
  "Zwitserland": "Switzerland", "Tsjechië": "Czechia", "Hongarije": "Hungary", "Ierland": "Ireland", "VK": "United Kingdom",
  "Verenigd Koninkrijk": "United Kingdom", "Libanon": "Lebanon", "Jordanië": "Jordan", "Egypte": "Egypt", "Koeweit": "Kuwait",
};

let customSets =JSON.parse(localStorage.getItem('aa-custom-sets') || '[]');

function saveCustomSets() {
  localStorage.setItem('aa-custom-sets', JSON.stringify(customSets));
}
