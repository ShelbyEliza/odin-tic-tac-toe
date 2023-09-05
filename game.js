let playerX;
let playerO;

const Player = (name, gameMark) => {
	let score = 0;
	let markList = [];
	let marker = gameMark;

	const getMarkList = () => markList;
	const addToMarkList = (mark) => markList.push(parseInt(mark));
	function increaseScore() {
		this.score++;
	}
	const printScore = () => console.log({ name, score, marker });
	return {
		increaseScore,
		printScore,
		name,
		marker,
		score,
		addToMarkList,
		getMarkList,
	};
};

const gameFlow = (() => {
	let winner = null;
	let currentPlayer;
	let turnsPlayed = 1;

	const setPlayers = (playerInputsEl) => {
		playerX = Player(playerInputsEl[0].value, "X");
		playerO = Player(playerInputsEl[1].value, "O");
		currentPlayer = playerX;
	};
	const setTurnsPlayed = () => turnsPlayed++;
	const setCurrentPlayer = (player) => {
		currentPlayer = player;
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
		setCurrentPlayer(tempPlayer);
	};
	const getTurnsPlayed = () => turnsPlayed;
	const getCurrentPlayer = () => currentPlayer;
	const getWinner = () => {
		winner;
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
		let checker = (array, targetArray) =>
			targetArray.every((n) => array.includes(n));
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
				console.log("No Winner!");
		}
		if (winner) {
			displayController.setMsgEl(`${winner.name} wins!`);
			if (winner.marker == "X") {
				console.log(playerX.score);
				playerX.increaseScore();
				console.log(playerX.score);

				displayController.setScore(playerX);
			} else {
				console.log();
				playerO.increaseScore();
				displayController.setScore(playerO);
			}
		} else {
			toggleCurrentTurn();
		}
	}

	return {
		setPlayers,
		getTurnsPlayed,
		getCurrentPlayer,
		toggleCurrentTurn,
		checkForWin,
		getWinner,
	};
})();

/** Sets up Board, Checks for Valid Moves, Changes board textContent */
const gameBoard = (() => {
	const boardEls = [...document.querySelectorAll(".marker-place")];
	// let markedBoard = [];

	boardEls.forEach((el) => {
		el.addEventListener("click", (e) => handleSelectSquare(e));
		// markedBoard.push(parseInt(el.id));
	});

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
			console.log("Please select player names!");
		}
	}

	function checkSquareStatus(squareToMark) {
		displayController.setMsgEl("");
		if (squareToMark.textContent !== "O" && squareToMark.textContent !== "X") {
			return true;
		} else {
			displayController.setMsgEl("Invalid Square");
			return false;
		}
	}

	function addMarker(currentMarker, currentSelection) {
		let squareToMark = boardEls[currentSelection.id - 1];
		let lowerMarker = currentMarker.toLowerCase();
		squareToMark.classList.add(`${lowerMarker}-square`);
		squareToMark.classList.remove("clickable");

		squareToMark.textContent = currentMarker;
		// markedBoard.splice(1, 1, currentMarker);
	}
})();

const displayController = (() => {
	const msgEl = document.querySelector(".msg-text");
	const playerForm = document.querySelector(".form-wrapper");
	const playerInputsEl = [...document.querySelectorAll("input")];
	const setPlayersBtn = document.querySelector(".set-players-btn");

	const playerDetails = document.querySelector(".player-details");

	const playerXName = document.querySelector(".player-x-name");
	const playerXScore = document.querySelector(".player-x-score");
	const playerOName = document.querySelector(".player-o-name");
	const playerOScore = document.querySelector(".player-o-score");

	let displayBuilt = false;

	setPlayersBtn.addEventListener("click", (e) => {
		handleStartGame(e);
	});

	const handleStartGame = (e) => {
		e.preventDefault();
		if (checkIfValidName(playerInputsEl)) {
			gameFlow.setPlayers(playerInputsEl);
			buildDisplay(playerX, playerO);
			return;
		}
	};
	const checkIfValidName = (inputs) => {
		let validName = true;
		inputs.forEach((input) => {
			if (input.value.length <= 0) {
				msgEl.textContent = `Name(s) too short. Please enter a name between 1 and 22 characters.`;
				console.log(
					`Name(s) too short. Please enter a name between 1 and 22 characters.`
				);
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
	};
})();
