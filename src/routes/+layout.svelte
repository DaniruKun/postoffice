<script lang="ts">
    import type { LayoutData } from './$types';

		import '../app.css';
    
    export let data: LayoutData;
</script>

<main class="bg-stone-100 min-h-screen">
	<slot />
</main>

<footer class="text-center text-sm text-gray-500 py-4">
	Made with ❤️ by <a href="https://github.com/danirukun" class="text-blue-500 hover:text-blue-600">danirukun</a>
</footer>