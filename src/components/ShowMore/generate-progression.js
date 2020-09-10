#!/usr/bin/env node

const bezier = require("./bezier");
const fs = require("fs");

/**
 * Choose your control points by using Lea Verou online bezier editing tool
 * Then copy the params here to export the precalculated values to a JSON file
 * @see http://cubic-bezier.com
 */
const myCurve = bezier(.1, 1, .91, .97);

const curveName = "scroll-to";

const ANIMATION_DURATION = 1000; // ms

// How many frames do we need to create a 60fps animation ?
const frameCount = Math.round(60*ANIMATION_DURATION/1000);

/**
 * Now fill the array with the required amount of steps
 * to get a progression ranging from 0 to 1000
 */
const steps = new Array(frameCount);
for (let i = 0; i < frameCount; i++) {
	steps[i] = Math.round(myCurve(i/frameCount, ANIMATION_DURATION)*1000); // round the result to a percentage [0, 100]
}
steps.push(1000); // we like reaching the end line

// Export the JSON result
console.log(`Exporting ${steps}`);
fs.writeFileSync(`./${curveName}.json`, JSON.stringify(steps));
