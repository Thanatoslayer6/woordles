export const words = [
    "Router",
    "Abcdef",
    "Flowse",
    "Glitch",
    "Pouthe",
    "Crooks",
    "Wanton"
]

export const freeplay = [
    "Endless, random words, just Woordle.",
    "Words without limits, think freely.",
    "Unleash your word wizardry!",
    "Immerse yourself in a world of words without boundaries.",
    "Unwind and let your words flow.",
    "\"Words Words Words\" - Bo Burnham",
    "Put your guessing skills to the test!",
    "Just you and a grid...",
    "guess, discover, learn, repeat...",
    "Embark on a mind teasing journey!"
]

export const getRandomFreeplay = () => {
    let index = Math.floor(Math.random() * freeplay.length);
    return freeplay[index];
}

export const getRandomWord = () => {
    let index = Math.floor(Math.random() * words.length);
    return words[index];
}

export const isWordValid = async (word: String) => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return await response.json();
}

export const getRandomQuote = async () => {
    const response = await fetch("https://api.quotable.io/quotes/random?maxLength=100");
    const data = await response.json();
    return {
        "quote": data[0].content,
        "author": data[0].author
    }
}
