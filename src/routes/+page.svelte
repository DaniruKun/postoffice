<script lang="ts">
	import { PUBLIC_YOUGOTMAIL_API_BASE_URL } from '$env/static/public';
	import { page } from '$app/stores';
	import { playTrack } from '$lib/services/audio';

	let author = '';
	let content = '';
	let token = '';
	let response: Response | null = null;

	token = $page.url.searchParams.get('token') || '';

	console.log('token', token);

	async function sendMessage(token: string) {
		const res = await fetch(`${PUBLIC_YOUGOTMAIL_API_BASE_URL}/api/v1/notes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ author, content }),
			mode: 'cors'
		});

		if (res.ok) {
			console.log('Message sent successfully');
			playTrack('/audio/imail-swoosh-effect.wav');
			response = res;
		} else {
			console.error('Failed to send message:', await res.text());
		}
	}
</script>

<svelte:head>
	<title>Cat Postoffice</title>
</svelte:head>

<section class="max-w-md mx-auto mt-8 p-6">
	<h1 class="text-4xl font-bold tracking-tight text-center mb-4">Cat Postoffice 🐱</h1>
</section>

<form
	on:submit|preventDefault={() => sendMessage(token)}
	class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
>
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="author"> Your name </label>
		<input
			type="text"
			id="author"
			placeholder="Andy"
			bind:value={author}
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</div>
	<div class="mb-6">
		<label
			class="block text-gray-700 text-sm font-bold mb-2"
			for="content"
			title="max 64 characters per line"
		>
			Message
		</label>
		<textarea
			id="content"
			bind:value={content}
			placeholder="Hello, world!"
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</div>
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="token"> Token </label>
		<input
			type="text"
			id="token"
			bind:value={token}
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
		/>
	</div>
	<div class="flex items-center justify-between">
		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
		>
			Send
		</button>
		{#if response && response.ok}
			<p class="text-green-600 mt-2">Message sent successfully!</p>
		{/if}
	</div>
</form>
