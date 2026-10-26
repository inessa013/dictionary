/* -------------------------- 1 ------------------------------------------------------------------*/ 

const formEl = document.querySelector('[data-form="test-settings"]');

// получаем словарь 
async function getVocabularyArr() {
    let response = await fetch("/js/vocabular.json");
    let arr = await response.json();
    return arr;
};

const vocabularyArr = await getVocabularyArr();

// 
const dictionaryNameArr = [
    {
        id: 1,
        value: 'mixed',
        name: 'Mixed',
        type: 'mixed'
    },
    {
        id: 2,
        value: 'default',
        name: 'Base',
        type: 'system',
        wordsArr: [...vocabularyArr]
    },
    {
        id: 3,
        value: 'name1',
        name: 'Name 1',
        type: 'personal',
        wordsArr: [
            {
                id: 1,
                en: 'zero',
                ru: 'ноль'
            },
            {
                id: 2,
                en: 'one',
                ru: 'один'
            },
            {
                id: 3,
                en: 'two',
                ru: 'два'
            },
            {
                id: 4,
                en: 'three',
                ru: 'три'
            },
            {
                id: 5,
                en: 'four',
                ru: 'четыре'
            },
            {
                id: 6,
                en: 'five',
                ru: 'пять'
            }
        ]
    },
    {
        id: 4,
        value: 'name2',
        name: 'Name 2',
        type: 'personal'
    }
]


//1 Dictionary
const settingsDictionaryEl = document.querySelector('#settingsDictionary');
const outputSettingsDictionaryEl = document.querySelector('[data-settings="dictionary"]');

function getDictionaryName(v){
    return dictionaryNameArr.find( ({value}) => value === v)?.name;
}

outputSettingsDictionaryEl.textContent = getDictionaryName(settingsDictionaryEl.value);

settingsDictionaryEl.addEventListener('change', () => {
    outputSettingsDictionaryEl.textContent = getDictionaryName(settingsDictionaryEl.value);
})

//2 Count Words + 5 Estimated times
const settingsWordsEl = document.querySelector('#settingsWords');
const outputSettingsWordsEl = document.querySelector('[data-settings="words"]');
const outputSettingsTimeEl = document.querySelector('[data-settings="time"]');

function getSettingsTime(count){
    switch(+count){
        case 10 : return 5;
        case 20 : return 10;
        case 30 : return 15;
        default : return null;
    }
}

outputSettingsWordsEl.textContent = settingsWordsEl.value;
outputSettingsTimeEl.textContent = `${getSettingsTime(settingsWordsEl.value)} min`;

settingsWordsEl.addEventListener('change', () => {
    outputSettingsWordsEl.textContent = settingsWordsEl.value;
    outputSettingsTimeEl.textContent = `${getSettingsTime(settingsWordsEl.value)} min`;
})

//3 Direction
const settingsDirectionEl = document.querySelectorAll('[name="language-direction"]');
const outputsettingsDirectionEl = document.querySelector('[data-settings="direction"]');

outputsettingsDirectionEl.textContent = document.querySelector('input[name="language-direction"]:checked').value.toUpperCase();

settingsDirectionEl.forEach(elem => {
    elem.addEventListener('change', (event) => {
        outputsettingsDirectionEl.textContent = event.target.value.toUpperCase();
    })
})

const settingsLangBtns = document.querySelectorAll('.test__settings-langs');

settingsLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if(settingsLangBtns[0].classList.contains('active')){
            settingsLangBtns[0].classList.remove('active'); 
        } else {
            settingsLangBtns[1].classList.remove('active');
        }

        btn.classList.add('active');
        
    })
})

//4 Test type
const settingsTypeInpEls = document.querySelectorAll('[name="test-type"]');
const outputSettingsTypeEl = document.querySelector('[data-settings="type"]');

function geSettingsTypeName(value){
    if(value === 'typing') return 'Typing';
    else return 'Multiple choice';
}

outputSettingsTypeEl.textContent = geSettingsTypeName(document.querySelector('input[name="test-type"]:checked').value);

const settingsTypeEls = document.querySelectorAll('.test__settings-type');

settingsTypeEls.forEach(btn => {
    btn.addEventListener('click', () => {
        if(settingsTypeEls[0].classList.contains('active')){
            settingsTypeEls[0].classList.remove('active'); 
        } else {
            settingsTypeEls[1].classList.remove('active');
        }

        btn.classList.add('active');
        let inp = btn.querySelector('[name="test-type"]');
        outputSettingsTypeEl.textContent = geSettingsTypeName(inp.value);
    })
})

// 

const previewBlockEl = document.querySelector('[data-test-block="preview"]');
const progressBlockEl = document.querySelector('[data-test-block="progress"]'); // render
let settingsData = {};

formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formEl);
    settingsData = {
        dictionary: formData.get('dictionary'),
        countWords: formData.get('count-words'),
        direction: formData.get('language-direction'),
        type: formData.get('test-type') 
    };
    previewBlockEl.classList.add('hidden');
    progressBlockEl.classList.remove('hidden'); //render

    // // 
    // function getDictionaryArr(dictionary, countWords = dictionary.length){
    //     const dictionaryObj = dictionaryNameArr.find(({value}) => value === dictionary);
    //     const dictionaryType = dictionaryObj?.type;
    //     if(dictionaryType)
    //     const count = dictionaryObj
        

    // }

    // getDictionaryArr(settingsData.dictionary, settingsData.countWords);
    // 
    renderTest();                                // аргументы
})

/* ------------------------------- 2 ---------------------------------------------------------------------------------------------------------------------- */
// test block

const subtitleEl = document.querySelector('[data-test-subtitle]');

function renderTest(wordCount = 10, typeLang = 'en-ru'){
    const bodyTestEl = document.querySelector('[data-section-body="test"]');
    // subtitle
    subtitleEl.textContent  = `${wordCount} words ${typeLang === 'en-ru' ? 'English → Russian' : typeLang === 'ru-en' ? 'Russian → English' : ''}`;
    //button
    const btnEnd = document.querySelector('[data-test-btn="end"]');
    btnEnd.classList.remove('hidden');
    // block question
    const blockMainEl = document.querySelector('[data-test-block="settings"]');
    blockMainEl.setAttribute('data-test-block', 'question');
    blockMainEl.classList.add('test-block', 'test__test-block');
    blockMainEl.classList.remove('test__settings');

    blockMainEl.innerHTML = '';
    // block question counter
    const createCounterWrapper = () => {
        const counterWrapperEl = document.createElement('div');
        counterWrapperEl.classList.add('test-block__counter');

        const counterInfoEl = document.createElement('div');
        counterInfoEl.classList.add('test-block__counter-info');
        counterWrapperEl.append(counterInfoEl);

        const questionInfoEl = document.createElement('span');
        questionInfoEl.classList.add('test-block__question');
        questionInfoEl.innerHTML = ` Question 
                                    <span class="test-block__question-number" data-test-question="number">1</span> 
                                    of 
                                    <span data-test-question="count">${wordCount}</span>
                                    `;

        const progressInfoEl = document.createElement('span');
        progressInfoEl.classList.add('test-block__counter-progresion');
        progressInfoEl.innerHTML = `<span data-test-question="progress">0%</span> 
                                    complete`;

        counterInfoEl.append(questionInfoEl, progressInfoEl);

        return counterWrapperEl;
    }
    
    // block question type language
    const createTypeLangWrapper = () => {
        const typeLangWrapperEl = document.createElement('div');
        typeLangWrapperEl.classList.add('test-block__type');
        typeLangWrapperEl.textContent = typeLang === 'en-ru' ? 'EN → RU' : typeLang === 'ru-en' ? 'RU → EN' : '';
        
        return typeLangWrapperEl;
    }

    //block  question word wrapper 
    const createWordWrapper = () => {
        const wordWrapperEl = document.createElement('div');
        wordWrapperEl.classList.add('test-block__word-wrapper');
        wordWrapperEl.setAttribute('data-test-wrapper', 'word');

        const wordEl = document.createElement('div');
        wordEl.classList.add('test-block__word');
        wordEl.setAttribute('data-test-question', 'word');
        wordEl.textContent = 'test';

        const formEl = document.createElement('form');
        formEl.classList.add('test-block__word-translation');
        formEl.setAttribute('data-form', 'test');

        const inpEl = document.createElement('input');
        inpEl.type = 'text';
        inpEl.placeholder = 'Введите перевод слова';
        inpEl.classList.add('test-block__inp');
        inpEl.name = 'testword';
        inpEl.setAttribute('data-test-word', 'answer');

        const checkBtnEl = document.createElement('button');
        checkBtnEl.type = 'button';
        checkBtnEl.classList.add('test-block__btn-enter', 'btn');
        checkBtnEl.setAttribute('data-test-btn', 'check');
        checkBtnEl.textContent = 'Check';

        formEl.append(inpEl, checkBtnEl);

        const skipBtnEl = document.createElement('button');
        skipBtnEl.type = 'button';
        skipBtnEl.classList.add('test__block__btn-skip', 'btn', 'btn--a');
        skipBtnEl.setAttribute('data-test-btn', 'skip');
        skipBtnEl.textContent = 'Skip Word';

        wordWrapperEl.append(wordEl, formEl, skipBtnEl);
        return wordWrapperEl;
    }

    blockMainEl.append(createCounterWrapper(), createTypeLangWrapper(), createWordWrapper());

    // block answers
    const answersBlockEl = document.createElement('div');
    answersBlockEl.classList.add('answers', 'test__answers', 'block');
    answersBlockEl.setAttribute('data-test-block', 'answers');
    const titleAnswersBlockEl = document.createElement('h3');
    titleAnswersBlockEl.classList.add('answers__title', 'title-2');
    titleAnswersBlockEl.textContent = 'Recent Answers';
    const listAnswersBlockEl = document.createElement('ul');
    listAnswersBlockEl.classList.add('answers__list');
    listAnswersBlockEl.setAttribute('data-test-answers', 'list');
    answersBlockEl.append(titleAnswersBlockEl, listAnswersBlockEl)

    bodyTestEl.append(answersBlockEl);

    const timerEl = document.querySelector('[data-test-timer]');
    let timer;
    let nowDate;
    let id = 0;
    let arrTimerEnds = [];
    let statistics = [];

    function getTimer(){
        timerEl.innerHTML = '00:00';
        nowDate = new Date();
        let min = 0;
        let sec = 0;
        timer = setInterval(() => {
            ++sec;
            timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }, 1000);
    }

    newTest(vocabularyArr);
    
}

// new test


// 
const timerEl = document.querySelector('[data-test-timer]');
let timer;
let nowDate;
let id = 0;
let arrTimerEnds = [];
let statistics = [];

function getTimer(){
    timerEl.innerHTML = '00:00';
    nowDate = new Date();
    let min = 0;
    let sec = 0;
    timer = setInterval(() => {
        ++sec;
        timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }, 1000);
}

const blockQuestionWrapperEl = document.querySelector('[data-block="question"]');

function newTest(arr = [], type = 'en-ru'){
    getTimer();
    // btn end
    const endBtn = document.querySelector('[data-test-btn="end"]');
    // block test-block
    const questionNumberEl = document.querySelector('[data-test-question="number"]');
    const procentProgressEl = document.querySelector('[data-test-question="progress"]');
    const root = document.documentElement;
    const wordWrapperEl = document.querySelector('[data-test-wrapper="word"]');
    const wordEl = document.querySelector('[data-test-question="word"]');
    const checkBtn = document.querySelector('[data-test-btn="check"]');
    const skipBtn = document.querySelector('[data-test-btn="skip"]');
    const answerEl = document.querySelector('[data-test-word="answer"]');
    const formEl = document.querySelector('[data-form="test"]');
    // block progress
    const answersCorrectEl = document.querySelector('[data-test-progress="correct"]');
    const answersMissedEl = document.querySelector('[data-test-progress="missed"]');
    answersCorrectEl.textContent = 0;
    answersMissedEl.textContent = 0;
    // block answers
    const answersListEl = document.querySelector('[data-test-answers="list"]');
    answersListEl.innerHTML = '';
    // 
    const questionsTotal = arr.length;
    let questionNumber = 0;
    let answersCorrect = 0;
    let answersMissed = 0
    let answersArr = [];
    //

    function renderQuestion(word){
        answerEl.value = '';
        questionNumberEl.textContent = questionNumber + 1;
        let procent = questionNumber * 100 / questionsTotal;                            // ?? let -
        procentProgressEl.textContent =`${procent.toFixed(0)}%`;
        root.style.setProperty('--test-progress-procent', procent + '%');
        wordEl.textContent = word.en;
        answersCorrectEl.textContent = answersCorrect;
        answersMissedEl.textContent = answersMissed; 
    }

    renderQuestion(arr[questionNumber]);

    function showResultTest() {
        wordWrapperEl.innerHTML = `
            <h3>Finish</h3>
            <span>${questionNumber + 1} / ${questionsTotal}</span>
        `;
    }

    function createAnswerListItem(word, isValid = false){
        const liEl = document.createElement('li');
        liEl.classList.add('answers__item');

        const wordEl = document.createElement('span');
        wordEl.classList.add('answers__item-word');
        wordEl.textContent = word;

        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.classList.add('answers__icon');

        const useEl = document.createElementNS('http://www.w3.org/2000/svg','use');
        if(isValid){
            useEl.setAttribute('href', '#svg-valid');
            svgEl.classList.add('answers__icon--valid');
        } else {
            useEl.setAttribute('href', '#svg-invalid');
            svgEl.classList.add('answers__icon--invalid');
        }

        svgEl.append(useEl);
        liEl.append(wordEl, svgEl);

        return liEl;
    }

    function checkBtnClick() {
        if(questionNumber === arr.length - 1){
            getStatistics();
        }
        const valueEl = answerEl.value.trim().toLowerCase();
        let isValid = false;
        let itemArr = arr[questionNumber];
        if(valueEl === itemArr.ru.toLowerCase()){
            ++answersCorrect;
            isValid = true;
        } else {
            ++answersMissed;
            isValid = false;
        }
        answersArr.push({
            id: itemArr.id,
            en: itemArr.en,
            ru: valueEl,
            isValid
        });
        // 
        let answerListItemEl = createAnswerListItem(itemArr.en, isValid);
        answersListEl.prepend(answerListItemEl);
        // 
        if(questionNumber < questionsTotal - 1){
            renderQuestion(arr[++questionNumber]);
        } else {
            showResultTest();
            procentProgressEl.textContent =`${(questionNumber + 1) * 100 / 10}%`;
            root.style.setProperty('--test-progress-procent', `${(questionNumber + 1) * 100 / 10}%`);
            answersCorrectEl.textContent = answersCorrect;
            answersMissedEl.textContent = answersMissed; 
        }

        
        
    }

    checkBtn.addEventListener('click', checkBtnClick)
    
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        checkBtnClick();
    })

    skipBtn.addEventListener('click', () => {
        answerEl.value = '';
        checkBtnClick();
    })
    
    function getStatistics() {
        endBtn.setAttribute('data-test-btn', 'restart');
            endBtn.textContent = 'Restart Test';
            clearInterval(timer);
            ++id;
            arrTimerEnds.push({
                id,
                time: timerEl.textContent,
                date: nowDate
            });

            statistics.push({
                id,
                time: timerEl.textContent,
                date: nowDate,
                answersArr
            })
            console.log(statistics);
    }

    endBtn.addEventListener("click", getStatistics);
}

