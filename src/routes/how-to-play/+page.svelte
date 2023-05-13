<svelte:head>
	<title>How to play Woordle</title>
	<meta name="description" content="How to play Woordle" />
</svelte:head>

<div class="text-column">
	<h1>How to play Woordle</h1>

	<p>
		Woordle is a 6-letter <a
			href="https://www.nytimes.com/games/wordle/index.html">Wordle</a
		>, the word guessing game. To play, enter a six-letter English word.
		For example:
	</p>

	<div class="example">
		<span class="missing">G</span>
		<span class="close">R</span>
		<span class="close">A</span>
		<span class="missing">C</span>
		<span class="exact">E</span>
		<span class="exact">D</span>
	</div>

	<p>
		The <span class="exact">E</span> and <span class="exact">D</span> is in
		the right place.

		<span class="close">R</span>
		and
		<span class="close">A</span>
		are the right letters, but in the wrong place. The other letters are wrong,
		and can be discarded. Let's make another guess:
	</p>

	<div class="example">
		<span class="exact">P</span>
		<span class="exact">A</span>
		<span class="exact">R</span>
		<span class="exact">T</span>
		<span class="exact">E</span>
		<span class="exact">D</span>
	</div>

	<p>
		This time we guessed right! You have <strong>six</strong> guesses to get
		the word.
	</p>
</div>

<style>
	.text-column {
		margin: 3em 4em;
	}

	span {
		font-weight: 600;
		box-sizing: border-box; /* Include border in the element's size calculation */
		color: #f5edd7;
		display: inline-grid;
		align-items: center;
		text-align: center;
		border-radius: 6px;
		font-size: xx-large;
		width: 2em;
		height: 2em;
	}

	.missing {
		background-color: #3a3a3c;
	}

	.close {
		background-color: #b59f3a;
	}

	.exact {
		background-color: #538d4e;
	}

	.example {
		display: flex;
		justify-content: flex-start;
		margin: 1rem 0;
		gap: 0.2rem;
	}

	.example span {
		font-size: 1.4rem;
	}

	p span {
		position: relative;
		border-width: 1px;
		border-radius: 1px;
		font-size: 0.4em;
		transform: scale(2) translate(0, -10%);
		margin: 1em 1em;
	}
</style>
