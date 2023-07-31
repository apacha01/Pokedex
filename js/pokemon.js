// import Stats from './stats.js'

class Pokemon {
	#id
	#name
	#types
	#species
	#height
	#weight
	#sprite
	#flavor
	#stats

	constructor(id, name, types, species, height, weight, sprite, flavor) {
		this.#id = id;
		this.#name = name;
		this.#types = types;
		this.#species = species;
		this.#height = height;
		this.#weight = weight;
		this.#sprite = sprite;
		this.#flavor = flavor;
	}

	getId() {
		return this.#id;
	}

	getName() {
		return this.#name;
	}

	getTypes() {
		return this.#types;
	}

	getSpecies() {
		return this.#species;
	}

	getHeight() {
		return this.#height;
	}

	getWeight() {
		return this.#weight;
	}

	getSprite() {
		return this.#sprite;
	}

	getFlavor() {
		return this.#flavor;
	}
}

export default Pokemon