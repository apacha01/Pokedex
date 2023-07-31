class Stats {
	#hp
	#atk
	#def
	#spd
	#spc

	constructor(hp, atk, def, spd, spc) {
		this.#hp = hp;
		this.#atk = atk;
		this.#def = def;
		this.#spd = spd;
		this.#spc = spc;
	}

	getHp(){
		return this.#hp;
	}

	getAtk(){
		return this.#atk;
	}

	getDef(){
		return this.#def;
	}

	getSpd(){
		return this.#spd;
	}

	getSpc(){
		return this.#spc;
	}
}

export default Stats