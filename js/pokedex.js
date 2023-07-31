///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Imports
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
import PokedataProcessor from './pokedata-processor.js';
import PokedataFormatter from './pokedata-formatter.js';

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
		if(loadingTxt.innerText.length === 13) loadingTxt.innerText = 'Loading';
		loadingTxt.innerText += ' .';
	}, 250);

	let data = await getPokemonData(poke)
				.then((res) => {clearInterval(dotsInterv); return res;})
				.catch((err) => {loadingTxt.innerText = 'Error'; console.log(err);});

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

	currentPokemonName = data[0].getPokemon().getName();
	searchBar.value = currentPokemonName.charAt(0).toUpperCase() + currentPokemonName.slice(1);

	updatePokedexEntry(data);
}

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

	let processedData = new PokedataProcessor(pokemon, species);

	return [processedData, processedData.getPokemon().getStats()];
}

function updatePokedexEntry(data) {
	let pokemon = new PokedataFormatter(data[0].getPokemon());
	let stats = data[1];

	/* Info Update */
	pokeId.innerText = pokemon.getFormattedId();
	pokeImg.style.backgroundImage = `url(${pokemon.getFormattedSprite()})`;
	pokeName.innerText = pokemon.getFormattedName();

	// species always include a Pokémon at the end (e.g. Flame Pokemon, Seed Pokemon, etc.)
	pokeSpecies.innerText = pokemon.getFormattedSpecies();

	// 1 foot = 12 inches, 1 inch = 2.54 cm. Pokeapi gives height in decimiters
	pokeHeight.innerText = pokemon.getFormattedHeight();

	// 1 pound = 2.2046 kg .Pokeapi gives weight in hectograms
	// it seems the coma is just decoration: https://www.youtube.com/watch?v=3npx3FFvo-I
	// every weight is X.0 lb so i'll do it like that
	pokeWeight.innerText = pokemon.getFormattedWeight();

	if (pokeName.innerText.length >= 11) pokeName.style.fontSize = '12px';
	else pokeName.style.fontSize = '14px';

	if (pokeSpecies.innerText.length >= 11)	pokeSpecies.style.fontSize = '12px';
	else pokeSpecies.style.fontSize = '14px';

	updateFlavor(pokemon.getFormattedFlavor());
	updateLines(currentPokemonFlavor, true);

	/* Stats Update */
	statsId.innerText = pokemon.getFormattedId();
	statsImg.style.backgroundImage = `url(${pokemon.getFormattedSprite()})`;
	statsName.innerText = pokemon.getFormattedName();

	statsHP.innerText = `${stats.getHp()}/ ${stats.getHp()}`;
	statsATK.innerText = `${stats.getAtk()}`;
	statsDEF.innerText = `${stats.getDef()}`;
	statsSPD.innerText = `${stats.getSpd()}`;
	statsSPC.innerText = `${stats.getSpc()}`;

	if (pokemon.getFormattedTypes().length > 1) document.getElementById('stat-type-II-lbl').innerText = 'TYPE2/';
	else document.getElementById('stat-type-II-lbl').innerText = '';
	statsTypeI.innerText = `${pokemon.getFormattedTypes()[0]}`;
	statsTypeII.innerText = `${pokemon.getFormattedTypes()[1] || ''}`;
}

function updateFlavor(flavor) {
	let lines = flavor.split('\n');
	currentPokemonFlavor = [[lines[0], lines[1], lines[2]], [lines[3], lines[4], lines[5]]];
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

function changePokedexEntry(toStats){
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