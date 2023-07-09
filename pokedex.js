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
searchBtn.addEventListener('click', () => {
	let input = document.getElementById('input-pokemon');
	let pokemon = input.value.toLowerCase();
	if (pokemon !== currentPokemonName)	{
		getPokemonData(pokemon);
		currentPokemonName = pokemon;
	}
});

async function getPokemonData(pokeName) {
	let pokemon = await fetch(url(pokeName)).then((res) => res.json());
	let processedPoke = processData(pokemon);
	console.log(processedPoke);
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
	types.forEach(type => {
		processedTypes.push(type.type.name);
	});
	return processedTypes;
}

function processSpecies(species){
	console.log(species);
}

function processAbilities(abilities){
	console.log(abilities);
}

function processIndeces(indices){
	console.log(indices);
}








