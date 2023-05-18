<script>
    import { getRandomQuote } from "./words";
    import { onMount } from "svelte";
    import { quote } from "./stores";
    let quoteData;
    onMount(async () => {
        if (!quoteData) {
            try {
                const response = await getRandomQuote();
                console.log(response);
                quote.set(response);
            } catch (error) {
                console.error("Error fetching quote:", error);
            }
        }
    });
    quote.subscribe((data) => {
        quoteData = data;
    });
</script>

<svelte:head>
    <title>Woordle</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="menu">
    <img class="logo" src="woordle.png" alt="Woordle" />

    <div class="quote-block">
        {#if quoteData}
            <blockquote class="quote-text">{quoteData.quote}</blockquote>
            <p class="quote-author">{quoteData.author}</p>
        {:else}
            <p>Loading Quote...</p>
        {/if}
    </div>

    <div class="actions">
        <a href="/freeplay">Freeplay</a>
        <a href="/daily-word-play">Daily Word Play</a>
    </div>
</div>

<style>
    .actions {
        display: flex;
        justify-content: center;
    }

    .actions a {
        border-radius: 6px;
        border: solid 2px;
        font-size: x-large;
        font-weight: 600;
        text-decoration: none;
        margin-left: 1em;
        margin-top: 1em;
        padding: 1rem;
        color: #6aaa64;
        transition: transform 0.2s ease-in-out;
    }

    .actions a:hover {
        transform: scale(1.1);
        color: #3c6e37;
    }

    .menu {
        text-align: center;
        margin: 2.5em auto;
    }

    .logo {
        width: 50%;
        height: auto;
        transform: scale(1);
    }
    .quote-block {
        padding: 0.5rem;
        margin: 0.5rem 0;
    }

    .quote-text {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .quote-author {
        font-size: 0.9rem;
        font-style: italic;
    }
</style>
