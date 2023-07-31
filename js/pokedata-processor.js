import Pokemon from './pokemon.js';
import Stats from './stats.js'

const GBCnl = "";	// Game Boy Console new entry character.

class PokedataProcessor {
	#pokemon;

	constructor(rawPokemon, rawSpecies) {
		this.#pokemon = this.#processPokemonData(rawPokemon, rawSpecies);
	}

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

	#processTypes(types) {
		// get the name of types
		return types.map(t => t.type.name);
	}

	#processSpecies(species) {
		// Find the species name in english
		let speciesName = species.genera.find((s) => s.language.name === 'en').genus;
		return speciesName;
	}

	#processFlavor(species) {
		// Find pokemon red english flavor or return the first one in english 
		// (red should be the first one if pokemon is in Pokemon Red, but just in case...)
		let speciesFlavor = species.flavor_text_entries.find(
			s => s.language.name === 'en' && s.version.name === 'red').flavor_text
			|| species.flavor_text_entries.find(s => s.language.name === 'en')[0].flavor_text;
		return speciesFlavor.replace(GBCnl, '\n');
	}

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

	getPokemon() {
		return this.#pokemon;
	}
}

export default PokedataProcessor