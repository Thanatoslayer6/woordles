import { writable, readable } from "svelte/store";
export let quote: any = writable(null);
export let freeplayState: any = writable();
export let dailyplayState: any = writable();
export let dailyTimeRemaining: any = writable(0); // Initialize with a readable store