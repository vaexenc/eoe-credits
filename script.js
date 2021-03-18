"use strict";

const isScrolling = false;
const main = document.querySelector(".main");
let elements;

function getAllElements() {
	return Array.from(document.querySelectorAll(".text"));
}

function getIntervalFromFPS(framesPerSecond) {
	return 1/framesPerSecond*1000;
}

function norm(min, max, value) {
	return (value - min) / (max - min);
}

function getProximityToVerticalCenterNorm(yPosNorm) {
	if (yPosNorm <= 0.5) {
		return norm(0, 0.5, yPosNorm);
	}
	return 1 - norm(0.5, 1, yPosNorm);
}

function scrollDown() {
	main.scrollBy({top: 100, behavior: "auto"});
}

function convertNormToAnimationProgress(valueNorm) {
	return -valueNorm + "s";
}

function setAnimationProgress(element, ...valuesNorm) {
	element.style.animationDelay = valuesNorm.map((e) => convertNormToAnimationProgress(e)).join(", ");
}

function calculateAnimationProgress(rect) {
	const windowHeight = window.innerHeight;
	const centerY = rect.top + rect.height/2;
	const yPosNorm = centerY / windowHeight;
	const magic = rect.bottom / (windowHeight + rect.height);
	const horizontalProgress = (Math.sin(yPosNorm*4 + main.scrollTop*0.003/(windowHeight/1000)) + 1) / 2;
	const bottomToTopProgress = 1 - magic;
	const focusProgress = getProximityToVerticalCenterNorm(magic);
	return [horizontalProgress, bottomToTopProgress, focusProgress];
}

function updateElements() {
	for (const element of elements) {
		const rect = element.getBoundingClientRect();
		if (rect.bottom < 0)
			continue;
		if (rect.top > window.innerHeight)
			return;
		setAnimationProgress(element, ...calculateAnimationProgress(rect));
	}
}

function update() {
	if (isScrolling) {
		scrollDown();
	}
	updateElements();
}

function everyFrame() {
	update();
	window.requestAnimationFrame(everyFrame);
}

function init() {
	setInterval(update, getIntervalFromFPS(90));
}

elements = getAllElements();
init();
main.focus();
