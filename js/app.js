'use strict';

let habbits = [];
let globalActiveHabbitId;
const HABBITS_KEY = 'HABBITS_KEY';

// page

const page = {
    menu: document.querySelector('.menu-buttons'),
    habbitHeader: {
        heading: document.querySelector('.habbit-heading'),
        progressText: document.querySelector('.progress-value'),
        progressBar: document.querySelector('.progress-bar')
    },
    content: {
        days: document.querySelector('.habbit-days'),
        nextDay: document.querySelector('.habbit-day-number')
    },
    popup: {
        cover: document.getElementById('add-popup'),
        iconField: document.getElementById('icon-field')
    }
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

function togglePopup() {
    const cover = page.popup.cover;
    if (cover.classList.contains('cover-hidden')) {
        cover.classList.remove('cover-hidden');
    } else {
        cover.classList.add('cover-hidden');
    };
}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = '';
    }
}

function validateForm(form, fields) {
    const res = {};
    const data = new FormData(form);
    for (const field of fields) {
        const fieldValue = data.get(field);
        form[field].classList.remove('input-warning');
        if (!fieldValue) {
            form[field].classList.add('input-warning');
        }
        res[field] = fieldValue;
    }

    for (const field of fields) {
        if (!res[field]) {
            return;
        }
    }
    return res;
}

// render

function rerenderMenu(activeHabbit) {

    for (const habbit of habbits) {
        const currentItem = document.querySelector(`[menu-item-id = "${habbit.id}"]`);
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
                newItem.firstChild.classList.add('icon-active');
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

function rerenderHabbitHeader(activeHabbit) {

    page.habbitHeader.heading.innerText = activeHabbit.name;

    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;

    page.habbitHeader.progressText.innerText = `${progress.toFixed(0)}%`;
    page.habbitHeader.progressBar.setAttribute('value', progress);
}

function rerenderHabbitBody(activeHabbit) {
    page.content.days.innerHTML = '';
    for (const index in activeHabbit.days) {
        const dayElement = document.createElement('li');
        dayElement.classList.add('habbit-day');

        dayElement.innerHTML =
            `<p class="habbit-day-number">День ${Number(index) + 1}</p>
            <div class="habbit-day-control">
                <p class="habbit-day-view">${activeHabbit.days[index].comment}</p>
                <button class="habbit-day-button delete-button" onClick="removeDay(event, ${Number(index)})">
                    <img src="img/trash.svg" alt="Удалить день ${Number(index) + 1}">
                </button>
            </div>`;

        page.content.days.appendChild(dayElement);
    }
    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (activeHabbit) {
        globalActiveHabbitId = activeHabbitId;
        rerenderMenu(activeHabbit);
        rerenderHabbitHeader(activeHabbit);
        rerenderHabbitBody(activeHabbit);
    }
}

// work with days

function addDay(event) {
    event.preventDefault();
    const validateResult = validateForm(event.target, ['comment']);
    if (!validateResult) {
        return;
    }
    resetForm(event.target, ['comment']);

    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment: validateResult.comment }])
            }
        };
        return habbit;
    });

    rerender(globalActiveHabbitId);
    saveData();
}

function removeDay(event, dayIndex) {
    event.preventDefault();
    habbits.forEach(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(dayIndex, 1);
        }
    });
    rerender(globalActiveHabbitId);
    saveData();
}

// work with habbits

function selectIcon(context, icon) {
    page.popup.iconField.value = icon;
    document
        .querySelector('.icons-list>.icon-active')
        .classList
        .remove('icon-active');

    context.classList.add('icon-active');
}

function addHabbit(event) {
    event.preventDefault();
    const validateResult = validateForm(event.target, ['name', 'icon', 'target']);
    if (!validateResult) {
        return;
    }

    let id = habbits.reduce((acc, habbit) => {
        return habbit.id > acc ? habbit.id : acc
    }, 0);

    habbits.push({
        id: ++id,
        name: validateResult.name,
        icon: validateResult.icon,
        target: Number(validateResult.target),
        days: []
    });
    resetForm(event.target, ['name', 'target']);
    togglePopup();
    saveData();
    rerender(id);
}

// init

(() => {
    loadData();
    rerender(1);
})();