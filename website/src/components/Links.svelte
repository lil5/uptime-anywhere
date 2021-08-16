<script lang="ts">
	import type { Config } from "../types"

	export let config: Config

	interface Link {
		url: string
		name: string
	}

	let link: Link | undefined
	$: {
		if (config.githost_url) {
			link = {
				url: config.githost_url,
				name: "CI",
			}
		}
	}
</script>

{#if link}
	<li>
		<a
			class="
					font-bold
					p-2
					rounded
					mx-2
					hover:bg-primary-200
					hover:bg-opacity-25
					hover:shadow-inner
					text-blue-700
					hover:text-blue-900
				"
			href={link.url}>{link.name}</a
		>
	</li>
{/if}
