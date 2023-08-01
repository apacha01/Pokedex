///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Imports
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
import PokedataProcessor from './pokedata-processor.js';
import PokedataFormatter from './pokedata-formatter.js';
import PokedexUpdater from './pokedex-updater.js';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentPokemon;
let currentUpdater;
let isTop = true;
let isInfo = true;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Constants
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const url = (poke) => 'https://pokeapi.co/api/v2/pokemon/' + (poke);
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const loadingTxt = document.getElementById('loading-text');
const arrowPadUpBtn = document.getElementById('arrow-pad-up');
const arrowPadRightBtn = document.getElementById('arrow-pad-right');
const arrowPadDownBtn = document.getElementById('arrow-pad-down');
const arrowPadLeftBtn = document.getElementById('arrow-pad-left');
const pokeEntryDownArrow = document.getElementById('flavor-down-arrow');
const moveRightBtn = document.getElementById('right-btn');
const moveLeftBtn = document.getElementById('left-btn');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
searchBtn.addEventListener('click', async () => {
	let poke = searchBar.value.toLowerCase();
	if (poke === currentPokemon.getName()) return;

	changePokemonEntry(poke);
});

arrowPadUpBtn.addEventListener('click', () => {
	if (!isTop && isInfo) {
		currentUpdater.updateFlavorLines(true);
		document.getElementById('flavor-down-arrow').classList.remove('hide');
		isTop = true;
	}
});

arrowPadDownBtn.addEventListener('click', () => {
	if (isTop && isInfo) {
		currentUpdater.updateFlavorLines(false);
		document.getElementById('flavor-down-arrow').classList.add('hide');
		isTop = false;
	}
});

arrowPadRightBtn.addEventListener('click', () => {
	if (isInfo) {
		document.getElementById('flavor-down-arrow').classList.remove('hide');
		isTop = true;

		currentUpdater.updatePokedexEntryToStats();
		isInfo = false;
	}
});

arrowPadLeftBtn.addEventListener('click', () => {
	if (!isInfo) {
		currentUpdater.updatePokedexEntryToInfo();
		isInfo = true;
	}
});

moveRightBtn.addEventListener('click', async () => {
	let nextId = parseInt(currentPokemon.getId()) + 1;
	if (nextId < 152)
		changePokemonEntry(nextId);
	isTop = true;
	isInfo = true;
});

moveLeftBtn.addEventListener('click', async () => {
	let prevId = parseInt(currentPokemon.getId()) - 1;
	if (prevId > 0)
		changePokemonEntry(prevId);
	isTop = true;
	isInfo = true;
});

async function changePokemonEntry(poke) {
	let dotsInterv = startLoadingText();
	let data = await getPokemonData(poke)
				.then((res) => {clearInterval(dotsInterv); return res;})
				.catch((err) => {loadingTxt.innerText = 'Error'; console.log(err);});

	if (!isDataValid(data)) {
		return;
	}

	currentPokemon = data.getPokemon();
	currentUpdater = new PokedexUpdater(new PokedataFormatter(currentPokemon));
	searchBar.value = currentPokemon.getName().charAt(0).toUpperCase() + currentPokemon.getName().slice(1);

	currentUpdater.updatePokedexEntryToInfo();
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

	return processedData;
}

function startLoadingText() {
	loadingTxt.innerText = 'Loading';
	let dotsInterv = setInterval(() => {
		if(loadingTxt.innerText.length === 13) loadingTxt.innerText = 'Loading';
		loadingTxt.innerText += ' .';
	}, 250);

	return dotsInterv;
}

function isDataValid(data) {
	if (data === null || data === undefined) {
		loadingTxt.innerText = 'Not Found';
		return false;
	}
	else if (data.getPokemon().getId() >= 152) {
		loadingTxt.innerText = 'Not Gen I';
		return false;
	}
	else {
		loadingTxt.innerText = 'Ready';
	}
	
	return true;
}

// Start with pikachu
changePokemonEntry('pikachu');