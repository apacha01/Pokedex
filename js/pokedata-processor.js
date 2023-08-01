import Pokemon from './pokemon.js';
import Stats from './stats.js'

const GBCnl = "";	// Game Boy Console new entry character.

class PokedataProcessor {
	#pokemon;

	constructor(rawPokemon, rawSpecies) {
		this.#pokemon = this.#processPokemonData(rawPokemon, rawSpecies);
	}

	/**
	 * Process the raw data given by the PokeApi and returns a pokemon object with that data.
	 * @param {JSON} rawPokemon raw JSON response from the PokeApi containing the pokemon data. 
	 * @param {JSON} rawSpecies raw JSON response from the PokeApi containing the species of the pokemon data.
	 * @returns {Pokemon} pokemon object that results from processing the raw data.
	 */
	#processPokemonData(rawPokemon, rawSpecies) {
		return new Pokemon(rawPokemon.id,
			rawPokemon.name,
			this.#processTypes(rawPokemon.types),
			this.#processSpecies(rawSpecies),
			rawPokemon.height,
			rawPokemon.weight,
			rawPokemon.sprites.front_default,
			this.#processFlavor(rawSpecies),
			this.#processStats(rawPokemon.stats));
	}

	/**
	 * Process the types array in raw data and returns an array of only the names of the types.
	 * @param {Array} types raw array within the raw pokemon data given by the PokeApi.
	 * @returns {Array} array of types names.
	 */
	#processTypes(types) {
		// get the name of types
		return types.map(t => t.type.name);
	}

	/**
	 * Process the raw data of the pokemon species given by the PokeApi and returns the name of the species.
	 * @param {JSON} species raw JSON response from the PokeApi containing the species of the pokemon data.
	 * @returns {string} string with the species name.
	 */
	#processSpecies(species) {
		// Find the species name in english
		let speciesName = species.genera.find((s) => s.language.name === 'en').genus;
		return speciesName;
	}

	/**
	 * Process the raw data of the pokemon species given by the PokeApi and returns the flavor of the original Pokemon Red game in english.
	 * If pokemon is not on Pokemon Red it just returns the first flavor found in english. 
	 * @param {JSON} species raw JSON response from the PokeApi containing the species of the pokemon data.
	 * @returns {string} string with the flavor in english.
	 */
	#processFlavor(species) {
		// Find pokemon red english flavor or return the first one in english 
		// (red should be the first one if pokemon is in Pokemon Red, but just in case...)
		let speciesFlavor = species.flavor_text_entries.find(
			s => s.language.name === 'en' && s.version.name === 'red').flavor_text
			|| species.flavor_text_entries.find(s => s.language.name === 'en')[0].flavor_text;
		return speciesFlavor.replace(GBCnl, '\n');
	}

	/**
	 * Process the stats array in raw data and returns a Stats object with that data.
	 * @param {Array} stats array within pokemon raw data given by the PokeApi.
	 * @returns {Stats} Stats object with the data.
	 */
	#processStats(stats) {
		let hp, atk, def, spd, spc;
		for (let i = 0; i < stats.length; i++) {
			switch (stats[i].stat.name) {
				case 'hp':
					hp = stats[i].base_stat;
					break;
				case 'attack':
					atk = stats[i].base_stat;
					break;
				case 'defense':
					def = stats[i].base_stat;
					break;
				case 'speed':
					spd = stats[i].base_stat;
					break;
				// pokemons in Gen I didn't have separate specials so using special def or atk is the same
				case 'special-defense':
					spc = stats[i].base_stat;
					break;
				default: break;	// special-attack case
			}
		}
		return new Stats(hp, atk, def, spd, spc);
	}

	/**
	 * Getter for #pokemon property.
	 * @returns {Pokemon} the pokemon object stored in the #pokemon property.
	 */
	getPokemon() {
		return this.#pokemon;
	}
}

export default PokedataProcessor