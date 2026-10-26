import { listDictionary } from "./main.js";

const radioEl = document.querySelector('[name="type-dictionary"]:checked');
radioEl.closest('label').classList.add('active');

let preventRadioEl = radioEl;
let preventLiEl = null;
const radioEls = document.querySelectorAll('[name="type-dictionary"]');
const listEl = document.querySelector('[data-dictionary="list"]');

const dictionaryEl = document.querySelector('[data-dictionary="dictionary"]');

radioEls.forEach((btn) => {
        btn.addEventListener('change', (event) => {
        const radioEl = event.target;
        preventRadioEl.closest('label').classList.remove('active');
        radioEl.closest('label').classList.add('active');
        preventRadioEl = radioEl;

       showlistDictionary(radioEl.value);
    })
})


function createItemDictionary(id, name, value, type, countWords, maxLength){
    const liEl = document.createElement('li');
    liEl.classList.add('dictionary__item');
    const btnEl = document.createElement('button');
    btnEl.classList.add('dictionary__btn');
    btnEl.type = 'button';
    btnEl.setAttribute('data-dictionary-value', value);
    if(parseInt(dictionaryEl.querySelector('.dictionary__system-name')?.getAttribute('data-dictionary-id')) === parseInt(id)){
        btnEl.classList.add('dictionary__btn--active');
        preventLiEl = btnEl;
    }
    const headerEl = document.createElement('div');
    headerEl.classList.add('dictionary__btn-header');
    const titleEl = document.createElement('span');
    titleEl.classList.add('dictionary__btn-title');
    const nameEl = document.createElement('span');
    nameEl.classList.add('dictionary__btn-name');
    nameEl.textContent = name;
    const typeEl = document.createElement('span');
    typeEl.classList.add('dictionary__type');
    typeEl.textContent = type;
    const penEl  = document.createElement('span');
    penEl.classList.add('dictionary__btn-pen');
    
    if(type === 'system') {
        typeEl.classList.add('dictionary__type--system');
        penEl.innerHTML = '&#128274;';
    }
    else if(type === 'personal') {
        typeEl.classList.add('dictionary__type--personal');
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const useEl = document.createElementNS('http://www.w3.org/2000/svg','use');
        svgEl.classList.add('dictionary__pen');
        useEl.setAttribute('href', '#svg-pen');
        svgEl.append(useEl);
        penEl.append(svgEl);
    } 
    titleEl.append(nameEl, typeEl);
    headerEl.append(titleEl, penEl);

    const bottomEl = document.createElement('div');
    bottomEl.classList.add('dictionary__bottom');
    const descEl = document.createElement('span');
    descEl.classList.add('dictionary__desc');
    const countWordEl = document.createElement('span');
    countWordEl.classList.add('dictionary__count-word')
    countWordEl.textContent = (type === 'system' ? countWords + ' words · read only' : countWords + ' / ' + maxLength + ' words');
    descEl.append(countWordEl)
    bottomEl.append(descEl);
    if(type === 'personal'){
        const procentEl = document.createElement('span');
        procentEl.classList.add('dictionary__procent-word');
        procentEl.style.setProperty('--progress', `${countWords * 100 / maxLength}%`);
        bottomEl.append(procentEl);
    } 
    btnEl.append(headerEl, bottomEl);
    liEl.append(btnEl);
    return liEl;
}

function showlistDictionary(type = 'all'){
    listEl.innerHTML = '';
    listDictionary.forEach((d) => {
        if(d.value === 'mixed') return;
        if(type === d.type || type === 'all')
            listEl.append(createItemDictionary(d.id ,d.name, d.value, d.type, d.wordsArr.length, d.maxLength));
            
                
    })
}

showlistDictionary()



listEl.addEventListener('click', (event) => {
    if(preventLiEl) preventLiEl.classList.remove('dictionary__btn--active');
    const btn = event.target.closest('.dictionary__btn');
    btn.classList.add('dictionary__btn--active');
    showSystemDictionary(btn.dataset.dictionaryValue);
    preventLiEl = btn;
})



function showSystemDictionary(dictionaryValue){
    dictionaryEl.classList.add('dictionary__system');
    dictionaryEl.innerHTML = '';
    const dictionary = listDictionary.find(({value}) => value === dictionaryValue);
    console.log(dictionary);
    const headerEl = document.createElement('div');
    headerEl.classList.add('dictionary__system-header');
    const titleEl = `<div class="dictionary__system-title">
                        <span class="dictionary__system-name" data-dictionary-id='${dictionary.id}'>${dictionary.name}</span>
                        <span class="dictionary__type dictionary__type--${dictionary.type}">${dictionary.type}</span>
                    </div>`;
    headerEl.insertAdjacentHTML('afterbegin', titleEl); 
    dictionaryEl.append(headerEl);
    const ulEl = document.createElement('ul');
    ulEl.classList.add('dictionary__word-list');
    if(dictionary.type === 'system'){
        const messageEl = `<div class="dictionary__system-count">${dictionary.wordsArr.length} words</div>
                           <div class="dictionary__system-message">&#128274; This is a system dictionary. You can use it in tests, but it can’t be edited or deleted.</div>`; 
        headerEl.insertAdjacentHTML('beforeend', messageEl);
    } else if (dictionary.type === 'personal'){
        const headerBottomEl = `<div class="dictionary__bottom">
                                        <span class="dictionary__desc">
                                            <span class="dictionary__count-word">
                                            <span data-dictionary-procent="count"></span> / <span data-dictionary-procent="count-total"></span> words</span>
                                        </span>
                                        <span class="dictionary__procent-word" data-dictionary="procent"></span>
                                    </div>`;
        headerEl.insertAdjacentHTML('beforeend', headerBottomEl);
        ulEl.style.setProperty(
            '--color-amber',
            'var(--color-accent)'
        );
        
        updateProcent(dictionary);
    }
    function updateProcent(dictionary){
        const countEl = document.querySelector('[data-dictionary-procent="count"]');
        const totalEl = document.querySelector('[data-dictionary-procent="count-total"]');
        const procentEl = document.querySelector('[data-dictionary="procent"]');
        console.log(totalEl)
        countEl.textContent = dictionary.wordsArr.length;
        totalEl.textContent = dictionary.maxLength;
        procentEl.style.setProperty('--progress', `${dictionary.wordsArr.length * 100 / dictionary.maxLength}%`);
    }

    dictionary.wordsArr.forEach((word) => {
        const liEl = document.createElement('li');
        liEl.classList.add('dictionary__system-item');
        const wordEl = document.createElement('span');
        wordEl.classList.add('dictionary__system-word');
        wordEl.textContent = word.en;
        const translationEl = document.createElement('span');
        translationEl.classList.add('dictionary__system-translation');
        translationEl.textContent = word.ru;
        liEl.append(wordEl, translationEl);
        if(dictionary.type === 'personal'){
            const deleteBtn = document.createElement('button');
            deleteBtn.type  = 'button';
            deleteBtn.textContent = 'x';
            deleteBtn.classList.add('dictionary__system-words-delete');
            deleteBtn.setAttribute('data-dictionary-btn-id', word.id);
            liEl.append(deleteBtn);
        }

        ulEl.append(liEl);
    })
    function showEmptyListMessage(list = ulEl){
            const liEl = document.createElement('li');
            liEl.textContent = 'No words yet. Add your first one below.';
            liEl.classList.add('dictionary__empty');
            list.append(liEl);
    }


    if(!ulEl.children.length) showEmptyListMessage();
    dictionaryEl.append(ulEl);

    if(dictionary.type === 'personal'){
        const formEl = document.createElement('form');
        formEl.classList.add('dictionary__personal-form');
        updateFormState();
        const wordEl = document.createElement('input');
        wordEl.type = 'text';
        wordEl.name = 'dictionary-name';
        
        const translationEl = document.createElement('input');
        translationEl.type = 'text';
        translationEl.name = 'dictionary-translated';

        const addBtn = document.createElement('button');
        addBtn.type = 'submit'
        addBtn.textContent = 'Add Word';
        addBtn.classList.add('btn');

        formEl.append(wordEl, translationEl, addBtn);

        dictionaryEl.append(formEl);
        console.log(formEl)

        formEl.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(event.target);

            console.log(Object.fromEntries(data.entries()));
        })

        const deleteDictionaryBtn = document.createElement('button');
        deleteDictionaryBtn.classList.add('dictionary__action-dictionary');
        deleteDictionaryBtn.type = 'button';
        deleteDictionaryBtn.textContent = 'Delete Dictionary';
        dictionaryEl.append(deleteDictionaryBtn);

        deleteDictionaryBtn.addEventListener('click', () => {
            const idDictionary = Number(
                dictionaryEl.querySelector('[data-dictionary-id]').dataset.dictionaryId
            );

            const dictionaryIndex = listDictionary.findIndex(
                ({ id }) => Number(id) === idDictionary
            );

            if (dictionaryIndex === -1) return;

            listDictionary.splice(dictionaryIndex, 1);

            localStorage.setItem('listDictionary', JSON.stringify(listDictionary));

            showlistDictionary();

            dictionaryEl.classList.remove('dictionary__system');
            dictionaryEl.innerHTML = '<p class="dictionary__empty">Select a dictionary to view it.</p>';
        });

        ulEl.addEventListener('click', (event) => {
            const btn = event.target.closest('.dictionary__system-words-delete');
            
            if (!btn) return;
            const idDelete = Number(btn.dataset.dictionaryBtnId);
            const idDictionary = Number(
                dictionaryEl.querySelector('[data-dictionary-id]').dataset.dictionaryId
            );
            const dictionary = listDictionary.find(
                ({ id }) => Number(id) === idDictionary
            );
            if (!dictionary) return;
            const wordIndex = dictionary.wordsArr.findIndex(
                ({ id }) => Number(id) === idDelete
            );
            if (wordIndex === -1) return;
            dictionary.wordsArr.splice(wordIndex, 1);
            localStorage.setItem('listDictionary', JSON.stringify(listDictionary));
            btn.closest('.dictionary__system-item').remove();
            updateProcent(dictionary);
            if (dictionary.wordsArr.length === 0) {
                showEmptyListMessage();
            }
            updateFormState();
        });

        function updateFormState() {
            formEl.classList.toggle(
                'dictionary__form-disable',
                dictionary.wordsArr.length >= dictionary.maxLength
            );
        }

        formEl.addEventListener('submit', (event) => {
            event.preventDefault();

            const data = new FormData(formEl);
            const entries = Object.fromEntries(data.entries());

            const en = entries['dictionary-name'].trim();
            const ru = entries['dictionary-translated'].trim();

            if (!en || !ru) return;

            if (dictionary.wordsArr.length >= dictionary.maxLength) {
                return;
            }

            const newWord = {
                id: dictionary.wordsArr.reduce(
                    (max, word) => Math.max(max, Number(word.id) || 0),
                    0
                ) + 1,
                en,
                ru
            };

            dictionary.wordsArr.push(newWord);

            localStorage.setItem('listDictionary', JSON.stringify(listDictionary));

            const emptyMessage = ulEl.querySelector('.dictionary__empty');
            if (emptyMessage) emptyMessage.remove();

            const liEl = document.createElement('li');
            liEl.classList.add('dictionary__system-item');

            const wordEl = document.createElement('span');
            wordEl.classList.add('dictionary__system-word');
            wordEl.textContent = en;

            const translationEl = document.createElement('span');
            translationEl.classList.add('dictionary__system-translation');
            translationEl.textContent = ru;

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.textContent = '×';
            deleteBtn.classList.add('dictionary__system-words-delete');
            deleteBtn.dataset.dictionaryBtnId = newWord.id;

            liEl.append(wordEl, translationEl, deleteBtn);
            ulEl.append(liEl);

            formEl.reset();
            updateFormState();
            updateProcent(dictionary);
            showlistDictionary();
        });
    }
}


const newDictionaryBtn = document.querySelector('[data-dictionary-btn="new-dictionary"]');

newDictionaryBtn.addEventListener('click', () => {
    preventLiEl?.classList.remove('dictionary__btn--active');
    preventLiEl = null;
    dictionaryEl.innerHTML = `<div class="dictionary__new-title">Create a New Dictionary</div>
                            <form action="" class="dictionary__new-form" data-form="new-dictionary">
                                <label class="dictionary__new-wrapper" for="dictionary-new-name">
                                    <span class="dictionary__new-name">Name</span>
                                    <input type="text" name="dictionary-new-name" id="dictionary-new-name">
                                    <span class="dictionary__mess-error hidden" data-dictionary-message="error"><span>
                                </label>
                                <div class="dictionary__new-count dictionary__new-wrapper">
                                    <span class="dictionary__new-name">Maximum number of words in a dictionary</span>
                                    <div class="dictionary__new-row dictionary__radio-wrapper">
                                        <label for="dic-10">
                                            <span>10 words</span>
                                            <input type="radio" name="dictionary-new-count-words" value="10" id="dic-10" checked>
                                        </label>
                                        <label for="dic-20">
                                            <span>20 words</span>
                                            <input type="radio" name="dictionary-new-count-words" value="20" id="dic-20">
                                        </label>
                                        <label for="dic-30">
                                            <span> 30 words</span>
                                            <input type="radio" name="dictionary-new-count-words" value="30" id="dic-30">
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" class="dictionary__action-dictionary" data-dictionary-btn="save">Save dictionary</button>
                            </form>`; 

    const radioEl = document.querySelector('[name="dictionary-new-count-words"]:checked');
    radioEl.closest('label').classList.add('active');

    let preventRadioEl = radioEl;
    const radioEls = document.querySelectorAll('[name="dictionary-new-count-words"]');

    radioEls.forEach((btn) => {
            btn.addEventListener('change', (event) => {
            const radioEl = event.target;
            preventRadioEl.closest('label').classList.remove('active');
            radioEl.closest('label').classList.add('active');
            preventRadioEl = radioEl;
        })
    })

    const formEl = document.querySelector('[data-form="new-dictionary"]');

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInpEl = document.querySelector('[name="dictionary-new-name"]');
        const valueName = nameInpEl.value.trim();
        const messageError = document.querySelector('[data-dictionary-message="error"]');
        if(valueName === ''){
            messageError.classList.remove('hidden');
            messageError.textContent = 'Enter a name for the new dictionary!';
        } else if(listDictionary.some(({value}) => value === valueName.toLowerCase().split(/\s+/).join(''))) {
            messageError.classList.remove('hidden');
            messageError.textContent = 'A dictionary with this name already exists!';
        } else {
            const data = new FormData(event.target);
            const entriesArr = Object.fromEntries(data.entries());
            console.log(entriesArr);
            const newDictionary = {
                id: listDictionary.reduce((m, {id}) => Math.max(m, id), 0) + 1,
                value: entriesArr['dictionary-new-name'].trim().toLowerCase().split(/\s+/).join(''),
                name: entriesArr['dictionary-new-name'].trim(),
                type: 'personal',
                wordsArr: [],
                maxLength: entriesArr['dictionary-new-count-words']
            }
            console.log(newDictionary);
            listDictionary.push(newDictionary);
            localStorage.setItem('listDictionary', JSON.stringify(listDictionary));
            console.log(listDictionary);
            showSystemDictionary(newDictionary.value);
            showlistDictionary();
        }
        

    })
})