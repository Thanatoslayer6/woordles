<script>
  import { onMount } from "svelte"; 
  let toggled = false;
  onMount(() => toggled = false);
  function toggleTheme() {
    window.document.body.classList.toggle('dark-mode')
  }
</script>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .navigation {
    display: flex;
    gap: 1rem;
    font-weight: bold;
  }

  .theme-switch {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .theme-switch-slider {
    width: 40px;
    height: 20px;
    border-radius: 10px;
    background-color: #ccc;
    position: relative;
  }

  .theme-switch-slider:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.2s ease-in-out;
  }

  .theme-switch-checkbox {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
  }

  .theme-switch-checkbox:checked + .theme-switch-slider:before {
    transform: translateX(20px);
  }

	:global(body) {
		background-color: #f2eee2;
		transition: background-color 0.3s
	}
	:global(body.dark-mode) {
		background-color: #1d3040;
		color: #bfc2c7;
	}

</style>

<div class="header">
  <div class="logo">Letterdash</div>
  <div class="navigation">
    <a href="/">Home</a>
    <a href="/sverdle/how-to-play">Tutorial</a>
    <a href="/about">About</a>
  </div>
    <label class="theme-switch">
        <input class="theme-switch-checkbox" type="checkbox" on:change={toggleTheme} checked={toggled}/>
      <span class="theme-switch-slider"></span>
    </label>
</div>

<div class="layout">
    <slot />
</div>
