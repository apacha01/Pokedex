/**
 * Pokedex Data
 * 	National N
 * 	Type
 * 	Species
 * 	Height
 * 	Weight
 * 	Abilities
 * 	Local N -> (dropdown list for each game)
 * 
 * Pokedex Stats
 * 	hp
 * 	atk
 * 	def
 * 	sp atk
 * 	sp def
 * 	speed
 * 	total
 * 
 * Pokedex Evo
 * 	Next Pokemon -> trigger of evo
 * 	repeat whole chain
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentPokemonName = 'pikachu'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constants
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const url = (poke) => 'https://pokeapi.co/api/v2/pokemon/' + (poke);
const searchBtn = document.getElementById('search-btn');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
searchBtn.addEventListener('click', async () => {
	let input = document.getElementById('input-pokemon');
	let pokemon = input.value.toLowerCase();
	if (pokemon !== currentPokemonName)	{
		getPokemonData(pokemon);
		currentPokemonName = pokemon;
	}
});

async function getPokemonData(pokeName) {
	let pokemon = await fetch(url(pokeName)).then((res) => res.json());
	let processedData = processData(pokemon);
	let processedStats = processStats(pokemon);
	let processedEvo = processEvo(pokemon);
	
	console.log(processedData);
	console.log(processedStats);
	console.log(processedEvo);
	return [processedData, processedStats, processedEvo];
}

function processData(pokemonObject) {
	return {
		id: pokemonObject.id,
		types: processTypes(pokemonObject.types),
		species: processSpecies(pokemonObject.species),
		height: parseInt(pokemonObject.height) / 10,
		weight: parseInt(pokemonObject.weight) / 10,
		abilities: processAbilities(pokemonObject.abilities),
		indices: processIndeces(pokemonObject.game_indices)
	}
}

function processTypes(types){
	let processedTypes = []
	types.forEach(t => {
		processedTypes.push(t.type.name);
	});
	return processedTypes;
}

async function processSpecies(species){
	let sp = await fetch(species.url).then((res) => res.json());
	let s = sp.genera.find((s) => s.language.name === 'en');
	return s.genus;
}

function processAbilities(abilities){
	let abs = [];
	abilities.forEach((a) => {
		abs.push([a.ability.name, a.is_hidden]);
	});
	return abs;
}

function processIndeces(indices){
	let ixs = new Map();
	indices.forEach((index) => {
		if (ixs.has(index.game_index))	ixs.get(index.game_index).push(index.version.name);
		else ixs.set(index.game_index, [index.version.name]);
	});
	return ixs;
}

function processStats(pokemonObject){
	let stats = [];
	pokemonObject.stats.forEach((s) => {
		stats.push([s.base_stat, s.stat.name]);
	});
	return stats;
}

function processEvo(pokemonObject){

}





