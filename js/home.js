import { statistics } from "./statistics.js";


console.log('home start');

import { listDictionary } from "./main.js";
import { renderTestSettings } from "./test.js";

const startBtn = document.querySelector('[data-home-btn="test"]');
startBtn.addEventListener('click', () => {
    renderTestSettings(listDictionary);
})

const countTestEl = document.querySelector('[data-home="test-completed"]');

function updateCountTestHomeEl(statistics = []){
    countTestEl.textContent = statistics.length;
}

updateCountTestHomeEl(statistics);

export {updateCountTestHomeEl};