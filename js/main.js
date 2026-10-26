/* ----------------------------------- menu ----------------------------------------- */
// 1
let previousKey = null,
    currentKey = null;

// 2
if(!sessionStorage.getItem('activeMenuBtn')) {
    sessionStorage.setItem('activeMenuBtn', 'home');
    currentKey = 'home';
} else {
    currentKey = sessionStorage.getItem('activeMenuBtn');
}
// 3
showActiveSection(currentKey);

function showActiveSection(currentKey, previousKey){
    if(previousKey && previousKey !== currentKey){
        const previousBtnEl = document.querySelector(`[data-section-btn="${previousKey}"]`);
        previousBtnEl.classList.remove('menu__btn--active');
        const previousSectionEl = document.querySelector(`[data-section="${previousKey}"]`);
        previousSectionEl.classList.add('hidden');
    }
    
    const currentBtnEl = document.querySelector(`[data-section-btn="${currentKey}"]`);
    currentBtnEl.classList.add('menu__btn--active');
    const currentSectionEl = document.querySelector(`[data-section="${currentKey}"]`);
    currentSectionEl.classList.remove('hidden');

    sessionStorage.setItem('activeMenuBtn', currentKey);
}

// 4
const menuEl = document.querySelector('[data-menu]');
const startBtn = document.querySelector('[data-home-btn="test"]');
const startSettingsBtn = document.querySelector('[data-home-btn="start-test"]');
const statisticsBtn = document.querySelector('[data-home-btn="test-completed"]');
const addDictionaryBtn = document.querySelector('[data-home-btn="dictionary"]');

menuEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-section-btn]');
    if(btn.dataset.sectionBtn === currentKey) return;
    previousKey = currentKey;
    currentKey = btn.dataset.sectionBtn;
    showActiveSection(currentKey, previousKey);
    
})

startBtn.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-home-btn]');
    previousKey = currentKey;
    currentKey = btn.dataset.homeBtn;
    showActiveSection(currentKey, previousKey);
})

startSettingsBtn.addEventListener('click', () => {
    previousKey = currentKey;
    currentKey = 'test';
    showActiveSection(currentKey, previousKey);
})

statisticsBtn.addEventListener('click', () => {
    previousKey = currentKey;
    currentKey = 'statistics';
    showActiveSection(currentKey, previousKey);
})

console.log(addDictionaryBtn)

addDictionaryBtn.addEventListener('click', () => {
    previousKey = currentKey;
    currentKey = 'dictionary';
    showActiveSection(currentKey, previousKey);
})

// ------------ получаем данные/загружаем в localStorage -------------------------------- 
// список словарей

let listDictionary = localStorage.getItem('listDictionary');

if(!listDictionary){
    const response = await fetch('./js/dictionary.json');

    if(!response.ok){
        throw new Error(
            `Failed to load dictionaries: HTTP ${response.status}`
        );
    }

    const arr = await response.json();
    console.log(arr);
    localStorage.setItem('listDictionary', JSON.stringify(arr));
} else {
    listDictionary = JSON.parse(listDictionary);
}

export {listDictionary};