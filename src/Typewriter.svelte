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

<div class="relative">
	<div class="absolute top-0 left-0 right-0 bottom-0">
		{#each words as word, idx (idx)}
			<span
				class="inline-block whitespace-pre p-0 m-0"
				in:fly={{ duration: 150, y: 5 }}>{word}&nbsp;</span
			>
		{/each}
	</div>
	<div class="invisible">{text}</div>
</div>
