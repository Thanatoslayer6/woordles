export const words = [
    "Router",
    "Abcdef",
    "Flowse",
    "Glitch",
    "Pouthe",
    "Crooks",
    "Wanton"
]

export const getRandomWord = () => {
    let index = Math.floor(Math.random() * words.length);
    return words[index];
}