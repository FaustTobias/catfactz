<script>
  import { onMount } from "svelte";
  import { fly, scale } from "svelte/transition";

  export let text;

  $: {
    text;
    pos = 0;
  }

  $: words = text.split(/\s+/).slice(0, pos);

  let pos = 0;
  let timer;

  function update() {
    ++pos;
  }

  onMount(() => {
    timer = setInterval(update, 50);

    return () => {
      clearInterval(timer);
    };
  });
</script>

<style>
  span {
    display: inline-block;
    white-space: pre;
  }
</style>

{#each words as word, idx (idx)}
  <span in:fly={{ duration: 150, y: 5 }}>{word}&nbsp;</span>
{/each}
