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
    console.log(formedWord)
    for (let i = 0; i < 6; i++) {
        // Green      
        if (secretWord.includes(formedWord[i]) && secretWord[i] == formedWord[i]) {
            console.log(`There is one located at - ${formedWord[i]} - column: ${i} - row: ${currentActiveRow} - This should be green`)
            // Render the appropriate color
            let placeholder = document.querySelector(`[data-num="${currentActiveRow}-${i}"]`);
            placeholder.style.backgroundColor = "lightgreen";
            break;
        }
        // TODO: Test this and continue
        // Yellow
        if (secretWord)
    }
    // Go next row, if already at last then stop
    if (currentActiveRow == 5) return;
    currentActiveRow++;
    currentActiveColumn = 0;
    letters = [];
  }
    
  const formLettersAsWord = () => {
    if (letters.length != 6) return;
    
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
    margin: 4em auto;
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
