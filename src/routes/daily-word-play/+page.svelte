<script>
  import { onDestroy, onMount } from 'svelte';

  let remainingTime = 0;
  let countdownInterval = null;

  onMount(() => {
    const endTime = new Date().setHours(23, 59, 59, 999);
    startCountdown(endTime);
  });

  onDestroy(() => {
    clearInterval(countdownInterval);
  });

  function startCountdown(endTime) {
    countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      remainingTime = endTime - currentTime;

      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        remainingTime = 0;
      }
    }, 1000);
  }

  function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    const formattedHours = hours === 1 ? '1 hour' : hours > 1 ? `${hours} hours` : '';
    const formattedMinutes = minutes === 1 ? '1 minute' : minutes > 1 ? `${minutes} minutes` : '';
    const formattedSeconds = seconds === 1 ? '1 second' : `${seconds} seconds`;

    const formattedTimeSegments = [];

    if (formattedHours) {
      formattedTimeSegments.push(formattedHours);
    }

    if (formattedMinutes) {
      formattedTimeSegments.push(formattedMinutes);
    }

    if (formattedSeconds) {
      formattedTimeSegments.push(formattedSeconds);
    }

    return formattedTimeSegments.join(', ');
  }
</script>

<main>
  <h1>Daily Word Play</h1>
  <p>Remaining time for the day: {formatTime(remainingTime)}</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Arial, sans-serif;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
  }
</style>

