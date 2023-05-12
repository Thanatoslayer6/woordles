<svelte:head>
	<title>Wordle</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="menu">
    <img class="logo" src="woordle.png" alt="Woordle">
    <div class="actions">
        <a href="/freeplay">Freeplay</a>
        <a href="/daily-word-play">Daily Word Play</a>
    </div>
</div>

<style>
  .actions {
      display: flex;
      justify-content:center;
  }

  .actions a {
      font-size: x-large;
      text-decoration: none;
      margin: 2em 3em;
      padding: 0.5rem;
      color: #333333;
      transition: transform 0.2s ease-in-out;
  }

  .actions a:hover {
      transform: scale(1.1);
      color: #0066cc;
  }

  .menu {
      text-align: center;
      margin: 2.5em auto;
  }

  h1 {
      width: 100%;
      align-items: center;
  }

  .logo {
    width: 50%;
    height: auto;
    transform: scale(1);
  }
</style>
