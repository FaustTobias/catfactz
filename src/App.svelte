<script lang="ts">
	import { fly } from "svelte/transition";
	import Tailwind from "./Tailwind.svelte";
	import Typewriter from "./Typewriter.svelte";

	let loading = false;
	let noInternet = false;
	let fact: { fact: string };

	loadFact();

	async function loadFact() {
		loading = true;
		try {
			fact = await fetch("https://catfact.ninja/fact").then((res) =>
				res.json(),
			);
			noInternet = false;
		} catch {
			noInternet = true;
		}
		loading = false;
	}
</script>

<!-- Embed the tailwind stylesheets -->
<Tailwind />

<div class="mx-auto px-4 py-2 max-w-2xl flex flex-col h-full">
	<div class="pt-10 h-36">
		<div class="font-semibold text-5xl text-white text-center">
			Cat Factz
		</div>
		<div class="text-white text-xl text-center pb-4">
			Facts about your cat!
		</div>
	</div>
	<div
		class="text-white flex flex-1 flex-col justify-center items-center overflow-y-auto"
	>
		{#if !loading || noInternet}
			<div
				class="text-xl sm:text-3xl px-4"
				transition:fly={{ y: 10, duration: 200 }}
			>
				{#if !noInternet}
					{#if fact && fact.fact}
						<Typewriter text={fact.fact} />
					{/if}
				{:else}
					<Typewriter
						text="Please connect your device to the internet!"
					/>
				{/if}
			</div>
		{/if}
	</div>
	<div class="flex flex-col pb-10 h-36 items-center justify-center">
		<button
			on:click={loadFact}
			disabled={loading}
			class="text-xl text-white border-2 border-white active:bg-white active:text-black rounded-md active:shadow-lg w-48 h-12 flex flex-row items-center justify-center focus:outline-none select-none {loading
				? 'cursor-not-allowed'
				: ''}"
		>
			{#if loading}
				<svg
					class="animate-spin -ml-1 mr-3 h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			{:else}
				<span>Load new fact</span>
			{/if}
		</button>
	</div>
</div>

<style lang="postcss" global>
	body {
		@apply p-0 bg-blue-400 h-screen;
	}
</style>
