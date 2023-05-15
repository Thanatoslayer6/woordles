<script>
  import { onDestroy, onMount } from "svelte";
  import { dailyTimeRemaining } from "../stores";
  import Game from "../../components/DailyPlay.svelte";

  let countdownInterval = null;
  $: dailyTime = formatTime($dailyTimeRemaining);

  onMount(() => {
    countdownInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = new Date().setHours(23, 59, 59, 999);
      const remainingTime = Math.max(endTime - currentTime, 0);

      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        dailyTimeRemaining.set(0);
      } else {
        dailyTimeRemaining.set(remainingTime);
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(countdownInterval);
  });

  function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60))
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
</script>

<Game gameModeType={"Daily Woordle"} descriptor={dailyTime} />

<style>
</style>
