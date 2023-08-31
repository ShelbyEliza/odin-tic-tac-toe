/** Sets up Board, Checks for Valid Moves, Changes board textContent */
const gameBoard = (() => {
	const boardEls = [...document.querySelectorAll(".marker-place")];
	let markedBoard = [];

	boardEls.forEach((el) => {
		el.addEventListener("click", (e) => handleSelect(e));
		markedBoard.push(parseInt(el.id));
	});
	console.log(markedBoard);

	function handleSelect(e) {
		let isDisplayBuilt = displayController.getDisplayStatus();
		if (isDisplayBuilt === true) {
			if (checkSquareStatus(e.target)) {
				addMarker(e.target.id);
			}
		} else {
			console.log("Please select player names!");
		}
	}

	function checkSquareStatus(squareToMark) {
		if (squareToMark.textContent !== "O" && squareToMark.textContent !== "X") {
			return true;
		} else {
			console.log("invalid square");
			return false;
		}
	}

	function addMarker(currentSelection) {
		let currentMarker = displayController.getCurrentTurn();
		let squareToMark = boardEls[currentSelection - 1];

		squareToMark.textContent = currentMarker;
		markedBoard.splice(1, 1, currentMarker);
		console.log(markedBoard);
		displayController.toggleCurrentTurn();
		let numberOfTurns = displayController.getTurnsPlayed();
		if (numberOfTurns >= 5) {
			checkForWin();
		}
	}

	function checkForWin() {}

	return {
		boardEls,
	};
})();

const displayController = (() => {
	const playerForm = document.querySelector(".form-wrapper");
	const playerInputsEl = [...document.querySelectorAll("input")];
	const setPlayersBtn = document.querySelector(".set-players-btn");

	const playerDetails = document.querySelector(".player-details");

	const playerXName = document.querySelector(".player-x-name");
	const playerXScore = document.querySelector(".player-x-score");
	const playerOName = document.querySelector(".player-o-name");
	const playerOScore = document.querySelector(".player-o-score");

	let playerX;
	let playerO;
	let currentTurn = "X";
	let displayBuilt = false;
	let turnsPlayed = 0;

	const getCurrentTurn = () => currentTurn;
	const getTurnsPlayed = () => turnsPlayed;
	const setTurnsPlayed = () => turnsPlayed++;

	setPlayersBtn.addEventListener("click", (e) => {
		setPlayers(e);
	});

	const checkIfValidName = (inputs) => {
		let res = true;
		inputs.forEach((input) => {
			if (input.value.length <= 0) {
				console.log(
					`${input.id} is too short. Please enter a name between 1 and 22 characters.`
				);
				res = false;
			} else if (input.length >= 23) {
				console.log(
					`${input.id} is too long. Please enter a name between 1 and 22 characters.`
				);
				res = false;
			} else {
				console.log(`${input.id} is valid.`);
			}
		});
		return res;
	};

	const setPlayers = (e) => {
		e.preventDefault();
		if (checkIfValidName(playerInputsEl)) {
			playerX = Player(playerInputsEl[0].value, "X");
			playerO = Player(playerInputsEl[1].value, "O");
			playerForm.style.display = "none";
			buildDisplay(playerX, playerO);
			return;
		}
	};

	const buildDisplay = (playerX, playerO) => {
		playerDetails.style.display = "grid";
		playerXName.textContent = playerX.name;
		playerXScore.textContent = playerX.score;
		playerOName.textContent = playerO.name;
		playerOScore.textContent = playerO.score;

		playerXName.classList.add("currentTurn");

		displayBuilt = true;
	};
	const getDisplayStatus = () => displayBuilt;

	const toggleCurrentTurn = () => {
		if (currentTurn === "X") {
			currentTurn = "O";
			playerOName.classList.add("currentTurn");
			playerXName.classList.remove("currentTurn");
			return currentTurn;
		} else {
			currentTurn = "X";
			playerOName.classList.remove("currentTurn");
			playerXName.classList.add("currentTurn");
			return currentTurn;
		}
	};

	return {
		toggleCurrentTurn,
		getCurrentTurn,
		getDisplayStatus,
		getTurnsPlayed,
		setTurnsPlayed,
	};
})();

const Player = (name, marker) => {
	let score = 0;

	const increaseScore = () => score++;
	const printScore = () => console.log({ name, score, marker });
	return { increaseScore, printScore, name, score };
};
