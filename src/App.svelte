<script>
  import { fade, fly } from "svelte/transition";
  import Typewriter from "./Typewriter.svelte";

  let loading = false;
  let noInternet = false;
  let fact;

  loadFact();

  async function loadFact() {
    loading = true;
    try {
      fact = await fetch("https://catfact.ninja/fact").then((res) =>
        res.json()
      );
      noInternet = false;
    } catch {
      noInternet = true;
    }
    loading = false;
  }
</script>

<style>
  .app {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background: #333333;
    color: #ffffff;
    background: #4169e1;
    color: snow;
  }

  .logo {
    padding: 2em;
    font-size: 1.5em;
    font-weight: 700;
    font-family: sans-serif;
    flex: 1 1 auto;
    flex: 0 0 auto;
    text-align: center;
  }

  .fact {
    padding: 2em;
    font-size: 1.25em;
    font-weight: 300;
    font-family: sans-serif;
    flex: 1 1 auto;
    line-height: 1.25;
  }

  .menu {
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
    animation: menu-fadein 500ms ease-in;
  }

  button {
    padding: 0.5em 2em;
    margin: 0 0 2em 0;
    border: 2px solid #ffffff;
    border-radius: 9999px;
    box-shadow: 0 0.125em 0.25em rgba(0, 0, 0, 0.1);
    font-size: 1.5em;
    cursor: pointer;
    background: transparent;
    color: #ffffff;
    transition: box-shadow 150ms;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  button::-moz-focus-inner {
    border: 0;
  }

  button:active {
    color: #000000;
    background: #f5f5f5;
    box-shadow: 0 0 rgba(0, 0, 0, 0.1);
  }

  .spinner {
    width: 5em;
    height: 5em;
    border: 0.125em solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spinner 500ms linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
  }

  @keyframes spinner {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
</style>

<div class="app">
  <div class="logo" in:fly={{ duration: 500, y: 20 }}>CatFactz</div>
  <div class="fact">
    {#if noInternet}
      <div transition:fly|local={{ duration: 250, y: 10 }}>
        <Typewriter
          text="Please connect your device to the internet :sadface:" />
      </div>
    {:else}
      {#if loading}
        <div transition:fade|local={{ duration: 250, y: 10 }}>
          <div class="spinner" />
        </div>
      {/if}
      <div>
        {#if !loading && fact}
          <div transition:fly|local={{ duration: 250, y: 10 }}>
            <Typewriter text={fact.fact} />
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="menu" in:fly={{ duration: 500, y: 20, delay: 2000 }}>
    <button on:click={loadFact} disabled={loading}>Load new fact</button>
  </div>
</div>
