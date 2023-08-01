class PokedataFormatter {
	#pokemon

	constructor(pokemon) {
		this.#pokemon = pokemon;
	}

	/**
	 * Formatting id to get equal length id's regardless of the id length.
	 * @returns {string} string with the id preceded by the amount of 0's needed to reach length 3. 
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
	 * @returns {string} string of the name in upper case.
	 */
	getFormattedName() {
		return this.#pokemon.getName().toUpperCase();
	}

	/**
	 * Formatting types to be upper case as in the original Pokemon Red.
	 * @returns {Array} array of the types names on upper case.
	 */
	getFormattedTypes() {
		return this.#pokemon.getTypes().map(t => t.toUpperCase());
	}

	/**
	 * Formatting species to be upper case as in the original Pokemon Red.
	 * @returns {string} string of the species name without the "Pokémon" sufix.
	 */
	getFormattedSpecies() {
		return this.#pokemon.getSpecies().replace(' Pokémon', '').toUpperCase();
	}

	/**
	 * Formatting height to be in "feet' inches''".
	 * 1 feet = 12 inches, 1 inch = 2.54 cm. Pokeapi gives height in decimiters.
	 * @returns {string} string of the height in the format of "feet' inches''".
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
	 * @returns {string} string of the wight in the format of "pounds.0 lb".
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
	 * @returns {string} string of the sprite url.
	 */
	getFormattedSprite() {
		return this.#pokemon.getSprite();
	}

	/**
	 * Formatting flavor, just returns the flavor.
	 * Added so there's a function for every property.
	 * @returns {string} string of the flavor in english.
	 */
	getFormattedFlavor() {
		return this.#pokemon.getFlavor();
	}

	/**
	 * Formatting hp stat to show as in the original stats panel of the pokedex
	 * @returns {string} string of the hp stat in the format of "hp/ hp".
	 */
	getFormattedHp() {
		return `${this.#pokemon.getStats().getHp()}/ ${this.#pokemon.getStats().getHp()}`;
	}

	/**
	 * Formatting attack, just returns the attack.
	 * Added so there's a function for every property.
	 * @returns {string} string of the attack stat value.
	 */
	getFormattedAtk() {
		return `${this.#pokemon.getStats().getAtk()}`;
	}

	/**
	 * Formatting defense, just returns the defense.
	 * Added so there's a function for every property.
	 * @returns {string} string of the defense stat value.
	 */
	getFormattedDef() {
		return `${this.#pokemon.getStats().getDef()}`;
	}

	/**
	 * Formatting speed, just returns the speed.
	 * Added so there's a function for every property.
	 * @returns {string} string of the speed stat value.
	 */
	getFormattedSpd() {
		return `${this.#pokemon.getStats().getSpd()}`;
	}

	/**
	 * Formatting special, just returns the special.
	 * Added so there's a function for every property.
	 * @returns {string} string of the special stat value.
	 */
	getFormattedSpc() {
		return `${this.#pokemon.getStats().getSpc()}`;
	}
}

export default PokedataFormatter