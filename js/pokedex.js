///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Imports
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
import PokedataProcessor from './pokedata-processor.js';
import PokedataFormatter from './pokedata-formatter.js';
import PokedexUpdater from './pokedex-updater.js';

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
const moveRightBtn = document.getElementById('right-btn');
const moveLeftBtn = document.getElementById('left-btn');
const toggleBgMusic = document.getElementById('mute-bg-music');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Searches the pokemon written in the search bar and updates the pokedex entry.
 */
searchBtn.addEventListener('click', async () => {
	let poke = searchBar.value.toLowerCase();
	if (poke === currentPokemon.getName()) return;
	isTop = true;
	isInfo = true;

	changePokemonEntry(poke);
});

/**
 * Changes flavor lines (if possible) to the top lines.
 */
arrowPadUpBtn.addEventListener('click', () => {
	if (!isTop && isInfo) {
		currentUpdater.updateFlavorLines(true);
		document.getElementById('flavor-down-arrow').classList.remove('hide');
		isTop = true;
	}
});

/**
 * Changes flavor lines (if possible) to the bottom lines.
 */
arrowPadDownBtn.addEventListener('click', () => {
	if (isTop && isInfo) {
		currentUpdater.updateFlavorLines(false);
		document.getElementById('flavor-down-arrow').classList.add('hide');
		isTop = false;
	}
});

/**
 * Changes from info to stats component.
 */
arrowPadRightBtn.addEventListener('click', () => {
	if (isInfo) {
		document.getElementById('flavor-down-arrow').classList.remove('hide');
		isTop = true;

		currentUpdater.updatePokedexEntryToStats();
		isInfo = false;
	}
});

/**
 * Changes from stats to info component.
 */
arrowPadLeftBtn.addEventListener('click', () => {
	if (!isInfo) {
		currentUpdater.updatePokedexEntryToInfo();
		isInfo = true;
	}
});

/**
 * Changes to the next pokemon and resets the views (to the info component and top lines of flavor).
 */
moveRightBtn.addEventListener('click', async () => {
	let nextId = parseInt(currentPokemon.getId()) + 1;
	if (nextId < 152)
		changePokemonEntry(nextId);
	isTop = true;
	isInfo = true;
});

/**
 * Changes to the previous pokemon and resets the views (to the info component and top lines of flavor).
 */
moveLeftBtn.addEventListener('click', async () => {
	let prevId = parseInt(currentPokemon.getId()) - 1;
	if (prevId > 0)
		changePokemonEntry(prevId);
	isTop = true;
	isInfo = true;
});

/**
 * Toggles the background music sound.
 */
toggleBgMusic.addEventListener('click', () => {
	const audio = document.getElementById('bg-music');
	toggleBgMusic.innerHTML =
		audio.muted
			? '<i class="fa-solid fa-volume-xmark"></i>'
			: '<i class="fa-solid fa-volume-high"></i>';
	audio.muted = !audio.muted;
});

/**
 * Changes the pokedex entry to the pokemon passed as parameter.
 * If pokemon is no in Gen I doesn't update.
 * @param {string} poke pokemon name to search with PokeApi.
 */
async function changePokemonEntry(poke) {
	let dotsInterv = startLoadingText();
	let data = await requestPokemonData(poke)
		.then((res) => { clearInterval(dotsInterv); return res; })
		.catch((err) => { loadingTxt.innerText = 'Error'; console.log(err); });

	if (!isDataValid(data)) {
		return;
	}

	currentPokemon = data.getPokemon();
	currentUpdater = new PokedexUpdater(new PokedataFormatter(currentPokemon));
	searchBar.value = currentPokemon.getName().charAt(0).toUpperCase() + currentPokemon.getName().slice(1);

	currentUpdater.updatePokedexEntryToInfo();
}

/**
 * Requests pokemon data to the PokeApi for the pokemon and the species of that pokemon (so 2 requests).
 * @param {string} pokeName string of the pokemon name to request to the PokeApi. 
 * @returns {Pokemon | null} a pokemon object with the processed data from the raw data of the PokeApi. Returns null if pokemon wasn't found. 
 */
async function requestPokemonData(pokeName) {
	let pokemon = await fetch(url(pokeName)).then((res) => {
		if (res.ok) return res.json();
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

/**
 * Starts the triple dots loading text animation in the screen under pokedex.
 * @returns {number} return value of the setInterval function (ID used to close the interval).
 */
function startLoadingText() {
	loadingTxt.innerText = 'Loading';
	let dotsInterv = setInterval(() => {
		if (loadingTxt.innerText.length === 13) loadingTxt.innerText = 'Loading';
		loadingTxt.innerText += ' .';
	}, 250);

	return dotsInterv;
}

/**
 * Checks if request data of the pokemon obtained is valid or if it's within Gen I. 
 * @param {JSON} data raw data from the PokeApi.
 * @returns {boolean} true if valid, false otherwise.
 */
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