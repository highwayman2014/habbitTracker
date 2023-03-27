'use strict';

let habbits = [];
const HABBITS_KEY = 'HABBITS_KEY';

// page

const page = {
    menu: document.querySelector('.menu-buttons')
}

// utils

function loadData() {
    const habbitsString = localStorage.getItem(HABBITS_KEY);
    const habbitsArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitsArray)) {
        habbits = habbitsArray;
    }
}

function saveData() {
    localStorage.setItem(HABBITS_KEY, JSON.stringify(habbits));
}

// render

function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    };

    for (const habbit of habbits) {
        const currentItem = document.querySelector(`[menu-item-id = ${habbit.id}]`);
        if (!currentItem) {
            const newItem = document.createElement('li');
            newItem.setAttribute('menu-item-id', habbit.id);
            const button = document.createElement('button');
            button.classList.add('icon');
            button.classList.add('normal-habbit-button');
            button.addEventListener('click', () => rerender(habbit.id));
            button.innerHTML = `<img src="img/${habbit.icon}.svg" alt="${habbit.name}">`;

            newItem.appendChild(button);
            page.menu.appendChild(newItem);

            if (activeHabbit.id === habbit.id) {
                button.firstChild.classList.add('icon-active');
            }
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            currentItem.firstChild.classList.add('icon-active');
        } else {
            currentItem.firstChild.classList.remove('icon-active');
        }
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (activeHabbit) {
        rerenderMenu(activeHabbit);
    }
}

// init

(() => {
    loadData();
    rerender(0);
})();