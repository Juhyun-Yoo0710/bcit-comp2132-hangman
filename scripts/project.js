// file url
const fetchFileURL = "../data/words.json";

const divHint = document.getElementById("div_hint");
const divWord = document.getElementById("div_worddisplay");
const divResult = document.getElementById("div_result");
const divIncorrect = document.getElementById("div_incorrect");
const imgArea = document.getElementById("img_area");

// game object
let game = {
    word: "",
    hint: "",
    guessed: [],
    wrong: 0,
    maxWrong: 7
};

// update word display
function updateWordDisplay() {
    let html = "";
    for (let i = 0; i < game.word.length; i++) {
        
        let ch = game.word[i];
        //console.log("game.guessed " + game.guessed);
        if (game.guessed.includes(ch)) {
            html += `<span class="letter-box">${ch}</span>`;
        } else {
            html += `<span class="letter-box">&nbsp;</span>`;
        }
    }    
    divWord.innerHTML = html;
}

// image update
function updateHangmanImage() {
    setHangmanImage(`../images/hangman${game.wrong}.png`);
}

//image update 
function setHangmanImage(src) {
    imgArea.classList.remove("fade-in");

    imgArea.onload = function () {
        imgArea.classList.add("fade-in");
    };

    imgArea.src = src;
}

// disable letter button
function disableLetter(letter) {
    let btn = document.getElementById("btn_" + letter);
    if (btn) btn.disabled = true;
}

// disable all buttons
function disableAllButtons() {
    document.querySelectorAll(".letter_button").forEach(b => b.disabled = true);
}

// enable all buttons
function enableAllButtons() {
    document.querySelectorAll(".letter_button").forEach(b => b.disabled = false);
}

// Random word pick
function pickRandomWord(list) {
    let idx = Math.floor(Math.random() * list.length);
    return list[idx];
}

// game start
function startGame() {

    // fetch JSON file
    fetch(fetchFileURL)
        .then(response => response.json())
        .then(data => {

            let picked = pickRandomWord(data);

            // init game state
            game.word = picked.word.toLowerCase();
            game.hint = picked.hint;
            game.guessed = [];
            game.wrong = 0;

            // init display
            divHint.textContent = "Hint: " + game.hint;
            divResult.textContent = "";
            divIncorrect.textContent = `Incorrect guesses: 0/${game.maxWrong}`;
            document.getElementById("btn_playagain").style.display = "none";

            enableAllButtons();
            updateWordDisplay();
            updateHangmanImage();
        })
        .catch(() => {
            console.log("Catch fetch error");
        });
}

// when letter button clicked
function handleGuess(letter) {

    // if already guessed, ignore
    if (game.guessed.includes(letter)) return;
    
    //add to guessed list and disable button
    game.guessed.push(letter);
    disableLetter(letter);

    // check if correct
    if (game.word.includes(letter)) {
        updateWordDisplay();
    } else {
        game.wrong++;
        divIncorrect.textContent = `Incorrect guesses: ${game.wrong}/${game.maxWrong}`;
        updateHangmanImage();
    }

    // check win or lose
    let allCorrect = true;
    for (let i = 0; i < game.word.length; i++) {
        if (!game.guessed.includes(game.word[i])) {
            allCorrect = false;
            break;
        }
    }
    //success check
    if (allCorrect) {
        divResult.textContent = `🎉 You Win! Word was: '${game.word}'`;
        setHangmanImage("../images/hangman_success.png");
        disableAllButtons();
        document.getElementById("btn_playagain").style.display = "block";
        return;
    }

    // failure check
    if (game.wrong >= game.maxWrong) {
        divResult.textContent = `❌ You Lose! Word was: '${game.word}'`;
        setHangmanImage("../images/hangman_failure.png");
        disableAllButtons();
        document.getElementById("btn_playagain").style.display = "block";
        return;
    }
}

// event listeners
document.addEventListener("DOMContentLoaded", function () {

    startGame();

    let letters = "abcdefghijklmnopqrstuvwxyz".split("");
    letters.forEach(letter => {
        let btn = document.getElementById("btn_" + letter);
        btn.addEventListener("click", function () {
            handleGuess(letter);
        });
    });

    document.getElementById("btn_playagain").addEventListener("click", startGame);
});
