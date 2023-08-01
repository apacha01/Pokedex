class PokedataFormatter {
	#pokemon

	constructor(pokemon) {
		this.#pokemon = pokemon;
	}

	/**
	 * Formatting id to get equal length id's regardless of the id length.
	 * @returns string
	 */
	getFormattedId() {
		// equal length strings
		let sid = '';

		if (this.#pokemon.getId() < 10)
			sid += '00';
		else if (this.#pokemon.getId() < 100)
			sid += '0';

		return sid + this.#pokemon.getId();
	}

	/**
	 * Formatting name to be upper case as in the original Pokemon Red.
	 * @returns string
	 */
	getFormattedName() {
		return this.#pokemon.getName().toUpperCase();
	}

	/**
	 * Formatting types to be upper case as in the original Pokemon Red.
	 * @returns array
	 */
	getFormattedTypes() {
		return this.#pokemon.getTypes().map(t => t.toUpperCase());
	}

	/**
	 * Formatting species to be upper case as in the original Pokemon Red.
	 * @returns string
	 */
	getFormattedSpecies() {
		return this.#pokemon.getSpecies().replace(' Pokémon', '').toUpperCase();
	}

	/**
	 * Formatting height to be in "feet' inches''".
	 * 1 feet = 12 inches, 1 inch = 2.54 cm. Pokeapi gives height in decimiters.
	 * @returns string
	 */
	getFormattedHeight() {
		let absolute = Math.round((this.#pokemon.getHeight() * 10) / 2.54);
		let feet = Math.floor(absolute / 12);
		let inches = absolute - (feet * 12);

		let height = `${feet}' `;
		height += inches < 10 ? `0${inches}''` : `${inches}''`;

		return height;
	}

	/**
	 * Formatting wight to be "pounds.0 lb".
	 * 1 pound = 2.2046 kg. Pokeapi gives weight in hectograms.
	 * @returns string
	 */
	getFormattedWeight() {
		// it seems the decimal point is just decoration: https://www.youtube.com/watch?v=3npx3FFvo-I
		// every weight is X.0 lb so i'll do it like that
		let weight = Math.ceil(this.#pokemon.getWeight() * 0.22046);
		return `${weight}.0 lb`;
	}

	/**
	 * Formatting sprite, just returns the sprite url.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedSprite() {
		return this.#pokemon.getSprite();
	}

	/**
	 * Formatting flavor, just returns the flavor.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedFlavor() {
		return this.#pokemon.getFlavor();
	}

	/**
	 * Formatting hp stat to show as in the original stats panel of the pokedex
	 * @returns string
	 */
	getFormattedHp() {
		return `${this.#pokemon.getStats().getHp()}/ ${this.#pokemon.getStats().getHp()}`;
	}

	/**
	 * Formatting attack, just returns the attack.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedAtk() {
		return `${this.#pokemon.getStats().getAtk()}`;
	}

	/**
	 * Formatting defense, just returns the defense.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedDef() {
		return `${this.#pokemon.getStats().getDef()}`;
	}

	/**
	 * Formatting speed, just returns the speed.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedSpd() {
		return `${this.#pokemon.getStats().getSpd()}`;
	}

	/**
	 * Formatting special, just returns the special.
	 * Added so there's a function for every property.
	 * @returns string
	 */
	getFormattedSpc() {
		return `${this.#pokemon.getStats().getSpc()}`;
	}
}

export default PokedataFormatter