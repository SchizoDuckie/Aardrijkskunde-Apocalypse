# Tegel-foto omzetten naar game data

Dit document beschrijft hoe je een foto van een aardrijkskunde-tegel (huiswerk oefenblad) omzet naar een dataset voor Aardrijkskunde Apocalyps.

## Stap 1: Foto lezen

Elke tegel-foto bevat:
- **Titel** bovenaan: "Tegel X: [Regio naam]"
- **Legenda** met icoon-types (zie hieronder)
- **Kaart** met genummerde symbolen
- **Lijst** onderaan met genummerde namen en hun type tussen haakjes

## Stap 2: Types bepalen

De legenda op elke tegel gebruikt deze symbolen. Map ze naar het `type` veld:

| Symbool op tegel | Beschrijving | `type` waarde | Icoon in game |
|---|---|---|---|
| `■` (gekleurd vierkant) | Land | `"land"` | Paars vierkantje |
| `●` (gevulde cirkel) | Plaats (stad) | `"city"` | Blauw rondje |
| `●` (gevulde cirkel) + "(hoofdstad van X)" | Hoofdstad | `"capital"` | Roze rondje, voeg `capitalOf: "X"` toe |
| `■` (groen/vlag) | Gebied | `"gebied"` | Vlag-icoon |
| `≈` (golfjes) | Water (zee, rivier, meer) | `"water"` | Golfjes-icoon |
| `★` (ster) | Bijzonderheid (gebergte, straat, etc.) | `"bijzonderheid"` | Ster-icoon |

## Stap 3: Coordinaten bepalen

Gebruik de **echte geografische coordinaten** van elke locatie, NIET de pixel-positie op de kaart-afbeelding.

- **Landen**: gebruik het geografische middelpunt, maar verschuif als de tegel-kaart het land maar deels toont (gebruik dan het midden van het zichtbare deel)
- **Steden/hoofdsteden**: gebruik de exacte lat/lng (bv. Wikipedia)
- **Zeeën/oceanen**: gebruik een centraal punt dat op de tegel-kaart zichtbaar is
- **Rivieren**: gebruik een punt halverwege de rivier
- **Gebergten**: gebruik een centraal punt van de bergketen

## Stap 4: Facts schrijven

Elk item krijgt een `fact` - een leuk feitje voor kinderen (groep 7-8 / brugklas niveau):
- Max 1 zin
- Bevat een getal of vergelijking ("groter dan...", "meer dan X...")
- Moet wow-factor hebben voor een kind van 10-13 jaar

## Stap 5: Code genereren

Voeg een nieuw blok toe aan het `HOMEWORK` object in `js/data.js`. Gebruik dit exacte format:

```javascript
"tegelX": {
  label: "Tegel X: [Titel van de tegel]", description: "[Korte beschrijving]", hw: true, locations: [
    // Positions matched to textbook map (tegelX.jpeg)
    // [nummer]. [Naam] ([Type]) - [positie op kaart]
    mkLoc("[Naam]", [lat], [lng], { type: "[type]", fact: "[Leuk feitje]" }),
    // Voor hoofdsteden voeg capitalOf toe:
    mkLoc("[Naam]", [lat], [lng], { type: "capital", capitalOf: "[Land]", fact: "[Leuk feitje]" }),
  ]
},
```

### Voorbeeld compleet item (Tegel 9):

```javascript
"tegel9": {
  label: "Tegel 9: Spanje en Portugal", description: "Iberisch schiereiland", hw: true, locations: [
    mkLoc("Frankrijk", 44.0, 1.0, { type: "land", fact: "Frankrijk is het meest bezochte land ter wereld met 90 miljoen toeristen per jaar!" }),
    mkLoc("Middellandse Zee", 38.5, 2.0, { type: "water", fact: "De Middellandse Zee is bijna helemaal omringd door land!" }),
    mkLoc("Pyreneeën", 42.7, 0.5, { type: "bijzonderheid", fact: "De Pyreneeën zijn 430 km lang!" }),
    mkLoc("Spanje", 39.5, -3.0, { type: "land", fact: "Spanje heeft het grootste aantal UNESCO werelderfgoederen in Europa!" }),
    mkLoc("Barcelona", 41.39, 2.17, { type: "city", fact: "De Sagrada Familia wordt al sinds 1882 gebouwd!" }),
    mkLoc("Madrid", 40.42, -3.70, { type: "capital", capitalOf: "Spanje", fact: "Madrid ligt precies in het midden van Spanje!" }),
    mkLoc("Straat van Gibraltar", 35.97, -5.5, { type: "water", fact: "De Straat van Gibraltar is maar 14 km breed!" }),
    mkLoc("Portugal", 39.5, -8.0, { type: "land", fact: "Portugal is het oudste land van Europa!" }),
    mkLoc("Lissabon", 38.72, -9.14, { type: "capital", capitalOf: "Portugal", fact: "Lissabon is ouder dan Rome!" }),
  ]
},
```

## Checklist voor de LLM

1. Lees de titel van de tegel
2. Lees alle genummerde items en hun type (tussen haakjes)
3. Bepaal het juiste `type` veld per item (zie tabel)
4. Als er "(hoofdstad van X)" staat, gebruik `type: "capital"` EN voeg `capitalOf: "X"` toe
5. Zoek de echte geografische coordinaten op (NIET schatten van de afbeelding)
6. Schrijf een kindvriendelijk fact per locatie
7. Genereer het JavaScript-blok in exact het format hierboven
8. Voeg het toe aan het `HOMEWORK` object in `js/data.js` (voor de afsluitende `};`)
9. Gebruik de bestandsnaam van de foto als key (bv. `"tegel12"` voor `tegel12.jpeg`)

## Beschikbare types samenvatting

```
"land"           - Een land (vierkant icoon)
"city"           - Een stad (rond icoon, blauw)
"capital"        - Een hoofdstad (rond icoon, roze) - vereist extra veld: capitalOf
"water"          - Water: zee, rivier, meer, straat (golf icoon)
"gebied"         - Een gebied/regio (vlag icoon)
"bijzonderheid"  - Gebergte, straat, bijzonder punt (ster icoon)
```

## Functie referentie

```javascript
mkLoc(name, lat, lng, tags)
// name: string - Nederlandse naam zoals op de tegel
// lat: number - breedtegraad (positief = noord, negatief = zuid)
// lng: number - lengtegraad (positief = oost, negatief = west)
// tags: object met:
//   type: string (verplicht) - een van bovenstaande types
//   capitalOf: string (alleen bij type "capital") - naam van het land
//   fact: string (optioneel maar sterk aanbevolen) - leuk feitje
```
