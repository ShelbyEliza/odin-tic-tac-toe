let playerX = null;
let playerO = null;

const Player = (name, gameMark) => {
	let score = 0;
	let markList = [];
	let marker = gameMark;

	const getMarkList = () => markList;
	const addToMarkList = (mark) => markList.push(parseInt(mark));
	const clearMarkList = () => (markList = []);
	function increaseScore() {
		this.score++;
	}
	return {
		increaseScore,
		name,
		marker,
		score,
		getMarkList,
		addToMarkList,
		clearMarkList,
	};
};

const gameFlow = (() => {
	let winner = null;
	let turnsPlayed = 1;
	let currentPlayer = null;

	const getWinner = () => winner;
	const getTurnsPlayed = () => turnsPlayed;
	const getCurrentPlayer = () => currentPlayer;

	const setTurnsPlayed = () => turnsPlayed++;

	const setPlayers = (playerInputsEl) => {
		playerX = Player(playerInputsEl[0].value, "X");
		playerO = Player(playerInputsEl[1].value, "O");
		currentPlayer = playerX;
	};

	const toggleCurrentTurn = () => {
		let tempPlayer;
		if (currentPlayer.marker === "X") {
			displayController.highlightCurrentPlayer("X");
			setTurnsPlayed();
			tempPlayer = playerO;
		} else {
			displayController.highlightCurrentPlayer("O");
			setTurnsPlayed();
			tempPlayer = playerX;
		}
		currentPlayer = tempPlayer;
	};

	function checkForWin(currentMarker) {
		let markList;
		const firstCol = [1, 4, 7];
		const secondCol = [2, 5, 8];
		const thirdCol = [3, 6, 9];
		const firstRow = [1, 2, 3];
		const secondRow = [4, 5, 6];
		const thirdRow = [7, 8, 9];
		const firstDiagonal = [1, 5, 9];
		const secondDiagonal = [3, 5, 7];

		if (currentMarker == "X") {
			markList = playerX.getMarkList();
			currentPlayer = playerX;
		} else {
			markList = playerO.getMarkList();
			currentPlayer = playerO;
		}

		let checker = (playerList, winningCodes) =>
			winningCodes.every((n) => playerList.includes(n));

		switch (true) {
			case checker(markList, firstRow):
				winner = currentPlayer;
				break;
			case checker(markList, secondRow):
				winner = currentPlayer;
				break;
			case checker(markList, thirdRow):
				winner = currentPlayer;
				break;
			case checker(markList, firstCol):
				winner = currentPlayer;
				break;
			case checker(markList, secondCol):
				winner = currentPlayer;
				break;
			case checker(markList, thirdCol):
				winner = currentPlayer;
				break;
			case checker(markList, firstDiagonal):
				winner = currentPlayer;
				break;
			case checker(markList, secondDiagonal):
				winner = currentPlayer;
				break;
			default:
				break;
		}
		if (winner) {
			displayController.setMsgEl(`${winner.name} wins!`);
			gameBoard.removeClickable();
			if (winner.marker == "X") {
				playerX.increaseScore();
				displayController.setScore(playerX);
			} else {
				playerO.increaseScore();
				displayController.setScore(playerO);
			}
		} else if (turnsPlayed >= 9) {
			displayController.setMsgEl("A tie has occurred! Try Again?");
		} else {
			toggleCurrentTurn();
		}
	}

	const handleNewGame = () => {
		playerX = null;
		playerO = null;
		turnsPlayed = 1;
		winner = null;
	};
	const handleNewRound = () => {
		if (winner === null) {
			currentPlayer = playerX;
		} else {
			currentPlayer = winner;
		}
		winner = null;
		turnsPlayed = 1;
	};

	return {
		setPlayers,
		getTurnsPlayed,
		getCurrentPlayer,
		toggleCurrentTurn,
		checkForWin,
		getWinner,
		handleNewGame,
		handleNewRound,
	};
})();

/** Sets up Board, Checks for Valid Moves, Changes board textContent */
const gameBoard = (() => {
	const boardEls = [...document.querySelectorAll(".marker-place")];

	const addListeners = () => {
		boardEls.forEach((el) => {
			el.addEventListener("click", handleSelectSquare);
		});
	};
	function removeClickable() {
		boardEls.forEach((el) => {
			el.classList.remove("clickable");
		});
	}

	function resetSquares() {
		boardEls.forEach((square) => {
			square.textContent = "";
			square.classList = "marker-place clickable";
		});
	}

	function handleSelectSquare(e) {
		let isDisplayBuilt = displayController.getDisplayStatus();
		if (isDisplayBuilt === true) {
			if (checkSquareStatus(e.target)) {
				let currentMarker = gameFlow.getCurrentPlayer().marker;
				addMarker(currentMarker, e.target);

				if (currentMarker == "X") {
					playerX.addToMarkList(e.target.id);
				} else {
					playerO.addToMarkList(e.target.id);
				}
				let numberOfTurns = gameFlow.getTurnsPlayed();

				if (numberOfTurns >= 5) {
					gameFlow.checkForWin(currentMarker);
				} else {
					gameFlow.toggleCurrentTurn();
				}
			}
		} else {
			displayController.setMsgEl("Please select player names!");
		}
	}

	function checkSquareStatus(squareToMark) {
		let winner = gameFlow.getWinner();
		if (
			squareToMark.textContent !== "O" &&
			squareToMark.textContent !== "X" &&
			winner === null
		) {
			displayController.setMsgEl("");
			return true;
		} else {
			return false;
		}
	}

	function addMarker(currentMarker, currentSelection) {
		let squareToMark = boardEls[currentSelection.id - 1];
		let lowerMarker = currentMarker.toLowerCase();
		squareToMark.classList.add(`${lowerMarker}-square`);
		squareToMark.classList.remove("clickable");

		squareToMark.textContent = currentMarker;
	}

	addListeners();
	return {
		resetSquares,
		removeClickable,
	};
})();

const displayController = (() => {
	const msgEl = document.querySelector(".msg-text");
	const playerForm = document.querySelector("form");
	const playerInputsEl = [...document.querySelectorAll("input")];
	const setPlayersBtn = document.querySelector(".set-players-btn");

	const playerDetails = document.querySelector(".player-details");

	const playerXName = document.querySelector(".player-x-name");
	const playerXScore = document.querySelector(".player-x-score");
	const playerOName = document.querySelector(".player-o-name");
	const playerOScore = document.querySelector(".player-o-score");

	const newGameBtn = document.querySelector(".new-game");
	const newRoundBtn = document.querySelector(".new-round");

	newGameBtn.addEventListener("click", () => {
		gameFlow.handleNewGame();
		gameBoard.resetSquares();
		resetGameDisplay();
	});
	newRoundBtn.addEventListener("click", () => {
		gameFlow.handleNewRound();
		gameBoard.resetSquares();
		playerO.clearMarkList();
		playerX.clearMarkList();

		resetRoundDisplay();
	});

	const resetGameDisplay = () => {
		displayBuilt = false;
		msgEl.textContent = "";
		playerDetails.style.display = "none";
		playerForm.style.display = "block";
		newGameBtn.style.display = "none";
		newRoundBtn.style.display = "none";
	};

	const resetRoundDisplay = () => {
		msgEl.textContent = "";
	};

	let displayBuilt = false;

	setPlayersBtn.addEventListener("click", handleStartGame);

	function handleStartGame(e) {
		e.preventDefault();
		if (checkIfValidName(playerInputsEl)) {
			gameFlow.setPlayers(playerInputsEl);
			buildDisplay(playerX, playerO);
			return;
		}
	}
	const checkIfValidName = (inputs) => {
		let validName = true;
		inputs.forEach((input) => {
			if (input.value.length <= 0) {
				msgEl.textContent = `Name(s) too short. Please enter a name between 1 and 22 characters.`;
				validName = false;
			}
		});
		return validName;
	};

	const buildDisplay = (playerX, playerO) => {
		msgEl.textContent = "";
		playerForm.style.display = "none";
		playerDetails.style.display = "grid";
		playerXName.textContent = playerX.name;
		playerXScore.textContent = playerX.score;
		playerOName.textContent = playerO.name;
		playerOScore.textContent = playerO.score;

		newGameBtn.style.display = "block";
		newRoundBtn.style.display = "block";

		playerXName.classList.add("currentTurn");

		displayBuilt = true;
	};
	const setScore = (player) => {
		if (player.marker == "X") {
			playerXScore.textContent = playerX.score;
		} else {
			playerOScore.textContent = playerO.score;
		}
	};

	const getDisplayStatus = () => displayBuilt;
	const setMsgEl = (newMsg) => (msgEl.textContent = newMsg);
	const highlightCurrentPlayer = (currentTurn) => {
		if (currentTurn === "X") {
			playerOName.classList.add("currentTurn");
			playerXName.classList.remove("currentTurn");
		} else {
			playerOName.classList.remove("currentTurn");
			playerXName.classList.add("currentTurn");
		}
	};

	return {
		highlightCurrentPlayer,
		getDisplayStatus,
		setMsgEl,
		setScore,
		resetGameDisplay,
	};
})();
