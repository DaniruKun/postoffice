<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_YOUGOTMAIL_API_BASE_URL } from '$env/static/public';
	import { page } from '$app/stores';
	import { playTrack } from '$lib/services/audio';

	let author = '';
	let content = '';
	let token = '';
	let response: Response | null = null;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDrawing = false;
	let currentColor = '#000000';
	let currentThickness = 2;

	token = $page.url.searchParams.get('token') || '';

	async function sendMessage(token: string) {
		const canvasData = hasDrawing() ? getCanvasData() : '';

		const res = await fetch(`${PUBLIC_YOUGOTMAIL_API_BASE_URL}/api/v1/notes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ author, content, canvasData }),
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

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	});

	const setThickness = (thickness: number) => {
		currentThickness = thickness;
		currentColor = '#000000';
	};

	const setEraser = () => {
		currentColor = '#FFFFFF';
		currentThickness = 20;
	};

	const clearCanvas = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	const startDrawing = (event: MouseEvent) => {
		isDrawing = true;
		draw(event);
	};

	const stopDrawing = () => {
		isDrawing = false;
		ctx.beginPath();
	};

	const draw = (event: MouseEvent) => {
		if (!isDrawing) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		ctx.strokeStyle = currentColor;
		ctx.lineWidth = currentThickness;
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x, y);
	};

	const hasDrawing = (): boolean => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		return imageData.some((pixel) => pixel !== 0);
	};

	const getCanvasData = (): string => {
		return canvas.toDataURL();
	};
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
	<div class="mb-6" id="message-container">
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

	<div class="mb-6">
		<label class="block text-gray-700 text-sm font-bold mb-2" for="canvas"> Drawing </label>
		<div class="flex space-x-2 mb-2">
			<button
				on:click={(e) => {
					e.preventDefault();
					setThickness(2);
				}}
				class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
			>
				Thin
			</button>
			<button
				on:click={(e) => {
					e.preventDefault();
					setThickness(5);
				}}
				class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
			>
				Medium
			</button>
			<button
				on:click={(e) => {
					e.preventDefault();
					setThickness(10);
				}}
				class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
			>
				Thick
			</button>
			<button
				on:click={(e) => {
					e.preventDefault();
					setEraser();
				}}
				class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
			>
				Eraser
			</button>
			<button
				on:click={(e) => {
					e.preventDefault();
					clearCanvas();
				}}
				class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
			>
				Clear
			</button>
		</div>
		<canvas
			bind:this={canvas}
			width="400"
			height="200"
			class="border border-gray-300 rounded"
			on:mousedown={startDrawing}
			on:mousemove={draw}
			on:mouseup={stopDrawing}
			on:mouseleave={stopDrawing}
		></canvas>
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
