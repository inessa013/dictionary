/* -------------------------- Смена темы (light/dark) -------------------------------------- */

const them = localStorage.getItem('them');
// console.log(them);

const btnToggleThemeEl = document.querySelector('[data-btn="theme-toggle"]');
const dashboardEl = document.querySelector('[data-dashboard]');

const isLightThem = dashboardEl.classList.contains('light-them');

if(!them) {
    localStorage.setItem('them', isLightThem ? 'light' : 'dark');
} else {
    if(them == 'light')
        dashboardEl.classList.add('light-theme');
    else
        dashboardEl.classList.remove('light-theme');
}

btnToggleThemeEl.addEventListener('click', () => {
    if(dashboardEl.classList.toggle('light-theme')){
        localStorage.setItem('them', 'light');
    } else {
        localStorage.setItem('them', 'dark');
    }  
})