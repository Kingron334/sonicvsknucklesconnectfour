/*-------------- Video -------------*/
const sonicVideo = document.getElementById("sonic-win-video");
const knucklesVideo = document.getElementById("knuckles-win-video");

function playVideo(type) {
    if (type === "sonic") {
        sonicVideo.classList.add("active");
        sonicVideo.currentTime = 0;
        sonicVideo.play();
        setTimeout(() => {
            sonicVideo.classList.remove("active");
        }, 4500);
    }
    else if (type === "knuckles") {
        knucklesVideo.classList.add("active");
        knucklesVideo.currentTime = 0;
        knucklesVideo.play();
        setTimeout(() => {
            knucklesVideo.classList.remove("active");
        }, 4500);
    }
};



/*-------------- Audio -------------*/
const audio = document.getElementById("background-music");
const sega = document.getElementById("sega-sound");
const ringSound = document.getElementById("ring-sound");
const resetSound = document.getElementById("reset-sound");
const audioPlaylist = [
    "music/title.mp3",
    "music/green-hill.mp3",
    "music/marble-zone.mp3",
    "music/spring-zone.mp3",
    "music/lab-zone.mp3",
    "music/bonus-zone.mp3",
    "music/starlight-zone.mp3",
    "music/brain-zone.mp3",
    "music/boss.mp3",
    "music/final-zone.mp3",
    "music/special-zone.mp3",
    "music/ending.mp3"
];
let currentTrack = 0;
function playTrack() {
    audio.src = audioPlaylist[currentTrack];
    audio.play();
}
audio.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % audioPlaylist.length;
    playTrack();
})
audio.volume = 0.1;


/*-------------- Constants -------------*/
const board_width = 7;
const board_height = 6;
const total_squares = board_width * board_height;
const sonic = 1;
const knuckles = 2;

/*---------- Variables (state) ---------*/
let squares = [];
let currentPlayer;
let startingPlayer;
let sonicWins = 0;
let knucklesWins = 0;
let players = 1;
let winner = false;
let ringTimeOut;
let gridMade = false;
/*----- Cached Element References  -----*/
const grid = document.querySelector(".grid");
const ringButtons = document.querySelectorAll(".ring-button");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset");
const nextGameButton = document.querySelector("#next-game");
const sonicScore = document.querySelector("#sonic-score");
const knucklesScore = document.querySelector("#knuckles-score");
const playerSelectButton = document.querySelector("#player-select");
const onePlayerButton = document.querySelector("#one-player");
const twoPlayerButton = document.querySelector("#two-player");

/*-------------- Functions -------------*/
// initializing the game board set up
function init() {
    // squares = [];
    if (!gridMade) {
        for (let i = 0; i < total_squares; i++) {
            const square = document.createElement("div");
            squares.push(square);
            square.classList.add("square");
            grid.appendChild(square);
            console.log(`Square ${i} created and appended`);
        }
        gridMade = true;
    }
    currentPlayer = sonic;
    startingPlayer = sonic;
    updateScoreboard();
    console.log(gridMade);
}
// update the scoreboard display
function updateScoreboard() {
    if (sonicWins < 10) {
        sonicScore.innerHTML = `0${sonicWins}`
    }
    if (knucklesWins < 10) {
        knucklesScore.innerHTML = `0${knucklesWins}`
    }
    if (sonicWins > 9) {
        sonicScore.innerHTML = `${sonicWins}`
    }
    if (knucklesWins > 9) {
        knucklesScore.innerHTML = `${knucklesWins}`;
    }
}

// Drop a disc in selected column
function dropPiece(column) {
    for (let row = board_height - 1; row >= 0; row--) {
        const squareIndex = row * board_width + column;
        if (!squares[squareIndex].classList.contains("sonic") && !squares[squareIndex].classList.contains("knuckles")) {
            if (currentPlayer === sonic) {
                squares[squareIndex].classList.add("sonic");
            } else {
                squares[squareIndex].classList.add("knuckles");
            } currentPlayer = currentPlayer === sonic ? knuckles : sonic;
            break;

        }
    }
}

// Check for win
function checkForWin() {
    //check horizontallly
    for (let row = 0; row < board_height; row++) {
        for (let col = 0; col < board_width - 3; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains("sonic") &&
                squares[squareIndex + 1].classList.contains("sonic") &&
                squares[squareIndex + 2].classList.contains("sonic") &&
                squares[squareIndex + 3].classList.contains("sonic")) {
                sonicWins++;
                updateScoreboard();
                winner = true;
                playVideo("sonic");

            }
            if (squares[squareIndex].classList.contains("knuckles") &&
                squares[squareIndex + 1].classList.contains("knuckles") &&
                squares[squareIndex + 2].classList.contains("knuckles") &&
                squares[squareIndex + 3].classList.contains("knuckles")) {
                knucklesWins++;
                updateScoreboard();
                winner = true;
                playVideo("knuckles");
            }
        }
    }


    //check vertically 
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 0; col < board_width; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains("sonic") &&
                squares[squareIndex + board_width].classList.contains("sonic") &&
                squares[squareIndex + 2 * board_width].classList.contains("sonic") &&
                squares[squareIndex + 3 * board_width].classList.contains("sonic")) {
                sonicWins++;
                updateScoreboard();
                winner = true;
                playVideo("sonic");

            } if (squares[squareIndex].classList.contains("knuckles") &&
                squares[squareIndex + board_width].classList.contains("knuckles") &&
                squares[squareIndex + 2 * board_width].classList.contains("knuckles") &&
                squares[squareIndex + 3 * board_width].classList.contains("knuckles")) {
                knucklesWins++;
                updateScoreboard();
                winner = true;
                playVideo("knuckles");
            }
        }
    }

    // Check diagonally (positive slope)
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 0; col < board_width - 3; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains("sonic") &&
                squares[squareIndex + (board_width + 1)].classList.contains("sonic") &&
                squares[squareIndex + 2 * (board_width + 1)].classList.contains("sonic") &&
                squares[squareIndex + 3 * (board_width + 1)].classList.contains("sonic")) {
                sonicWins++;
                updateScoreboard();
                winner = true;
                playVideo("sonic");
            }
            if (squares[squareIndex].classList.contains("knuckles") &&
                squares[squareIndex + (board_width + 1)].classList.contains("knuckles") &&
                squares[squareIndex + 2 * (board_width + 1)].classList.contains("knuckles") &&
                squares[squareIndex + 3 * (board_width + 1)].classList.contains("knuckles")) {
                knucklesWins++;
                updateScoreboard();
                winner = true;
                playVideo("knuckles");
            }
        }
    }

    // Check diagonally (negative slope)
    for (let row = 0; row < board_height - 3; row++) {
        for (let col = 3; col < board_width; col++) {
            const squareIndex = row * board_width + col;
            if (squares[squareIndex].classList.contains("sonic") &&
                squares[squareIndex + (board_width - 1)].classList.contains("sonic") &&
                squares[squareIndex + 2 * (board_width - 1)].classList.contains("sonic") &&
                squares[squareIndex + 3 * (board_width - 1)].classList.contains("sonic")) {
                sonicWins++;
                updateScoreboard();
                winner = true;
                playVideo("sonic");
            }
            if (squares[squareIndex].classList.contains("knuckles") &&
                squares[squareIndex + (board_width - 1)].classList.contains("knuckles") &&
                squares[squareIndex + 2 * (board_width - 1)].classList.contains("knuckles") &&
                squares[squareIndex + 3 * (board_width - 1)].classList.contains("knuckles")) {

                knucklesWins++;
                updateScoreboard();
                winner = true;
                playVideo("knuckles");
            }
        }
    }
    if (winner) {
        clearTimeout(ringTimeOut);
        disableButtons(".ring-button");
        enableButtons("#next-game");
    }
}
// Reset the gmae board 

function resetGame() {
    squares.forEach(square => {
        square.classList.remove("sonic", "knuckles");
    });
    currentPlayer = startingPlayer;
    winner = false;
    disableButtons("#next-game");
}
// Making buttons unable to be clicked
function disableButtons(selector) {

    document.querySelectorAll(selector).forEach(button => {
        button.disabled = true;
    });

};
function enableButtons(selector) {

    document.querySelectorAll(selector).forEach(button => {
        button.disabled = false;
    });

};

/*----------- Event Listeners ----------*/
// Add click to ring buttons
ringButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        ringSound.play();
        disableButtons(".ring-button");
        const column = index;
        if (players === 1) {
            const aiColumn = Math.floor(Math.random() * 7);
            dropPiece(column);
            setTimeout(() => {
                if (!winner) {
                    dropPiece(aiColumn)
                    checkForWin();
                }
            }, 2000);

        }

        else {
            dropPiece(column);
        }
        setTimeout(() => {
            checkForWin();
        }, 1000);
        ringTimeOut = setTimeout(() => {
            enableButtons(".ring-button");
        }, 3000);
    });
});


// Start button (resets the game)

startButton.addEventListener("click", () => {
    playTrack();
    init();
    document.querySelector(".start-screen").classList.remove("active");
    document.querySelector(".background").classList.add("active");
    enableButtons(".ring-button");

});

// Player select button
playerSelectButton.addEventListener("click", () => {
    resetGame();
    document.querySelector(".background").classList.remove("active");
    document.querySelector(".start-screen").classList.add("active");
    sonicWins = 0;
    knucklesWins = 0;

    audio.pause();
    audio.currentTime = 0;
    currentTrack = 0;

});

// Reset button
resetButton.addEventListener("click", () => {
    disableButtons(".ring-button, #reset, #next-game, #player-select");
    sonicWins = 0;
    knucklesWins = 0;
    updateScoreboard();
    resetGame();
    audio.pause();
    resetSound.play();
    setTimeout(() => {
        audio.play();
        enableButtons(".ring-button, #reset, #player-select");
    }, 12000);
});

// Next game button
nextGameButton.addEventListener("click", () => {
    if (players === 2) {
        startingPlayer = startingPlayer === sonic ? knuckles : sonic;
    }
    resetGame();
    enableButtons(".ring-button");
});

// Select One player or Two Player Game
onePlayerButton.addEventListener("click", () => {
    twoPlayerButton.classList.remove("selected");
    onePlayerButton.classList.add("selected");
    players = 1;
    sega.play();

});

twoPlayerButton.addEventListener("click", () => {
    onePlayerButton.classList.remove("selected");
    twoPlayerButton.classList.add("selected");
    players = 2;
    sega.play();

});


