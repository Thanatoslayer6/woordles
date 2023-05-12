<script>
  import "./fonts/fonts.css"
  import { onMount } from "svelte"; 
  import { page } from '$app/stores';
  $: routeId = $page.route.id;

  let toggled = false;
  onMount(() => toggled = false);
  function toggleTheme() {
    window.document.body.classList.toggle('dark-mode')
  }
</script>

<style>
  .header {
    display: flex;
    justify-content:space-between;
    padding: 1rem;
  }

  .navigation {
    display: flex;
    gap: 1rem;
    /* margin-right: 50px; */
    align-items: center;
    font-weight: bold;
  }


  .navigation a {
    /* Regular link styles */
    text-decoration: none;
    padding: 0.5rem;
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
       margin: 0;
        font-family: "Quicksand", sans-serif;
		background-color: #f2eee2;
        transition: background-color 0.3s

    }
    
    /* Navigation links */
    :global(body) .navigation a{
        color: #333333
    }

    :global(body) .navigation a.active{
        color: #0066cc;
    }


    :global(body) .header {
        background-color: #E1D6BA;
	}

  :global(body) .github-logo {
		fill: #1d3040;
  }

  :global(body.dark-mode) .github-logo {
    fill: #E1D6BA;
  }


	:global(body.dark-mode) {
		background-color: #1d3040;
		color: #bfc2c7;
	}

</style>

<div class="header">
  <a href="https://github.com/thanatoslayer6">
    <svg class="github-logo" style="width: 32px; height: 32px;" viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"/>
    </svg>
  </a>

  <nav class="navigation">
    <a href="/" class:active={routeId === '/'}>Home</a>
    <a href="/how-to-play" class:active={routeId === '/how-to-play'}>Tutorial</a>
    <a href="/about" class:active={routeId === '/about'}>About</a>
  </nav>
  <label class="theme-switch">
    <input class="theme-switch-checkbox" type="checkbox" on:change={toggleTheme} checked={toggled}/>
  <span class="theme-switch-slider"></span>
  </label>
</div>

<div class="layout">
    <slot />
</div>
