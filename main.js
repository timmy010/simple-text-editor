'use strict';
document.addEventListener('DOMContentLoaded', function() {
    const textEditorElem = document.querySelector('.js-text-editor');
    const btnEditElem = document.querySelector('.js-edit');
    const btnSaveElem = document.querySelector('.js-save');
    const btnLoadElem = document.querySelector('.js-load');
    const btnCancelElem = document.querySelector('.js-cancel');
    const btnClearTextElem = document.querySelector('.js-clear-text');
    const btnClearMemoryElem = document.querySelector('.js-clear-memory');
    const dropdownMenuElem = document.querySelector('.js-dropdown-menu');
    const dateText = document.querySelector('.js-date-text');
    let saveTexts;
    
    let dropdownItemCount = 0;

    if (document.querySelectorAll('.js-dropdown-item')) {
        dropdownMenuElem.addEventListener('click', function(e) {
            let returnTexts = getTextFromJSON();
            showDate(returnTexts[e.target.id - 1]);
            let text = returnTexts[e.target.id - 1].text;
            textEditorElem.innerHTML = text;
        });
    }

    localStorage.setItem('originalText', textEditorElem.innerHTML);

    function getTextFromJSON() {
        let returnTexts = localStorage.getItem('text');
        
        returnTexts = JSON.parse(returnTexts, function(key, value) {
            if (key == 'date') return new Date(value);
            return value;
        });

        return returnTexts;
    }

    function showDate(returnTexts) {
        let date = returnTexts.date;
        let formatter = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        });
    
        dateText.classList.remove('d-none');
        dateText.innerHTML = `Дата создания: ${formatter.format(date)}`;
    }

    function hideDate() {
        dateText.classList.add('d-none');
    }

    function autoload() {
        if (!localStorage.getItem('text')) {
            btnLoadElem.setAttribute('disabled', '');
            return;
        } else {
            returnText();
            btnLoadElem.removeAttribute('disabled');
        }
    }

    autoload();

    function addDropdownItem() {
        dropdownItemCount = ++dropdownItemCount;
        dropdownMenuElem.insertAdjacentHTML('beforeend', `
                    <button class="btn dropdown-item js-dropdown-item" id="${dropdownItemCount}">Text ${dropdownItemCount}</button>
                `);
    }

    if (localStorage.getItem('text')) {
        saveTexts = getTextFromJSON();
    } else {
        saveTexts = [];
    }

    function save() {
        saveTexts.push({
            "text" : textEditorElem.innerHTML,
            "dropdownItemCount" : dropdownItemCount,
            "date" : new Date(),
        });
        localStorage.setItem('text', JSON.stringify(saveTexts));
        btnLoadElem.removeAttribute('disabled');
        showDate(saveTexts);
        addDropdownItem();
    }

    function returnText() {
        clearDropdownMenu();

        if (!localStorage.getItem('text')) {
            textEditorElem.innerHTML = localStorage.getItem('originalText');
        }
        let returnTexts = getTextFromJSON();
        showDate(returnTexts[returnTexts.length - 1]);
        textEditorElem.innerHTML = returnTexts[returnTexts.length - 1].text;

        for (let i = 0; i <= returnTexts[returnTexts.length - 1].dropdownItemCount; i++) {
            addDropdownItem();
        }
    }

    function clearDropdownMenu() {
        dropdownItemCount = 0;
        while (dropdownMenuElem.firstChild) {
            dropdownMenuElem.removeChild(dropdownMenuElem.firstChild);
        }
    }

    function setEditOn() {
        textEditorElem.setAttribute('contenteditable', 'true');

        btnEditElem.setAttribute('disabled', '');
        btnSaveElem.removeAttribute('disabled');
        btnCancelElem.removeAttribute('disabled');
    }

    function setEditOff() {
        textEditorElem.setAttribute('contenteditable', 'false');

        btnEditElem.removeAttribute('disabled');
        btnSaveElem.setAttribute('disabled', '');
        btnCancelElem.setAttribute('disabled', '');
    }

    btnEditElem.addEventListener('click', function() {
        setEditOn();  
    });

    btnSaveElem.addEventListener('click', function() {
        save();
        setEditOff();
    });

    btnCancelElem.addEventListener('click', function(){
        returnText();
        setEditOff();
    });

    btnClearMemoryElem.addEventListener('click', function() {
        delete localStorage.text;
        delete localStorage.dropdown;
        textEditorElem.innerHTML = localStorage.getItem('originalText');
        autoload();
        hideDate();
        
        clearDropdownMenu();
    });

    btnClearTextElem.addEventListener('click', function() {
        textEditorElem.innerHTML = '';
        hideDate();
    });
});