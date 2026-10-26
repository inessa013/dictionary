import { renderStatistics, showElementTableStatistics, statistics } from './statistics.js';
import { listDictionary } from './main.js';
import { updateCountTestHomeEl } from './home.js';

const testBtn = document.querySelector('[data-section-btn="test"]');
testBtn.addEventListener('click', () => {
    renderTestSettings(listDictionary);
})

const startSettingsBtn = document.querySelector('[data-home-btn="start-test"]');
startSettingsBtn.addEventListener('click', () => {
    renderTest({dictionary : 'mixed', countWords: 10, direction: 'en-ru', typeTest: 'typing'});
})

// список словарей
console.log('list dictionary: ', listDictionary);
console.log('list test end: ', statistics);

// база блока теста
const testSubtitleEl = document.querySelector('[data-test-subtitle]');
const testContainerMainEl = document.querySelector('[data-section-body="test"]');
const testButtonWrapperEl = document.querySelector('[data-test-button="wrapper"]');
let settingsActual = {};

function renderTestSettings(listDictionary){
    testSubtitleEl.textContent = 'Choose your settings and start when ready';
    testButtonWrapperEl.innerHTML = '';
    testContainerMainEl.innerHTML = '';

    const testContainerEl = document.createElement('div');
    testContainerEl.classList.add('test__settings', 'block');
    testContainerEl.setAttribute('data-test-block','settings');
    testContainerMainEl.append(testContainerEl);
    // create block main
    const formEl = document.createElement('form');
    formEl.classList.add('test__settings-form');
    formEl.setAttribute('data-form', 'test-settings');
    formEl.id = 'test-form';

    // create dictionary selection
    const dictionaryLabelEl = document.createElement('label');
    dictionaryLabelEl.classList.add('test__settings-block');
    dictionaryLabelEl.htmlFor = 'settingsDictionary';
    const dictionaryTitleEl = document.createElement('span');
    dictionaryTitleEl.classList.add('test__settings-title');
    dictionaryTitleEl.textContent = 'Select Dictionary';
    const dictionaryWrapperSelectEl = document.createElement('div');
    dictionaryWrapperSelectEl.classList.add('select__wrapper');
    const dictionarySelectEl = document.createElement('select');
    dictionarySelectEl.name = 'dictionary';
    dictionarySelectEl.id = 'settingsDictionary';

   listDictionary.forEach(({name, value}) => {
        const optionEl = document.createElement('option');
        optionEl.value = value;
        optionEl.textContent = name;
        dictionarySelectEl.append(optionEl);
    });
    dictionaryWrapperSelectEl.append(dictionarySelectEl);
    dictionaryLabelEl.append(dictionaryTitleEl, dictionaryWrapperSelectEl);

    // create count words select
    const countLabelEl = document.createElement('label');
    countLabelEl.classList.add('test__settings-block');
    countLabelEl.htmlFor = 'settingsWords';
    const countTitleEl = document.createElement('span');
    const countTitleWrapperEl = document.createElement('div');
    countTitleWrapperEl.classList.add('test__settings-title-wrapper');
    countTitleEl.classList.add('test__settings-title');
    countTitleEl.textContent = 'Number of Words';
    const helpEl = document.createElement('span');
    helpEl.classList.add('test__settings-help');
    helpEl.textContent = '?';
    const countWrapperSelectEl = document.createElement('div');
    countWrapperSelectEl.classList.add('select__wrapper');
    const countSelectEl = document.createElement('select')
    countSelectEl.name = 'count-words';
    countSelectEl.id = 'settingsWords';

    [10, 20, 30].forEach((count) => {
        const optionEl = document.createElement('option');
        optionEl.value = count;
        optionEl.textContent = typeof count === 'number' ? `${count} Words` : count[0].toUpperCase() + count.slice(1);
        countSelectEl.append(optionEl);
    })

    countTitleWrapperEl.append(countTitleEl, helpEl);
    countWrapperSelectEl.append(countSelectEl);
    countLabelEl.append(countTitleWrapperEl, countWrapperSelectEl);

    function createRadioSelectBlock(title, groupClassName, rest){
        const wrapperEl = document.createElement('div');
        wrapperEl.classList.add('test__settings-block');

        const titleEl = document.createElement('span');
        titleEl.textContent = title;

        const groupEl = document.createElement('div');
        groupEl.classList.add(groupClassName);

        rest[2].forEach((el, index) => {
            const labelEL = document.createElement('label');
            labelEL.classList.add(rest[0]);
            if (index === 0) labelEL.classList.add('active');
            labelEL.htmlFor = el.id;

            el.name.forEach((name) => {
                const spanEl = document.createElement('span');
                spanEl.textContent = name;
                labelEL.append(spanEl);
            });

            const inputEl = document.createElement('input');
            inputEl.type = 'radio';
            inputEl.name = rest[1];
            inputEl.value = el.value;
            inputEl.id = el.id;

            if(index === 0) inputEl.checked = true;

            labelEL.append(inputEl);
            groupEl.append(labelEL);
        })

        wrapperEl.append(titleEl, groupEl);

        return wrapperEl;
    }

    // create direction selection
    const directionSelectEl = createRadioSelectBlock('Direction', 
        'test__settings-lang', 
        [
            'test__settings-langs',
            'language-direction',
            [{
                id: 'lang-er',
                name: ['English → Russian'],
                value: 'en-ru'
            },
            {
                id: 'lang-re',
                name: ['Russian → English'],
                value: 'ru-en'
            }]
        ])

    // create test type
    const typeSelectEl = createRadioSelectBlock('Test type', 
        'test__settings-types', 
        [
                'test__settings-type',
                'test-type',
                [{
                    id: 'typing-mode',
                    name: ['Typing mode', 'Type the translation yourself'],
                    value: 'typing'
                },
                {
                    id: 'multiple-choice',
                    name: ['Multiple choice', 'Pick the correct answer'],
                    value: 'choice'
                }]
            ]);

    formEl.append(dictionaryLabelEl, countLabelEl, directionSelectEl, typeSelectEl);
    testContainerEl.append(formEl);

    //create block secondary-------------------------------------------------------
    const blockTestPreviewEl = document.createElement('div');
    blockTestPreviewEl.classList.add('test__preview', 'block');
    blockTestPreviewEl.setAttribute('data-test-block', 'preview');

    const titleBlockTestPreviewEl = document.createElement('h3');
    titleBlockTestPreviewEl.textContent = 'Session Preview';
    titleBlockTestPreviewEl.classList.add('test__title', 'title-2');

    const bodyBlockTestPreviewEl = document.createElement('div');
    bodyBlockTestPreviewEl.classList.add('test__preview-body');

    const listTestPreviewEl = document.createElement('ul');
    listTestPreviewEl.classList.add('answers__list');
    [
        {
            name: 'Dictionary',
            dataSettings: 'dictionary'
        },
        {
            name: 'Words',
            dataSettings: 'words'
        },
        {
            name: 'Direction',
            dataSettings: 'direction'
        },
        {
            name: 'Mode',
            dataSettings: 'type'
        },
        {
            name: 'Estimated times',
            dataSettings: 'time'
        }
    ].forEach(({name, dataSettings}) => {
        const liEl = document.createElement('li');
        liEl.classList.add('answers__item');

        const nameEl = document.createElement('span');
        nameEl.classList.add('answers__item-name');
        nameEl.textContent = name;

        const setupEl = document.createElement('span');
        setupEl.setAttribute('data-settings', dataSettings);

        liEl.append(nameEl, setupEl);
        listTestPreviewEl.append(liEl);
    })

    bodyBlockTestPreviewEl.append(listTestPreviewEl);

    const messageErrorEl = document.createElement('span');
    messageErrorEl.classList.add('hidden');
    messageErrorEl.style.color = 'var(--color-invalid)';
    dictionarySelectEl.addEventListener('change', () => {
        messageErrorEl.classList.add('hidden');
    })

    const btnTestPreviewEl = document.createElement('button');
    btnTestPreviewEl.classList.add('btn');
    btnTestPreviewEl.type = 'submit';
    btnTestPreviewEl.setAttribute('data-test-btn', 'start');
    btnTestPreviewEl.setAttribute('form', 'test-form');
    btnTestPreviewEl.textContent = 'Start Test';

    blockTestPreviewEl.append(titleBlockTestPreviewEl, bodyBlockTestPreviewEl, messageErrorEl ,btnTestPreviewEl);

    testContainerMainEl.append(blockTestPreviewEl);

    // active ------------------------------------------------------------------

    //1 Dictionary
    const settingsDictionaryEl = document.querySelector('#settingsDictionary');
    const outputSettingsDictionaryEl = document.querySelector('[data-settings="dictionary"]');

    function getDictionaryNameAndType(v){
        const dictionary = listDictionary.find( ({value}) => value === v);
        return [dictionary?.name, dictionary?.type, dictionary?.wordsArr?.length];
    }

    //2 Count Words + 5 Estimated times
    const settingsWordsEl = document.querySelector('#settingsWords');
    const outputSettingsWordsEl = document.querySelector('[data-settings="words"]');
    const outputSettingsTimeEl = document.querySelector('[data-settings="time"]');

    function getSettingsTime(count){
        count = parseInt(count);
        switch(true){
            case count >= 0 && count <=10 : return 5;
            case count <= 20 : return 10;
            case count <= 30 : return 15;
            default : return null;
        }
    }

    function showCountWordAndTime(){
        const [name, type, leng] = getDictionaryNameAndType(settingsDictionaryEl.value);
        outputSettingsDictionaryEl.textContent = name;
        if(type === 'personal') {
            countSelectEl.disabled = true;
            outputSettingsWordsEl.textContent = leng ?? 0;
            outputSettingsTimeEl.textContent = `${getSettingsTime(leng)} min`;
        }
        else {
            countSelectEl.disabled = false;
            outputSettingsWordsEl.textContent = settingsWordsEl.value;
            outputSettingsTimeEl.textContent = `${getSettingsTime(settingsWordsEl.value)} min`;
        }
    }

    
    outputSettingsDictionaryEl.textContent = getDictionaryNameAndType(settingsDictionaryEl.value)[0];
    showCountWordAndTime();

    settingsDictionaryEl.addEventListener('change', showCountWordAndTime);

    settingsWordsEl.addEventListener('change',showCountWordAndTime);

    //3 Direction
    const outputsettingsDirectionEl = document.querySelector('[data-settings="direction"]');
    const settingsLangBtns = document.querySelectorAll('.test__settings-langs');
    outputsettingsDirectionEl.textContent = document.querySelector('input[name="language-direction"]:checked').value.toUpperCase();

    settingsLangBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const button = event.target.closest('.test__settings-langs');
            [...settingsLangBtns].find((btn) => btn.classList.contains('active')).classList.remove('active');
            button.classList.add('active');
            
            const inp =  button.querySelector('input');
            outputsettingsDirectionEl.textContent = inp.value.toUpperCase();
            
        })
    })

    //4 Test type
    const outputSettingsTypeEl = document.querySelector('[data-settings="type"]');

    function geSettingsTypeName(value){
        if(value === 'typing') return 'Typing';
        else return 'Multiple choice';
    }

    outputSettingsTypeEl.textContent = geSettingsTypeName(document.querySelector('input[name="test-type"]:checked').value);

    const settingsTypeEls = document.querySelectorAll('.test__settings-type');

    settingsTypeEls.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const button = event.target.closest('.test__settings-type');
            [...settingsTypeEls].find((btn) => btn.classList.contains('active')).classList.remove('active');
            button.classList.add('active');
            const inp = button.querySelector('[name="test-type"]');
            outputSettingsTypeEl.textContent = geSettingsTypeName(inp.value);
        })
    })

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(formEl);
        const settingsData = {
            dictionary: formData.get('dictionary'),
            countWords: formData.get('count-words') ?? 'default',
            direction: formData.get('language-direction'),
            typeTest: formData.get('test-type') 
        }
        settingsActual = settingsData;
        console.log('settingsActual', settingsActual);
        console.log(settingsActual.typeTest);
        if((settingsActual.dictionary !== 'mixed') && listDictionary.find(({value, type}) => value === settingsActual.dictionary && (type === 'personal' || type === 'system')).wordsArr.length === 0){
            messageErrorEl.textContent = 'There are no words in this dictionary.';
            messageErrorEl.classList.remove('hidden');
        } else if(settingsActual.typeTest === 'choice'){
            messageErrorEl.textContent = 'Multiple Choice — In Development.';
            messageErrorEl.classList.remove('hidden');
        } else {
            renderTest(settingsData);
        }
        
    });

}

renderTestSettings(listDictionary);

// ---------------------------------------------------------------------------------

function renderTest({dictionary, countWords, direction, typeTest}){
    testButtonWrapperEl.innerHTML = '';
    testContainerMainEl.innerHTML = '';
    testSubtitleEl.textContent  = `${countWords === 'default' ? listDictionary.find(({value}) => value === dictionary).wordsArr.length : countWords } words ${direction === 'en-ru' ? 'English → Russian' : direction === 'ru-en' ? 'Russian → English' : ''}`;
    const endBtn = document.createElement('button');
    endBtn.type = 'button';
    endBtn.textContent = 'End Test';
    endBtn.classList.add('test__btn', 'btn', 'btn-a');
    endBtn.setAttribute('data-test-btn', 'end');
    testButtonWrapperEl.append(endBtn);
    console.log(testButtonWrapperEl)
    let wordsArr;
    // функция для смешивания слов
    function mixWords(arr, count = 'default'){
        for(let i = arr.length - 1; i > 0; i--){
            const j = Math.trunc(Math.random() * (i + 1));  
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        if(count === 'default') count = arr.length;
        return [...arr.slice(0, count).map((el,index) => ({
            ...el,
            id: (index + 1)
        }))];
    }

    function numberRandomn(number = []){
        let i = 1;
        let isInclude;
        do{
            isInclude = false;
            i = Math.trunc(Math.random() * (listDictionary.length - 1)) + 1;
            isInclude = number.includes(i);
        } while(isInclude);
        
        return i;
    }

    if(dictionary === 'mixed'){
        if(dictionary.length < 4){
            if(dictionary.length ===  3){
                wordsArr = mixWords([...listDictionary[2].wordsArr, ...listDictionary[3].wordsArr], countWords);
            } else if(dictionary.length === 2){
                wordsArr = mixWords([...listDictionary[2].wordsArr], countWords);
            } else console.log('There are no dictionaries'); 
        } else {
            const n1 = numberRandomn(); console.log(n1);
            const n2 = numberRandomn([n1]); console.log(n2);
            const n3 = numberRandomn([n1, n2]);console.log(n3)
            wordsArr = mixWords([...listDictionary[n1].wordsArr, ...listDictionary[n2].wordsArr, ...listDictionary[n3].wordsArr], countWords);
        } 
    } else {
        const infoDictionary = listDictionary.find(({value}) => dictionary === value);
        console.log(infoDictionary);
        if(infoDictionary.type === 'system'){
            wordsArr = mixWords([...infoDictionary.wordsArr], countWords);
        } else if(infoDictionary.type === 'personal'){
            wordsArr = mixWords([...infoDictionary.wordsArr]);
        } else console.log('Ошибка .Такого типа словаря в системе не предусмотренно');
    }
    console.log( 'arr: ', wordsArr);
    // готов словарь для type single

    //render test

    //button
    const btnEnd = document.querySelector('[data-test-btn="end"]');
    
    btnEnd.classList.remove('hidden');
    // block question
    const blockMainEl = document.createElement('div');
    blockMainEl.setAttribute('data-test-block', 'question');
    blockMainEl.classList.add('test-block', 'test__test-block', 'block');

    testContainerMainEl.append(blockMainEl);
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
                                    <span data-test-question="count">${countWords}</span>
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
        typeLangWrapperEl.textContent = direction === 'en-ru' ? 'EN → RU' : direction === 'ru-en' ? 'RU → EN' : '';
        
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
        wordEl.textContent = '';

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

    // block progress
    const progressBlockEl = document.createElement('div');
    progressBlockEl.classList.add('progress', 'test__progress', 'block');
    progressBlockEl.setAttribute('data-test-block', 'progress');
    const titleProgressBlockEl = document.createElement('h3');
    titleProgressBlockEl.classList.add('progress__title', 'title-2');
    titleProgressBlockEl.textContent = 'Progress';
    const bodyProgressBlockEl = document.createElement('div');
    bodyProgressBlockEl.classList.add('progress__inner');
    const timerWrapperProgressBlockEl = document.createElement('div');
    timerWrapperProgressBlockEl.classList.add('progress__timer-wrapper');
    const titleTimerProgressBlockEl = document.createElement('h4');
    titleTimerProgressBlockEl.classList.add('progress__timer-title');
    titleTimerProgressBlockEl.textContent = 'Time Elapsed'
    const timerProgressBlockEl = document.createElement('div');
    timerProgressBlockEl.classList.add('progress__timer');
    timerProgressBlockEl.setAttribute('data-test-timer', '');
    timerProgressBlockEl.textContent = '00:00';
    timerWrapperProgressBlockEl.append(titleTimerProgressBlockEl, timerProgressBlockEl);
    const countWrapperProgressBlockEl = document.createElement('div');
    countWrapperProgressBlockEl.classList.add('progress__couter-wrapper');
    ['correct', 'missed'].forEach((name) => {
        const counterProgressBlockEl = document.createElement('div');
        counterProgressBlockEl.classList.add('progress__counter');
        const textEl = document.createElement('span');
        if(name === 'correct'){
            counterProgressBlockEl.classList.add('progress__counter--valid')
            textEl.textContent = 'Correct';
        }else {
            counterProgressBlockEl.classList.add('progress__counter--invalid')
            textEl.textContent = 'Missed';
        }
        const counterEl = document.createElement('span');
        counterEl.setAttribute('data-test-progress', name);
        counterEl.textContent = 0;

        counterProgressBlockEl.append(counterEl, textEl);
        countWrapperProgressBlockEl.append(counterProgressBlockEl);
    })

    bodyProgressBlockEl.append(timerWrapperProgressBlockEl, countWrapperProgressBlockEl);
    progressBlockEl.append(titleProgressBlockEl, bodyProgressBlockEl);
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

    testContainerMainEl.append(progressBlockEl, answersBlockEl);

    // start test ->
    newTest(wordsArr, direction);

}



function newTest(arr = [], direction = 'en-ru'){
    const timerEl = document.querySelector('[data-test-timer]');
    let timer;
    let nowDate;
    let calcId = Math.max(...statistics.map(({id}) => id))  ;
    let id = calcId > 0 ? calcId : 0;
    let arrTimerEnds = [];

    function getTimer(){
        timerEl.innerHTML = '00:00';
        nowDate = new Date();
        let min = 0;
        let sec = 0;
        timer = setInterval(() => {
            ++sec;
            if(sec >= 60){
                ++min;
                sec = 0;
            }
            timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }, 1000);
    }
    getTimer();
    // btn end
    const endBtn = document.querySelector('[data-test-btn="end"]');
    // block test-block
    const blockMainEl = document.querySelector('[data-test-block="question"]');
    const questionNumberEl = document.querySelector('[data-test-question="number"]');
    const questionCountEl = document.querySelector('[data-test-question="count"]');
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
    questionCountEl.textContent = questionsTotal;

    function renderQuestion(word){
        answerEl.value = '';
        questionNumberEl.textContent = questionNumber + 1;
        let procent = questionNumber * 100 / questionsTotal;                            // ?? let -
        procentProgressEl.textContent =`${procent.toFixed(0)}%`;
        root.style.setProperty('--test-progress-procent', procent + '%');
        wordEl.textContent = (direction === 'en-ru' ? word.en : word.ru).split(',')[0];
        answersCorrectEl.textContent = answersCorrect;
        answersMissedEl.textContent = answersMissed; 
    }

    renderQuestion(arr[questionNumber]);

    
function showResultTest() {
    const procentResult = questionsTotal > 0
        ? Math.round(answersCorrect * 100 / questionsTotal)
        : 0;

    let test__progressClass;

    if (procentResult < 50) {
        test__progressClass = 'test__result-progress--bad';
    } else if (procentResult < 80) {
        test__progressClass = 'test__result-progress--average';
    } else {
        test__progressClass = 'test__result-progress--good';
    }

    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - procentResult / 100);

    blockMainEl.innerHTML = `
        <div class="test__result-wrapper">
            <h3 class="test__result-title">Finish</h3>

            <section class="test__result-card">
                <div class="test__result-ring">
                    <svg viewBox="0 0 240 240" aria-hidden="true">
                        <circle
                            class="test__result-track"
                            cx="120"
                            cy="120"
                            r="${radius}"
                        />
                        <circle
                            class="test__result-progress ${test__progressClass}"
                            cx="120"
                            cy="120"
                            r="${radius}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                        />
                    </svg>

                    <div class="test__result-label">
                        <div class="test__result-percent">${procentResult}% correct</div>
                    </div>
                </div>

                <div class="test__result-message">
                    ${procentResult >= 80
                        ? 'Great job!'
                        : procentResult >= 50
                            ? 'Good job!'
                            : 'Keep practicing!'}
                </div>
            </section>

            <button
                type="button"
                class="test__result-btn btn"
                data-btn="return"
            >
                Back to Test Home
            </button>
        </div>
    `;

    const test__returnBtn = blockMainEl.querySelector('[data-btn="return"]');

    test__returnBtn.addEventListener('click', () => {
        renderTestSettings(listDictionary);
    });
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
        const valueEl = answerEl.value.trim().toLowerCase();
        let isValid = false;
        let itemArr = arr[questionNumber];
        let primaryWord = direction === 'en-ru' ? itemArr.en : itemArr.ru;
        let checkWords = (direction === 'en-ru' ? itemArr.ru : itemArr.en).split(',');
        console.log(checkWords);
        if(checkWords.some((word) => word.trim().toLowerCase() === valueEl)){
            ++answersCorrect;
            isValid = true;
        } else {
            ++answersMissed;
            isValid = false;
        }
        answersArr.push({
            id: itemArr.id,
            en: itemArr.en,
            ru: itemArr.ru,
            answer: valueEl,
            isValid,
        });
        if(questionNumber === arr.length - 1){
            getStatistics();
        }
        // 
        let answerListItemEl = createAnswerListItem(primaryWord, isValid);
        answersListEl.prepend(answerListItemEl);
        // 
        if(questionNumber < questionsTotal - 1){
            renderQuestion(arr[++questionNumber]);
        } else {
            procentProgressEl.textContent =`${(questionNumber + 1) * 100 / arr.length}%`;
            root.style.setProperty('--test-progress-procent', `${(questionNumber + 1) * 100 / arr.length}%`);
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

        for (let i = answersArr.length; i < arr.length; i++) {
            const item = arr[i];

            answersArr.push({
                id: item.id,
                en: item.en,
                ru: item.ru,
                answer: '',
                isValid: false
            });
        }

        const el = {
            id,
            time: timerEl.textContent,
            date: nowDate,
            answersArr,
            direction
        }

        statistics.push(el);
        updateCountTestHomeEl(statistics);
        if(statistics.length === 1) renderStatistics(statistics);
        else showElementTableStatistics(el);
        localStorage.setItem('statisticsTest', JSON.stringify(statistics));
        console.log(statistics);
        endBtn.removeEventListener('click', getStatistics);
        showResultTest();
        function restartBtn(){
            endBtn.setAttribute('data-test-btn', 'end');
            endBtn.textContent = 'End Test';
            endBtn.removeEventListener('click', restartBtn);
            renderTest(settingsActual);
        }

        endBtn.addEventListener('click', restartBtn);
    }

    endBtn.addEventListener("click", getStatistics);
}


export {renderTestSettings};