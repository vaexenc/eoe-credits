"use strict";

const main = document.querySelector(".main");

const isScrolling = false;

function scrollDown() {
	main.scrollBy({top: 100, behavior: "auto"});
}

function setProgress(element, v) {
	element.style.animationDelay = -((v+1)/2) + "s";
}

function updateText() {
	const elements = Array.from(document.querySelectorAll(".text"));
	for (const element of elements) {
		const rect = element.getBoundingClientRect();
		if (rect.top + rect.height < 0) {
			continue;
		}
		if (rect.top > window.innerHeight) {
			return;
		}
		const centerY = rect.top + rect.height/2;
		const v = centerY / window.innerHeight;
		const magic = Math.sin(v*4 + main.scrollTop/700);
		setProgress(element, magic);
	}
}

function update() {
	if (isScrolling) {
		scrollDown();
	}
	updateText();
}

function everyFrame() {
	update();
	window.requestAnimationFrame(everyFrame);
}

everyFrame();
// setInterval(every, 500)
// updateText();
