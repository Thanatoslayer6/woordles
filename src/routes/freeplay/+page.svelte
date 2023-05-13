<script>
  import { words, getRandomWord, isWordValid, getRandomFreeplay } from "../words";
  import { confetti } from "@neoconfetti/svelte";
  import { onMount } from "svelte";    

  let secretWord = getRandomWord().toUpperCase();
  console.log(`The secret word is: ${secretWord}`);
  let letters = []; // Array to store the letters for each grid item
  let currentActiveRow = 0;
  let currentActiveColumn = 0;
  let writtenWords = [];
  let isGameWon;

  onMount(() => {
      let placeholders = document.querySelectorAll(".placeholder");
      placeholders.forEach(item => {
        item.animate(
          { transform: ["scale(0)", "scale(1)"] },
          { duration: 500, easing: "ease-in-out" }
        )       
      })

  });
  function restartGame() {
      isGameWon = undefined;
      secretWord = getRandomWord().toUpperCase();
      console.log(`The secret word is: ${secretWord}`);
      letters = []; // Array to store the letters for each grid item
      currentActiveRow = 0;
      currentActiveColumn = 0;
      writtenWords = [];
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            let placeholder = document.querySelector(
              `[data-num="${i}-${j}"]`
            );
            placeholder.textContent = "";
            placeholder.style = "";
        }
      }
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
    console.log(validityOfWord);
    if (Array.isArray(validityOfWord)) {
        // Word is valid 
        console.log("Word is valid... please proceed...");
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
    console.log(formedWord);
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

    // Go next row, if already at last then stop
    currentActiveRow++;
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
    console.log(key);
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

<svelte:window
  on:keydown={(event) => {
    if (isGameWon == undefined) handleKeyDown(event);
  }}
/>
{#if isGameWon == true}
  <div class="dialog-overlay">
    <div class="dialog-box">
      <h3 style="font-weight: 600; font-size: xx-large;">Congratulations!</h3>
      <div use:confetti />
      <p>
        The answer is <span class="secretWord">{secretWord.toUpperCase()}</span>
      </p>
      <p style="font-style: italic; font-size: small;">
        <a href="https://wordfind.org/dictionary/{secretWord.toLowerCase()}">
          What does this word mean?
        </a>
      </p>
      <button
        class="newGameButton"
        on:click={() => {
            restartGame()
        }}>New Game</button
      >

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
    <div class="dialog-box">
      <h3 style="font-weight: 600; font-size: xx-large;">Game Over!</h3>
      <p>
        The answer is <span class="secretWord">{secretWord.toUpperCase()}</span>
      </p>
      <p style="font-style: italic; font-size: small;">
        <a href="https://wordfind.org/dictionary/{secretWord.toLowerCase()}">
          What does this word mean?
        </a>
      </p>
      <button
        class="newGameButton"
        on:click={() => {
            restartGame();
        }}>New Game</button
      >
      <button
        class="closeButton"
        on:click={() => {
          isGameWon = -1;
        }}>Close</button
      >
    </div>
  </div>
{/if}

<div style="position: absolute; left: 2em;">
    <span class="gameMode">
        Freeplay
    </span>
    <p style="color: #6aaa64; padding-top: 0.5em; width: 300px;">
        {getRandomFreeplay()}
    </p>
</div>

<div class="grid">
  {#each Array.from(Array(6).keys()) as row (row)}
    {#each Array.from(Array(6).keys()) as col (col)}
      <span class="placeholder" data-num="{row}-{col}" />
    {/each}
  {/each}
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
    /* color:  #ede4ce; */
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
  .newGameButton:hover,

  .closeButton:hover {
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
</style>
