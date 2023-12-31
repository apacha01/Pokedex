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
// Pokedex Responsiveness
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector(':root').style.fontSize =
	Math.max(
		Math.round(window.innerWidth * (window.innerWidth / window.innerHeight) / (50 * (window.innerWidth / window.innerHeight))),
		24
	)
	+ 'px';

window.addEventListener('resize', () => {
	document.querySelector(':root').style.fontSize =
		Math.max(
			Math.round(window.innerWidth * (window.innerWidth / window.innerHeight) / (50 * (window.innerWidth / window.innerHeight))),
			24
		)
		+ 'px';
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentPokemonName = '';
let currentPokemonFlavor;
let isTop = true;
let isInfo = true;

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
const flavorLetters = document.getElementsByClassName('flavor__letter');
const arrowPadUpBtn = document.getElementById('arrow-pad-up');
const arrowPadRightBtn = document.getElementById('arrow-pad-right');
const arrowPadDownBtn = document.getElementById('arrow-pad-down');
const arrowPadLeftBtn = document.getElementById('arrow-pad-left');
const pokeEntryDownArrow = document.getElementById('flavor-down-arrow');
const moveRightBtn = document.getElementById('right-btn');
const moveLeftBtn = document.getElementById('left-btn');
const statsImg = document.getElementById('stat-img');
const statsId = document.getElementById('stat-id');
const statsName = document.getElementById('stat-name');
const statsHP = document.getElementById('stat-hp');
const statsATK = document.getElementById('stat-atk');
const statsDEF = document.getElementById('stat-def');
const statsSPD = document.getElementById('stat-spd');
const statsSPC = document.getElementById('stat-spc');
const statsTypeI = document.getElementById('stat-type-I');
const statsTypeII = document.getElementById('stat-type-II');

const HP_INDEX = 0;
const ATK_INDEX = 1;
const DEF_INDEX = 2;
const SPD_INDEX = 5;
const SPC_INDEX = 3;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
searchBtn.addEventListener('click', async () => {
	let poke = searchBar.value.toLowerCase();
	if (poke === currentPokemonName) return;

	changePokemonEntry(poke);
});

arrowPadUpBtn.addEventListener('click', () => {
	if (!isTop) {
		updateLines(currentPokemonFlavor, true);
		pokeEntryDownArrow.classList.remove('hide');
		isTop = true;
	}
});

arrowPadDownBtn.addEventListener('click', () => {
	if (isTop) {
		updateLines(currentPokemonFlavor, false);
		pokeEntryDownArrow.classList.add('hide');
		isTop = false;
	}
});

arrowPadRightBtn.addEventListener('click', () => {
	if (isInfo) {
		changePokedexEntry(true);
		isInfo = false;
	}
});

arrowPadLeftBtn.addEventListener('click', () => {
	if (!isInfo) {
		changePokedexEntry(false);
		isInfo = true;
	}
});

moveRightBtn.addEventListener('click', async () => {
	let nextId = parseInt(pokeId.innerText) + 1;
	if (nextId < 152)
		changePokemonEntry(nextId);
	pokeEntryDownArrow.classList.remove('hide');
	isTop = true;
});

moveLeftBtn.addEventListener('click', async () => {
	let prevId = parseInt(pokeId.innerText) - 1;
	if (prevId > 0)
		changePokemonEntry(prevId);
	pokeEntryDownArrow.classList.remove('hide');
	isTop = true;
});

async function changePokemonEntry(poke) {
	loadingTxt.innerText = 'Loading';
	let dotsInterv = setInterval(() => {
		if (loadingTxt.innerText.length === 13) loadingTxt.innerText = 'Loading';
		loadingTxt.innerText += ' .';
	}, 250);

	let data = await getPokemonData(poke)
		.then((res) => { clearInterval(dotsInterv); return res; })
		.catch((err) => { loadingTxt.innerText = 'Error'; console.log(err); });

	if (data === null) {
		loadingTxt.innerText = 'Not Found';
		return;
	}
	else if (data[0].id >= 152) {
		loadingTxt.innerText = 'Not Gen I';
		return;
	}
	else
		loadingTxt.innerText = 'Ready';

	currentPokemonName = data[0].name;
	searchBar.value = currentPokemonName.charAt(0).toUpperCase() + currentPokemonName.slice(1);

	updatePokedexEntry(data);
}

async function getPokemonData(pokeName) {
	let pokemon = await fetch(url(pokeName)).then((res) => {
		if (res.ok) return res.json();
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

function processTypes(types) {
	let processedTypes = []
	types.forEach(t => {
		processedTypes.push(t.type.name);
	});
	return processedTypes;
}

function processSpecies(species) {
	let s = species.genera.find((s) => s.language.name === 'en');
	return s.genus;
}

function processAbilities(abilities) {
	let abs = [];
	abilities.forEach((a) => {
		abs.push({ ability: a.ability.name, isHidden: a.is_hidden });
	});
	return abs;
}

function processStats(pokemonObject) {
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
	let pokemon = data[0];
	let stats = data[1];

	/* Info Update */
	pokeId.innerText = formatId(pokemon.id);
	pokeImg.style.backgroundImage = `url(${pokemon.sprite})`;
	pokeName.innerText = pokemon.name.toUpperCase();

	// species always include a Pokémon at the end (e.g. Flame Pokemon, Seed Pokemon, etc.)
	pokeSpecies.innerText = pokemon.species.replace(' Pokémon', '').toUpperCase();

	// 1 foot = 12 inches, 1 inch = 2.54 cm. Pokeapi gives height in decimiters
	pokeHeight.innerText = formatHeight(pokemon.height);

	// 1 pound = 2.2046 kg .Pokeapi gives weight in hectograms
	// it seems the coma is just decoration: https://www.youtube.com/watch?v=3npx3FFvo-I
	// every weight is X.0 lb so i'll do it like that
	pokeWeight.innerText = formatWeight(pokemon.weight);

	updateFlavor(pokemon.flavor);
	updateLines(currentPokemonFlavor, true);

	/* Stats Update */
	statsId.innerText = formatId(pokemon.id);
	statsImg.style.backgroundImage = `url(${pokemon.sprite})`;
	statsName.innerText = pokemon.name.toUpperCase();

	statsHP.innerText = `${stats[HP_INDEX][0]}/ ${stats[HP_INDEX][0]}`;
	statsATK.innerText = `${stats[ATK_INDEX][0]}`;
	statsDEF.innerText = `${stats[DEF_INDEX][0]}`;
	statsSPD.innerText = `${stats[SPD_INDEX][0]}`;
	statsSPC.innerText = `${stats[SPC_INDEX][0]}`;

	if (pokemon.types.length > 1) document.getElementById('stat-type-II-lbl').innerText = 'TYPE2/';
	else document.getElementById('stat-type-II-lbl').innerText = '';
	statsTypeI.innerText = `${pokemon.types[0].toUpperCase()}`;
	statsTypeII.innerText = `${pokemon.types[1] || ''}`.toUpperCase();
}

function formatId(id) {
	// equal length strings
	let fid = '';

	if (id < 10)
		fid += '00';
	else if (id < 100)
		fid += '0';

	return fid + id;
}

function formatHeight(decimiters) {
	let absolute = Math.round((decimiters * 10) / 2.54);
	let foot = Math.floor(absolute / 12);
	let inches = absolute - (foot * 12);

	let height = `${foot}' `;
	height += inches < 10 ? `0${inches}''` : `${inches}''`;

	return height;
}

function formatWeight(hectograms) {
	let weight = Math.ceil(hectograms * 0.22046);
	return `${weight}.0 lb`;
}

function updateFlavor(flavor) {
	let flavorTop = flavor.substring(0, flavor.indexOf(GBCnl));
	let flavorBottom = flavor.substring(flavor.indexOf(GBCnl) + 1, flavor.length);

	let topLines = flavorTop.split('\n');
	let bottomLines = flavorBottom.split('\n');

	currentPokemonFlavor = [topLines, bottomLines];
}

function updateLines(flavor, top) {
	let lines;
	if (top) lines = flavor[0];
	else lines = flavor[1];

	for (let i = 0; i < 18; i++) {
		flavorLetters[i].innerText = (lines[0][i] || ' ');
		flavorLetters[i + 18].innerText = (lines[1][i] || ' ');
		flavorLetters[i + 36].innerText = (lines[2][i] || ' ');
	}
}

function changePokedexEntry(toStats) {
	if (toStats) {
		document.getElementById('info-container').style.display = 'none';
		document.getElementById('stats-container').style.display = 'block';
	} else {
		document.getElementById('info-container').style.display = 'block';
		document.getElementById('stats-container').style.display = 'none';
	}
}

// Start with pikachu
changePokemonEntry('pikachu');