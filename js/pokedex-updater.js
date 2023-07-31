import PokedataFormatter from "./pokedata-formatter.js";

class PokedexUpdater {
	#pokeFormatter
	#screenTag
	#infoComponent
	#statsComponent

	constructor(pokemonFormatter) {
		this.#pokeFormatter = pokemonFormatter;
		this.#screenTag = document.getElementById('screen');
		this.#setInfoComponent(this.#obtainInfoHtml());
	}

	updatePokedexEntryToInfo() {
		this.#setInfoComponent(this.#obtainInfoHtml());
		this.#screenTag.innerHTML = this.#infoComponent;
	}

	updatePokedexEntryToStats() {
	}

	#setInfoComponent(content) {
		this.#infoComponent = content;
	}

	#setStatsComponent(content) {
		this.#statsComponent = content;
	}

	#obtainStatsHtml(pokemonFormatter) {
		let c = `
		<div id="stats-container" class="screen__pokedex-entry">
			<div class="stats__top">
				<div class="stats-top__left">
					<div id="stat-img" class="stats__poke-img"></div>
					<div class="id-container">
						<div class="id-txt"></div>
						<p id="stat-id"></p>
					</div>
				</div>
				<div class="stats-top__right">
					<div id="stat-name" class="stats__name"></div>
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
						<div id="stat-hp" class="hp__stat">35/ 35</div>
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
							<p id="stat-atk" class="stats__stat"></p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">DEFENSE</p>
							<p id="stat-def" class="stats__stat"></p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">SPEED</p>
							<p id="stat-spd" class="stats__stat"></p>
						</div>
						<div class="stats__stat-container">
							<p class="stats__lbl">SPECIAL</p>
							<p id="stat-spc" class="stats__stat"></p>
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
						<p id="stat-type-I" class="type-box__txt"></p>
					</div>
					<div class="type-box__txt-container">
						<p id="stat-type-II-lbl" class="type-box__lbl"></p>
						<p id="stat-type-II" class="type-box__txt"></p>
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
				<div id="flavor__up" class="down__flavor">
					${lines[0]}
				</div>
				<div id="flavor__mid" class="down__flavor">
					${lines[1]}
				</div>
				<div id="flavor__down" class="down__flavor">
					${lines[2]}
				</div>
				<div class="flavor__arrow-container">
					<div id="flavor-down-arrow" class="flavor__down-arrow"></div>
				</div>
			</div>
		</div>`;
	}

	#obtainFlavorHtmlLines(isTop) {
		let flavorLines = this.#pokeFormatter.getFormattedFlavor().split('\n');
		let lines = [[], [], []];
		let index = isTop ? 0 : 3;

		for (let i = 0; i < 18; i++) {
			lines[0] += `<div class="flavor__letter">${flavorLines[index][i] || ' '}</div>\n`;
			lines[1] += `<div class="flavor__letter">${flavorLines[index + 1][i] || ' '}</div>\n`;
			lines[2] += `<div class="flavor__letter">${flavorLines[index + 2][i] || ' '}</div>\n`;
		}

		return lines;
	}
}

export default PokedexUpdater