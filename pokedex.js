/**
 * Pokedex Data
 * 	N in pokedex
 *	name
 * 	Type
 * 	Species
 * 	Height
 * 	Weight
 * 	Abilities
 *  Flavor
 * 
 * Pokedex Stats
 * 	hp
 * 	atk
 * 	def
 * 	sp atk
 * 	sp def
 * 	speed
 * 	total
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentPokemonName = 'pikachu';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constants
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const url = (poke) => 'https://pokeapi.co/api/v2/pokemon/' + (poke);
const GBCnl = "";	// Game Boy Console new line character.
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const loadingTxt = document.getElementById('loading-text');
const pokeImg = document.getElementById('poke-img');
const pokeId = document.getElementById('poke-id');
const pokeName = document.getElementById('poke-name');
const pokeSpecies = document.getElementById('poke-species');
const pokeHeight = document.getElementById('poke-height');
const pokeWeight = document.getElementById('poke-weight');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
searchBtn.addEventListener('click', async () => {
	loadingTxt.innerText = 'Loading';
	let dotsInterv = setInterval(() => {
		if(loadingTxt.innerText.length === 13) loadingTxt.innerText = 'Loading';
		loadingTxt.innerText += ' .';
	}, 250);
	let data = await getPokemonData(searchBar.value.toLowerCase())
				.then((res) => {
					if (res === null)
						loadingTxt.innerText = 'Not Found';
					else
						loadingTxt.innerText = 'Ready';

					clearInterval(dotsInterv);
					return res;
				})
				.catch((err) => {loadingTxt.innerText = 'Error'; console.log(err);});
	console.log(data);
	updatePokedexEntry(data);
});

async function getPokemonData(pokeName) {
	let pokemon = await fetch(url(pokeName)).then((res) => {
		if (res.ok)	return res.json();
		else {
			// print error in some of the small displays
			
			return null;
		}
	});
	if (pokemon === null) return pokemon;

	let species = await fetch(pokemon.species.url).then((res) => res.json());

	let processedData = processData(pokemon, species);
	let processedStats = processStats(pokemon);
	
	return [processedData, processedStats];
}

function processData(pokemonObject, species) {
	return {
		id: pokemonObject.id,
		name: pokemonObject.name,
		types: processTypes(pokemonObject.types),
		species: processSpecies(species),
		height: parseInt(pokemonObject.height),
		weight: parseInt(pokemonObject.weight),
		abilities: processAbilities(pokemonObject.abilities),
		sprite: pokemonObject.sprites.front_default,
		flavor: processFlavors(species.flavor_text_entries),
	}
}

function processTypes(types){
	let processedTypes = []
	types.forEach(t => {
		processedTypes.push(t.type.name);
	});
	return processedTypes;
}

function processSpecies(species){
	let s = species.genera.find((s) => s.language.name === 'en');
	return s.genus;
}

function processAbilities(abilities){
	let abs = [];
	abilities.forEach((a) => {
		abs.push({ability: a.ability.name, isHidden: a.is_hidden});
	});
	return abs;
}

function processStats(pokemonObject){
	let stats = [];
	pokemonObject.stats.forEach((s) => {
		stats.push([s.base_stat, s.stat.name]);
	});
	return stats;
}

function processFlavors(flavors) {
	// Red should be the first one if pokemon is in Pokemon Red, but just in case...
	for (let i = 0; i < flavors.length; i++) {
		if (flavors[i].language.name === 'en' && flavors[i].version.name === 'red')
			return flavors[i].flavor_text;
	}
	// If pokemon is not in Pokemon Red just return the first flavor
	return flavors[0].flavor_text;
}

function updatePokedexEntry(data) {
	pokeId.innerText = formatId(data[0].id);
	pokeImg.style.backgroundImage = `url(${data[0].sprite})`;
	pokeName.innerText = data[0].name.toUpperCase();

	// species always include a Pokémon at the end (e.g. Flame Pokemon, Seed Pokemon, etc.)
	pokeSpecies.innerText = data[0].species.replace(' Pokémon', '').toUpperCase();

	// 1 foot = 12 inches, 1 inch = 2.54 cm. Pokeapi gives height in decimiters
	pokeHeight.innerText = formatHeight(data[0].height);

	// 1 pound = 2.2046 kg .Pokeapi gives weight in hectograms
	// it seems the coma is just decoration: https://www.youtube.com/watch?v=3npx3FFvo-I
	// every weight is X.0 lb so i'll do it like that
	pokeWeight.innerText = formatWeight(data[0].weight);
}

function formatId(id) {
	// equal length strings
	let fid = 'No. ';

	if (id < 10)
		fid += '00';
	else if (id < 100)
		fid += '0';

	return fid + id; 
}

function formatHeight (decimiters) {
	let absolute = Math.ceil((decimiters * 10) / 2.54);
	let foot = Math.floor(absolute / 12);
	let inches = absolute - (foot * 12);
	
	return `${foot}' ${inches}''`;
}

function formatWeight (hectograms) {
	let weight = Math.ceil(hectograms * 0.22046);
	return `${weight}.0 lb`;
}


