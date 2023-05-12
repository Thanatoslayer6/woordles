<script>
  let secretWord = "JOHNNY";
  let letters = []; // Array to store the letters for each grid item
  let currentActiveRow = 0;
  let currentActiveColumn = 0;
  let writtenWords = [];
  let isGameWon = false;
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

  const validateWord = () => { 
    // First we validate the formed word pushed in `writtenWords`
    let formedWord = writtenWords[writtenWords.length - 1];
    let checkWordle = secretWord;
    const guess = []
    // Step 1: Check the right letters first, then remove them to solve duplicated letters problems
    console.log(formedWord)
    for (let i = 0; i < 6; i++) {
        if (checkWordle.includes(formedWord[i]) && checkWordle[i] == formedWord[i]) {
            guess[i] = "#538d4e";
            checkWordle = checkWordle.replace(formedWord[i], '-');
        } else {
            guess[i] = "#3a3a3c";
        }
    }

    // Step 2: Check for the incorrectly placed letters
    for (let i = 0 ; i < 6; i++) {
        if (checkWordle.includes(formedWord[i]) && guess[i] != "#538d4e") {
            guess[i] = "#b59f3a";
        }
    }
    
    // Step 3: Render everything add some animation
    for (let i = 0; i < 6; i++) {
        let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${i}"]`);
        placeholder.style.backgroundColor = guess[i]
        placeholder.style.color = "white"
    }
    

    setTimeout(() => {
        if (formedWord === secretWord) {
            isGameWon = true;
            return;
        }
        if (currentActiveRow == 6) {
            alert("Game over!");
            isGameWon = false;
            return;
        }
    }, 250)

    // Go next row, if already at last then stop
    currentActiveRow++;
    currentActiveColumn = 0;
    letters = [];
  }
    
  const formLettersAsWord = () => { 
    let formedWord = letters.join("");
    console.log(`Adding word -> ${formedWord}`);
    writtenWords.push(formedWord);
    console.log(writtenWords);
  }

  const addLetterOnGrid = (key) => {
    if (letters.length == 6) return;
    console.log(key);
    letters.push(key);
    // Render
    let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${currentActiveColumn}"]`);

    placeholder.textContent = key;

    // Trigger animation
    placeholder.animate(
      { transform: ['scale(1)', 'scale(1.1)', 'scale(1)'] },
      { duration: 150 }
    );
    placeholder.style.border = "2px solid #8c7573";

    currentActiveColumn++;
  }

  const removeLetterOnGrid = () => {
    if (letters.length == 0) return;
    console.log(letters);
    letters.pop();
    // Render
    let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${currentActiveColumn - 1}"]`);
    placeholder.textContent = "";
    placeholder.style.border = "";
    currentActiveColumn--;
  }
</script>

<svelte:window on:keydown={(event) => handleKeyDown(event)} />
{#if isGameWon}
  <div class="dialog-overlay">
    <div class="dialog-box">
      <h3>Congratulations!</h3>
      <p>You won the game!</p>
      <button on:click={() => {
              isGameWon = false
              window.location.reload()
            }
        }>Close</button>
    </div>
  </div>
{/if}
<div class="grid">
  {#each Array.from(Array(6).keys()) as row (row)}
    {#each Array.from(Array(6).keys()) as col (col)}
        <span class="placeholder" data-num="{row}-{col}"></span>
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
    margin: 2em auto;
  }

  .placeholder {
    font-weight: 600;
    box-sizing: border-box; /* Include border in the element's size calculation */
    display: inline-grid;
    align-items: center;
    text-align: center;
    color: #1C2025;
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
    background-color: #fff;
    padding: 5rem;
    border-radius: 8px;
    text-align: center;
  }

  :global(body.dark-mode) .placeholder {
    border: 2px solid #193561;
	background-color: #8F90A6;
    color: #1C2025;
  }
  
  :global(body) .placeholder {
    background-color: #E1D6BA;
    border: 2px solid #c1b4b3;
  }

</style>
