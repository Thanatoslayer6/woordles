<script>
  import { getRandomWord, isWordValid, getRandomFreeplay } from "../words";
  import { confetti } from "@neoconfetti/svelte";
  import { fade, scale } from "svelte/transition";
  import { onMount } from "svelte";    
  import { freeplayState } from "../stores";
  import { beforeNavigate } from "$app/navigation";

  // let secretWord = getRandomWord().toUpperCase();
  let letters = []; // Array to store the letters for each grid item
  let currentActiveRow = 0;
  let currentActiveColumn = 0;
  let writtenWords = [];
  let woordleData = [];
  let secretWord, isGameWon, gameHasStarted;

  onMount(async () => {
    // Load status (first check if there is data stored)
    if ($freeplayState) { // If there is something stored in the writable
      console.log("There is something stored bruh");
      // Load the stuff
      letters = $freeplayState.letters;
      currentActiveRow = $freeplayState.currentActiveRow;
      currentActiveColumn = $freeplayState.currentActiveColumn;
      writtenWords = $freeplayState.writtenWords;
      secretWord = $freeplayState.secretWord;
      isGameWon = $freeplayState.isGameWon;
      gameHasStarted = $freeplayState.gameHasStarted;
      woordleData = $freeplayState.woordleData;

      // Render the tiles properly
      for (let j = 0; j < woordleData.length; j++) {
        // Animate the whole row indicating that the word is invalid
        for (let i = 0; i < 6; i++) {
          let placeholder = document.querySelector(
            `[data-num="${j}-${i}"]`
          );
          placeholder.textContent = woordleData[j][i].letter;
          await timer(50);
          placeholder.style.borderColor = woordleData[j][i].color;
          await timer(50);
          placeholder.style.backgroundColor = woordleData[j][i].color;
          placeholder.style.color = "white";
          placeholder.animate(
            { transform: ["rotateX(0deg)", "rotateX(90deg)", "rotateX(0deg)"] },
            { duration: 250, easing: "ease-in-out" }
          );
        }

      }

      // // Render the tiles properly
      // woordleData.forEach(async(item, index) => {
      //   // Animate the whole row indicating that the word is invalid
      //   for (let i = 0; i < 6; i++) {
      //     let placeholder = document.querySelector(
      //       `[data-num="${index}-${i}"]`
      //     );
      //     placeholder.textContent = item[i].letter;
      //     placeholder.style.borderColor = item[i].color;
      //     placeholder.style.backgroundColor = item[i].color;
      //     placeholder.style.color = "white";

      //     await timer(1000);

      //     placeholder.animate(
      //       { transform: ["rotateX(0deg)", "rotateX(90deg)", "rotateX(0deg)"] },
      //       { duration: 300, easing: "ease-in-out" }
      //     );

      //   }

      // })

    } else {
      secretWord = getRandomWord().toUpperCase();
      animateGrid(false)
    }

    console.log(`The secret word is: ${secretWord}`);
  });

  beforeNavigate(() => {
    // Save the current status
    $freeplayState = {
      secretWord: secretWord,
      letters: letters,
      currentActiveRow: currentActiveRow,
      currentActiveColumn: currentActiveColumn,
      writtenWords: writtenWords,
      isGameWon: isGameWon,
      gameHasStarted: gameHasStarted,
      woordleData: woordleData
    }
    console.log($freeplayState);
    // Temporarily reset the grid to avoid overflowing
    isGameWon = undefined;
    gameHasStarted = undefined;
  })

  function animateGrid(clear) {
    let placeholders = document.querySelectorAll(".placeholder");
    placeholders.forEach(item => {
      if (clear) {
          item.textContent = "";
          item.style = "";
          item.animate(
            [
              { opacity: 0.5, transform: "rotateY(0deg)" },
              { opacity: 1, transform: "rotateY(180deg)" }
            ],
            { duration: 500, easing: "ease-in-out" }
          )    
      } else {
        item.animate(
            { transform: ["scale(0)", "scale(1)"] },
            { duration: 500, easing: "ease-in-out" }
        )    
      } 
    })
  }

  function restartGame() {
    isGameWon = undefined;
    gameHasStarted = undefined;
    secretWord = getRandomWord().toUpperCase();
    console.log(`The secret word is: ${secretWord}`);
    letters = []; // Array to store the letters for each grid item
    currentActiveRow = 0;
    currentActiveColumn = 0;
    writtenWords = [];
    woordleData = [];
    animateGrid(true); // Animate grid
  }

  function handleKeyDown(event) {
    let { key } = event;
    // Try to render the letter
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      addLetterOnGrid(key.toUpperCase());
    }

    if (key == "Enter") {
      if (letters.length != 6) return;
      formLettersAsWord();
      validateWord();
    }

    if (key == "Backspace") {
      removeLetterOnGrid();
    }
  }

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const validateWord = async () => {
    // First we validate the formed word pushed in `writtenWords`
    let formedWord = writtenWords[writtenWords.length - 1];
    let validityOfWord = await isWordValid(formedWord);
    if (Array.isArray(validityOfWord)) {
        // Word is valid 
        console.log("Word is valid... please proceed...");
        gameHasStarted = true; // Start the game
    } else {
        // Word is invalid 
        console.log("Word is invalid!");
        writtenWords.pop(); // Remove word from the list
        // Animate the whole row indicating that the word is invalid
        for (let i = 0; i < 6; i++) {
          let placeholder = document.querySelector(
            `[data-num="${currentActiveRow}-${i}"]`
          );
          placeholder.animate(
            { transform: ["translateX(0)", "translateX(-5px)", "translateX(5px)", "translateX(0)"] },
            { duration: 150 }
          );
        }
        return;
    }
    let checkWordle = secretWord;
    const guess = [];
    // Step 1: Check the right letters first, then remove them to solve duplicated letters problems
    // console.log(formedWord);
    for (let i = 0; i < 6; i++) {
      if (
        checkWordle.includes(formedWord[i]) &&
        checkWordle[i] == formedWord[i]
      ) {
        guess[i] = "#538d4e";
        checkWordle = checkWordle.replace(formedWord[i], "-");
      } else {
        guess[i] = "#3a3a3c";
      }
    }

    // Step 2: Check for the incorrectly placed letters
    for (let i = 0; i < 6; i++) {
      if (checkWordle.includes(formedWord[i]) && guess[i] != "#538d4e") {
        guess[i] = "#b59f3a";
      }
    }

    // Step 3: Render everything add some animation
    for (let i = 0; i < 6; i++) {
      let placeholder = document.querySelector(
        `[data-num="${currentActiveRow}-${i}"]`
      );
      placeholder.animate(
        { transform: ["rotateX(0deg)", "rotateX(90deg)", "rotateX(0deg)"] },
        { duration: 150 }
      );
      placeholder.style.borderColor = guess[i];
      placeholder.style.backgroundColor = guess[i];
      placeholder.style.color = "white";
      await timer(150);
    }

    setTimeout(() => {
      if (formedWord === secretWord) {
        isGameWon = true;
        return;
      }
      if (currentActiveRow == 6) {
        isGameWon = false;
        return;
      }
    }, 250); 

    // Save woordle data
    let temp = letters.map((item, index) => {
      return {
        letter: item, // The letter
        color: guess[index] // The color (status of the letter)
      } 
    });
    woordleData.push(temp)
    // Go next row, if already at last then stop
    currentActiveRow++;
    // Reset values to prepare for the next row
    currentActiveColumn = 0;
    letters = [];
  };

  const formLettersAsWord = () => {
    let formedWord = letters.join("");
    console.log(`Adding word -> ${formedWord}`);
    writtenWords.push(formedWord);
    console.log(writtenWords);
  };

  const addLetterOnGrid = (key) => {
    if (letters.length == 6) return;
    letters.push(key);
    // Render
    let placeholder = document.querySelector(
      `[data-num="${currentActiveRow}-${currentActiveColumn}"]`
    );

    placeholder.textContent = key;

    // Trigger animation
    placeholder.animate(
      { transform: ["scale(1)", "scale(1.1)", "scale(1)"] },
      { duration: 150 }
    );

    if (window.document.body.classList.length == 1) {
      // Dark mode
      placeholder.style.border = "2px solid rgba(225, 214, 186, 1)";
    } else {
      placeholder.style.border = "2px solid rgba(50, 50, 50, 0.8)";
    }
    currentActiveColumn++;
  };

  const removeLetterOnGrid = () => {
    if (letters.length == 0) return;
    console.log(letters);
    letters.pop();
    // Render
    let placeholder = document.querySelector(
      `[data-num="${currentActiveRow}-${currentActiveColumn - 1}"]`
    );
    placeholder.textContent = "";
    placeholder.style.border = "";
    currentActiveColumn--;
  };
</script>

<svelte:window on:keydown={(event) => { if (isGameWon == undefined) handleKeyDown(event);}}/>
<div>
  {#if isGameWon == true}
    <div class="dialog-overlay">
      <div transition:scale class="dialog-box">
        <h3 style="font-weight: 600; font-size: xx-large;">Congratulations!</h3>
        <div use:confetti />
        <p>
          The answer is <span class="secretWord">{secretWord.toUpperCase()}</span>
        </p>
        <p style="font-style: italic; font-size: small;">
          <a href="https://wordfind.org/dictionary/{secretWord.toLowerCase()}" target="_blank" rel="noopener noreferrer">
            What does this word mean?
          </a>
        </p>
        <button class="newGameButton" on:click={restartGame}>New Game</button>

        <button
          class="closeButton"
          on:click={() => {
            isGameWon = -1;
          }}>Close</button
        >
      </div>
    </div>
  {:else if isGameWon == false}
    <div class="dialog-overlay">
      <div transition:scale class="dialog-box">
        <h3 style="font-weight: 600; font-size: xx-large;">Game Over!</h3>
        <p>
          The answer is <span class="secretWord">{secretWord.toUpperCase()}</span>
        </p>
        <p style="font-style: italic; font-size: small;">
          <a href="https://wordfind.org/dictionary/{secretWord.toLowerCase()}" target="_blank" rel="noopener noreferrer">
            What does this word mean?
          </a>
        </p>
        <button class="newGameButton" on:click={restartGame}>New Game</button>
        <button
          class="closeButton"
          on:click={() => {
            isGameWon = -1;
          }}>Close</button
        >
      </div>
    </div>
  {/if}

  <div class="grid">
      <div style="position: absolute; left: 2em;">
          <span class="gameMode">
              Freeplay
          </span>
          <p style="color: #6aaa64; padding-top: 0.5em; width: 300px;">
              {getRandomFreeplay()}
          </p>
          {#if gameHasStarted == true}
            <div transition:fade={{ duration: 500 }}>
              <button class="resetGameButton" on:click={restartGame}>
                <span class="resetGameIcon">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 860.000000 917.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,917.000000) scale(0.100000,-0.100000)">
                    <path d="M7675 8754 c-16 -8 -241 -226 -500 -484 l-470 -469 -120 84 c-558
                    391 -1143 616 -1815 697 -250 31 -681 31 -930 0 -316 -38 -618 -110 -892 -211
                    -1084 -399 -1879 -1151 -2328 -2201 -426 -996 -426 -2127 -1 -3118 358 -835
                    922 -1471 1696 -1913 290 -166 667 -318 995 -403 786 -202 1645 -155 2390 131
                    571 219 1036 517 1440 922 534 536 925 1266 1078 2016 44 213 82 553 82 733
                    l0 72 -518 0 -519 0 -7 -147 c-49 -1071 -666 -2022 -1623 -2502 -285 -143
                    -570 -232 -903 -282 -134 -20 -192 -24 -430 -24 -310 0 -465 18 -720 81 -833
                    206 -1530 759 -1919 1523 -149 292 -240 581 -293 921 -19 124 -22 186 -22 425
                    0 238 3 301 22 420 131 846 601 1590 1287 2041 408 267 850 430 1320 485 142
                    17 498 17 640 1 413 -49 792 -178 1155 -396 69 -41 136 -84 150 -95 l25 -20
                    -466 -468 c-257 -257 -472 -478 -478 -490 -15 -30 -14 -40 9 -63 20 -20 33
                    -20 1325 -20 1433 0 1334 -4 1389 60 14 17 30 48 36 70 7 26 9 455 8 1320 l-3
                    1282 -24 19 c-28 23 -28 23 -66 3z"/>
                    </g>
                    </svg>
                </span>
                  Reset game
              </button>
              <!-- Only show give up button if user hasn't surrendered or anything !-->
              {#if isGameWon == undefined}
                  <button class="giveUpButton" on:click={() => isGameWon = false}>
                  <span class="giveUpIcon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 493.349 493.349">
                      <g>
                          <path d="M36.547,27.406c-10.089,0-18.702,3.576-25.841,10.706C3.571,45.251,0,53.865,0,63.953c0,6.661,1.665,12.753,4.998,18.271
                              c3.328,5.52,7.755,9.897,13.273,13.134v361.45c0,2.666,0.855,4.856,2.57,6.567c1.712,1.714,3.899,2.566,6.567,2.566h18.271
                              c2.666,0,4.856-0.853,6.567-2.566c1.713-1.711,2.568-3.901,2.568-6.567V95.358c5.52-3.237,9.945-7.614,13.275-13.134
                              c3.332-5.518,4.996-11.613,4.996-18.271c0-10.085-3.567-18.698-10.701-25.841C55.246,30.979,46.632,27.406,36.547,27.406z"/>
                          <path d="M484.51,66.521c-5.903-3.424-11.8-3.612-17.71-0.568c-1.707,0.955-4.661,2.57-8.846,4.854
                              c-35.782,21.317-65.281,31.977-88.504,31.977c-9.709,0-18.183-1.809-25.413-5.424c-21.313-10.468-41.206-18.654-59.669-24.556
                              c-18.463-5.896-38.353-8.848-59.669-8.848c-13.894,0-28.647,1.809-44.252,5.426c-15.608,3.615-30.124,8.326-43.542,14.128
                              c-13.417,5.806-24.27,10.754-32.546,14.847c-8.285,4.093-15.755,8.134-22.414,12.133c-5.901,3.806-8.853,9.04-8.853,15.703
                              v211.842c0,7.042,3.046,12.374,9.136,15.988c3.045,1.526,6.091,2.282,9.137,2.282c3.424,0,6.567-0.855,9.419-2.563
                              c18.081-11.04,39.825-20.752,65.235-29.126c25.413-8.374,47.826-12.562,67.24-12.562c11.035,0,21.89,1.331,32.547,3.997
                              c10.656,2.663,19.321,5.428,25.98,8.278c6.656,2.857,16.077,7.423,28.264,13.706l7.994,3.997
                              c13.319,6.666,28.356,9.999,45.101,9.999c28.746,0,63.861-11.04,105.354-33.119c1.335-0.76,2.95-1.615,4.853-2.57
                              c6.66-3.426,9.996-8.847,9.996-16.272V82.224C493.353,75.563,490.402,70.331,484.51,66.521z M456.804,289.223
                              c-32.928,17.507-60.812,26.261-83.651,26.265c-10.848,0-20.457-2.095-28.839-6.28l-7.99-3.996
                              c-10.472-5.141-18.326-8.898-23.555-11.28c-5.232-2.382-12.566-5.331-21.98-8.85c-9.425-3.521-18.75-5.995-27.979-7.423
                              c-9.229-1.427-19.081-2.139-29.552-2.139c-35.786,0-76.988,10.753-123.624,32.265V136.762
                              c43.78-24.176,82.134-36.262,115.06-36.262c17.893,0,34.831,2.618,50.815,7.853c15.985,5.232,33.5,12.515,52.537,21.838
                              c11.984,6.091,25.786,9.137,41.392,9.137c26.076,0,55.199-8.663,87.367-25.981V289.223L456.804,289.223z"/>
                      </g>
                      </svg>
                  </span>
                  Give up
                  </button>
              {/if}
              </div>
          {/if}
      </div>
    {#each Array.from(Array(6).keys()) as row (row)}
      {#each Array.from(Array(6).keys()) as col (col)}
        <span class="placeholder" data-num="{row}-{col}" />
      {/each}
    {/each}
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* Creates 6 equal-width columns */
    grid-template-rows: repeat(6, 1fr);
    gap: 4px;
    width: 400px; /* Set the width of the grid container */
    height: 400px; /* Set the height of the grid container */
    margin: 3em auto;
  }

  .placeholder {
    font-weight: 600;
    box-sizing: border-box; /* Include border in the element's size calculation */
    display: inline-grid;
    align-items: center;
    text-align: center;
    color: #1c2025;
    border-radius: 6px;
    font-size: xx-large;
    width: 2em;
    height: 2em;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .dialog-box {
    background-color: #ede4ce;
    border-radius: 8px;
    text-align: center;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 1em;
  }

  :global(body) .secretWord {
    border-radius: 4px;
    padding: 4px;
    font-weight: bold;
    border-style: dotted;
    border-width: 2px;
    color: #6aaa64;
  }

  :global(body.dark-mode) .secretWord {
    color: #e1d6ba;
  }

  :global(body.dark-mode) .dialog-box {
    background-color: #1d3040;
  }

  :global(body.dark-mode) .placeholder {
    border: 2px solid #8f90a6;
    background-color: #284359;
    color: #f5edd7;
  }

  :global(body) .placeholder {
    background-color: #f5edd7;
    border: 2px solid rgba(20, 20, 20, 0.3);
  }

  .newGameButton,
  .closeButton {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border-radius: 0.25rem;
    border: none;
    transition: background-color 0.3s ease-in-out;
  }

  .newGameButton:hover, .closeButton:hover {
    background-color: darken(currentColor, 10%);
  }

  :global(body) .gameMode {
    font-size: 24px; 
    font-weight: bold; 
    background-color: #6aaa64; 
    color: #f2eee2;
    border-radius: 4px;
    padding: 0.5em;
    font-weight: bold;
    border-width: 2px;
  }

  :global(body.dark-mode) .gameMode {
    color: #1d3040;
  }

  :global(body) .resetGameIcon, :global(body) .giveUpIcon {
    fill: #6aaa64;
    padding-right: 1em;
  }

  :global(body) .resetGameButton, :global(body) .giveUpButton {
    display: flex;
    align-items: center;
    border: none;
    outline: none; 
    cursor: pointer;
    background-color: #f2eee2;
    color: #333333;
    padding: 1em;
    font-weight: bold;
    font-size: 14px;
    font-family: inherit;
    transition: transform 0.2s ease-in-out, background-color 0.3s;
  }

  :global(body.dark-mode) .resetGameButton, :global(body.dark-mode) .giveUpButton {
    color: #f2eee2;
    background-color: #1d3040;
  }
  
  .resetGameButton:hover, .giveUpButton:hover {
    transform: scale(1.25);
  }
  
</style>
