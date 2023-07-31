class PokedataFormatter {
	#pokemon

	constructor(pokemon) {
		this.#pokemon = pokemon;
	}

	getFormattedId() {
		// equal length strings
		let sid = '';

		if (this.#pokemon.getId() < 10)
			sid += '00';
		else if (this.#pokemon.getId() < 100)
			sid += '0';

		return sid + this.#pokemon.getId();
	}

	getFormattedName() {
		return this.#pokemon.getName().toUpperCase();
	}

	getFormattedTypes() {
		return this.#pokemon.getTypes().map(t => t.toUpperCase());
	}

	getFormattedSpecies() {
		return this.#pokemon.getSpecies().replace(' Pokémon', '').toUpperCase();
	}

	getFormattedHeight() {
		let absolute = Math.round((this.#pokemon.getHeight() * 10) / 2.54);
		let foot = Math.floor(absolute / 12);
		let inches = absolute - (foot * 12);

		let height = `${foot}' `;
		height += inches < 10 ? `0${inches}''` : `${inches}''`;

		return height;
	}

	getFormattedWeight() {
		let weight = Math.ceil(this.#pokemon.getWeight() * 0.22046);
		return `${weight}.0 lb`;
	}

	getFormattedSprite() {
		return this.#pokemon.getSprite();
	}

	getFormattedFlavor() {
		return this.#pokemon.getFlavor();
	}

	getFormattedHp() {
		return `${this.#pokemon.getStats().getHp()}/ ${this.#pokemon.getStats().getHp()}`;
	}

	getFormattedAtk() {
		return `${this.#pokemon.getStats().getAtk()}`;
	}

	getFormattedDef() {
		return `${this.#pokemon.getStats().getDef()}`;
	}

	getFormattedSpd() {
		return `${this.#pokemon.getStats().getSpd()}`;
	}

	getFormattedSpc() {
		return `${this.#pokemon.getStats().getSpc()}`;
	}
}

export default PokedataFormatter