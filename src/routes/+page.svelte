<svelte:head>
    <title>Woordle</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="menu">
    <img class="logo" src="woordle.png" alt="Woordle" />
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
        margin: 2em 3em;
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
</style>
