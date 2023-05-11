<!-- Header.svelte -->
<script>
  let theme = 'light';

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    // Perform theme change logic here
    // You can update CSS classes or apply theme-specific stylesheets
    console.log('Theme:', theme);
  }
</script>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f2f2f2;
    transition: background-color 0.3s ease-in-out;
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

   /* Define your theme-specific styles here */
  .light-theme {
    /* Light theme styles */
    background-color: #f2f2f2;
    color: #333;
  }

  .dark-theme {
    /* Dark theme styles */
    background-color: #333;
    color: #f2f2f2;
  }

</style>

//TODO: Continue this

<div bind class="header">
  <div class="logo">Werdle!</div>
  <div class="navigation">
    <a href="/">Home</a>
    <a href="/sverdle/how-to-play">Tutorial</a>
    <a href="/about">About</a>
  </div>
    <label class="theme-switch">
      <input class="theme-switch-checkbox" type="checkbox" on:change={toggleTheme} />
      <span class="theme-switch-slider"></span>
    </label>
</div>

<div class="layout" class:dark-theme={theme === 'dark'}>
    <slot />
</div>
