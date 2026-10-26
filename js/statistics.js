const response = localStorage.getItem('statisticsTest');
console.log('response: ', response);
let dataStatistics = response ? JSON.parse(response) : [];
// console.log(dataStatistics)


function renderStatistics(dataStatistics) {
    const tableEl = document.querySelector('[data-table="statistics"]');
    tableEl.innerHTML = '';

    if(dataStatistics.length < 1){
        tableEl.innerHTML = 'No statistics yet'
        tableEl.style.color = 'var(--color-text-secondary)';
        tableEl.style.textAlign = 'center';
        return;
    } else {
        const theadEl = document.createElement('thead');

        ['Id', 'Time', 'Date', 'Result', 'Direction'].forEach(el => {
            const thEl = createTd(el, 'th');
            theadEl.append(thEl);
        });

        const tbodyEl = document.createElement('tbody');

        [...dataStatistics].reverse().forEach(el => {
            const rowEl = addRowTable(el);
            tbodyEl.append(rowEl);
        });

        tableEl.append(theadEl, tbodyEl);
    }   
}

renderStatistics(dataStatistics);

function createTd(value, type = 'td'){
    const tdEl = document.createElement(type);
    tdEl.textContent = value;
    return tdEl;
}

function addRowTable(el) {
    const rowEl = document.createElement('tr');
        const idEl = createTd(el.id);
        const timeEl = createTd(el.time);
        const date = new Date(el.date);
        const formattedDate = date.toLocaleDateString('ru-RU');
        const dateEl = createTd(formattedDate);  
        const result = `${el.answersArr.reduce((count, {isValid}) => isValid ? ++count: count, 0)} / ${el.answersArr.length}`;
        const resultEl = createTd(result);
        const directionEl = createTd(el.direction.toUpperCase());
        rowEl.append(idEl, timeEl, dateEl, resultEl, directionEl);
    return rowEl;
}

function showElementTableStatistics(el){
    const rowEl = addRowTable(el);
    const tbodyEl = document.querySelector('[data-table="statistics"]').querySelector('tbody');
    // console.log(tbodyEl)
    tbodyEl.prepend(rowEl);
}

const deleteBtn = document.querySelector('[data-statistics="delete"]');
deleteBtn.addEventListener('click', () => {
    dataStatistics = [];
    localStorage.setItem('statisticsTest', JSON.stringify(dataStatistics));
    renderStatistics(dataStatistics);
})

export {renderStatistics, showElementTableStatistics, dataStatistics as statistics};