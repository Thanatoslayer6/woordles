<script>
  let secretWord = "JOHNNY";
  let letters = []; // Array to store the letters for each grid item
  let currentActiveRow = 0;
  let currentActiveColumn = 0;
  let writtenWords = [];

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
    
    // Step 3: Render everything 
    for (let i = 0; i < 6; i++) {
        let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${i}"]`);
        placeholder.style.backgroundColor = guess[i]
    }

    setTimeout(() => {
        if (formedWord === secretWord) {
            alert("Congratulations");
            return;
        }
        if (currentActiveRow == 6) {
            alert("Game over!");
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
    currentActiveColumn++;
  }

  const removeLetterOnGrid = () => {
    if (letters.length == 0) return;
    console.log(letters);
    letters.pop();
    // Render
    let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${currentActiveColumn - 1}"]`);
    placeholder.textContent = "";
    currentActiveColumn--;
  }
</script>

<svelte:window on:keydown={(event) => handleKeyDown(event)} />
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
    gap: 8px;
    justify-content: center; /* Center the grid horizontally */
    align-items: center; /* Center the grid vertically */
    width: 400px; /* Set the width of the grid container */
    height: 400px; /* Set the height of the grid container */
    margin: 2em auto;
  }

  .placeholder {
    text-align: center;
    background-color: #eaeaea; /* Set the background color of grid items */
    border-radius: 0.5em;
    padding: 1em;
    width: 2em;
    height: 2em;
    margin: 0;
  }
</style>
