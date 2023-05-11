<script>
    import { goto } from "$app/navigation";
    const handleClick = (route) => {
        goto(route);
    };
</script>

<button on:click={handleClick}>
    <slot />
</button>

<style>
    button {
        padding: 1.5em;
        border-radius: 0.25em;
    }
</style>
