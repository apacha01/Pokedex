import PokedataFormatter from "./pokedata-formatter.js";

class PokedexUpdater {
	#pokeFormatter
	#screenTag
	#infoComponent
	#statsComponent

	constructor(pokemonFormatter) {
		this.#pokeFormatter = pokemonFormatter;
		this.#screenTag = document.getElementById('screen');
		this.#infoComponent = this.#obtainInfoHtml();
		this.#statsComponent = this.#obtainStatsHtml();
	}

	/**
	 * Updates the screen on pokedex to the Info section
	 */
	updatePokedexEntryToInfo() {
		this.#setInfoComponent(this.#obtainInfoHtml());
		this.#screenTag.innerHTML = this.#infoComponent;
	}

	/**
	 * Updates the screen on pokedex to the Stats section
	 */
	updatePokedexEntryToStats() {
		this.#setStatsComponent(this.#obtainStatsHtml());
		this.#screenTag.innerHTML = this.#statsComponent;
	}

	/**
	 * Setter for infoComponent.
	 * @param {string} content string of the html to set #infoComponent to.
	 */
	#setInfoComponent(content) {
		this.#infoComponent = content;
	}

	/**
	 * Setter for statsComponent.
	 * @param {string} content string of the html to set #statsComponent to.
	 */
	#setStatsComponent(content) {
		this.#statsComponent = content;
	}

	/**
	 * Makes the html string for the inner part of the screen tag with the pokemon info.
	 * @returns {string} html string of the content for #infoComponent.
	 */
	#obtainInfoHtml() {
		let lines = this.#obtainFlavorHtmlLines(true);
		return `
		<div class="screen__pokedex-entry">
			<div class="general-info__up">
				<div class="entry-up__left">
					<div class="left__poke-img" style="background-image: url(${this.#pokeFormatter.getFormattedSprite()})"></div>
					<div class="id-container">
						<div class="id-txt"></div>
						<p>${this.#pokeFormatter.getFormattedId()}</p>
					</div>
				</div>
				<div class="entry-up__right">
					<div class="up__info">${this.#pokeFormatter.getFormattedName()}</div>
					<div class="up__info">${this.#pokeFormatter.getFormattedSpecies()}</div>
					<div class="up__info">
						<div class="height-info__tag">HT</div>
						<div class="height-info__value">${this.#pokeFormatter.getFormattedHeight()}</div>
					</div>
					<div class="up__info">
						<div class="weight-info__tag">WT</div>
						<div class="weigth-info__value">${this.#pokeFormatter.getFormattedWeight()}</div>
					</div>
				</div>
			</div>
			<div class="general-info__mid">
				<div class="mid__square-containers">
					<div class="mid__square"></div>
					<div class="mid__square"></div>
					<div class="mid__square"></div>
					<div class="mid__square"></div>
				</div>
				<div class="mid__square-containers">
					<div class="mid__square"></div>
					<div class="mid__square"></div>
					<div class="mid__square"></div>
					<div class="mid__square"></div>
				</div>
			</div>
			<div class="general-info__down">
				<div id="flavor__top" class="down__flavor">
					${lines[0]}
				</div>
				<div id="flavor__mid" class="down__flavor">
					${lines[1]}
				</div>
				<div id="flavor__bottom" class="down__flavor">
					${lines[2]}
				</div>
				<div class="flavor__arrow-container">
					<div id="flavor-down-arrow" class="flavor__down-arrow"></div>
				</div>
			</div>
		</div>`;
	}

	/**
	 * Makes the html string for the inner part of the screen tag with the pokemon stats info.
	 * @returns {string} html string of the content for #statsComponent.
	 */
	#obtainStatsHtml() {
		let type2 = this.#obtainHtmlTypeII();
		return `
		<div class="screen__pokedex-entry">
			<div class="stats__top">
				<div class="stats-top__left">
					<div class="stats__poke-img" style="background-image: url(${this.#pokeFormatter.getFormattedSprite()}"></div>
					<div class="id-container">
						<div class="id-txt"></div>
						<p>${this.#pokeFormatter.getFormattedId()}</p>
					</div>
				</div>
				<div class="stats-top__right">
					<div class="stats__name">${this.#pokeFormatter.getFormattedName()}</div>
					<div class="stats__hp-lv-container">
						<div class="stats__level-container">
							<div class="level-txt"></div>
							<p class="level">1</p>
						</div>
						<div class="stats__hp-container">
							<div class="hp__tag"></div>
							<div class="hp__bar">
								<div class="hp-bar__corner"></div>
								<div class="hp-bar__corner"></div>
								<div class="hp-bar__corner"></div>
								<div class="hp-bar__corner"></div>
							</div>
						</div>
						<div class="hp__stat">${this.#pokeFormatter.getFormattedHp()}</div>
					</div>
					<div class="stats__state">STATUS/OK</div>
					<div class="stats__half-arrow"></div>
				</div>
			</div>
			<div class="stats__down">
				<div class="stats__stats-box">
					<div class="stats-box__stats">
						<div class="stats__stat-container">
							<p class="stats__lbl">ATTACK</p>
							<p class="stats__stat">${this.#pokeFormatter.getFormattedAtk()}</p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">DEFENSE</p>
							<p class="stats__stat">${this.#pokeFormatter.getFormattedDef()}</p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">SPEED</p>
							<p class="stats__stat">${this.#pokeFormatter.getFormattedSpd()}</p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">SPECIAL</p>
							<p class="stats__stat">${this.#pokeFormatter.getFormattedSpc()}</p>
						</div>
					</div>
					<div class="stats-box__tl-corner"></div>
					<div class="stats-box__top-bar"></div>
					<div class="stats-box__tr-corner"></div>
					<div class="stats-box__right-bar"></div>
					<div class="stats-box__br-corner"></div>
					<div class="stats-box__bottom-bar"></div>
					<div class="stats-box__bl-corner"></div>
					<div class="stats-box__left-bar"></div>
				</div>
				<div class="stats__type-box">
					<div class="type-box__txt-container">
						<p class="type-box__lbl">TYPE1/</p>
						<p class="type-box__txt">${this.#pokeFormatter.getFormattedTypes()[0]}</p>
					</div>
					<div class="type-box__txt-container">
						${type2}
					</div>
					<div class="type-box__txt-container">
						<div class="type-box__lbl lbl__id">/</div>
						<p class="type-box__txt">???</p>
					</div>
					<div class="type-box__txt-container">
						<p class="type-box__lbl">OT/</p>
						<p class="type-box__txt">RED</p>
					</div>
					<div class="stats__half-arrow"></div>
				</div>
			</div>
		</div>`;
	}

	/**
	 * Makes the html string with the types acording to the amount of types the pokemon has.
	 * @returns {string} html string for the types depending on the amount.
	 */
	#obtainHtmlTypeII() {
		let html = (lbl, txt) => `
			<p id="stat-type-II-lbl" class="type-box__lbl">${lbl}</p>
			<p id="stat-type-II" class="type-box__txt">${txt}</p>
		`;
		let lbl = '';
		let txt = '';

		if (this.#pokeFormatter.getFormattedTypes().length > 1) {
			lbl = "TYPE2/";
			txt = this.#pokeFormatter.getFormattedTypes()[1];
		}

		return html(lbl, txt);
	}

	/**
	 * Makes the html string with the flavor lines of top or bottom part and the letters html.
	 * @param {boolean} isTop whether to get the lines of the top entry or the bottom entry.
	 * @returns {array} array of html strings of the flavor letters. Each index is a line.
	 */
	#obtainFlavorHtmlLines(isTop) {
		let flavorLines = this.#pokeFormatter.getFormattedFlavor().split('\n');
		let lines = ['', '', ''];
		let index = isTop ? 0 : 3;

		for (let i = 0; i < 18; i++) {
			lines[0] += `<div class="flavor__letter">${flavorLines[index][i] || ' '}</div>\n`;
			lines[1] += `<div class="flavor__letter">${flavorLines[index + 1][i] || ' '}</div>\n`;
			lines[2] += `<div class="flavor__letter">${flavorLines[index + 2][i] || ' '}</div>\n`;
		}

		return lines;
	}

	/**
	 * Updates the flavor lines on the pokedex screen to top/bottom.
	 * @param {boolean} isTop  whether to update the lines of to the top entry or to the bottom entry.
	 */
	updateFlavorLines(isTop) {
		let lines = this.#obtainFlavorHtmlLines(isTop);
		const flavorTop = document.getElementById('flavor__top');
		const flavorMid = document.getElementById('flavor__mid');
		const flavorBottom = document.getElementById('flavor__bottom');

		try {
			flavorTop.innerHTML = lines[0];
			flavorMid.innerHTML = lines[1];
			flavorBottom.innerHTML = lines[2];
		} catch (e) {
			console.log("Couldn't change flavor lines, check if pokedex entry is in the info section.");
			console.log("StackTrace:", e);
		}
	}
}

export default PokedexUpdater