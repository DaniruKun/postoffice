export function playTrack(track: string) {
	const audio = new Audio(track);
	audio.play();
}
