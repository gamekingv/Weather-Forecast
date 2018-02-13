'use strict';

init();

function init() {
    document.addEventListener('DOMContentLoaded', restoreOptions);
    var options = document.querySelectorAll('input[id]');
    for (var option of options) {
        option.addEventListener('change', saveOptions);
    }
}

function saveOptions(e) {
    var options = {};
    options[e.target.id] = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.id == 'interval') {
        if (!parseInt(options[e.target.id])) {
            options[e.target.id] = '';
        }
        browser.storage.local.set(options).then(null, onError);
    }
}

function restoreOptions() {
    var weatherInfo = browser.extension.getBackgroundPage().weatherInfo;
    document.querySelector('#realtime_weather').checked = weatherInfo.isShowIcon;
    document.querySelector('#realtime_temp').checked = weatherInfo.isShowTemp;
    browser.storage.local.get().then((result) => {
        for (var i in result) {
            var input = document.querySelector("#" + i);
            if (input) {
                if (input.type == 'checkbox')
                    input.checked = result[i];
                else
                    input.value = result[i];
            }
        }
    }, onError);
}

function onError(error) {
    console.log(`Error: ${error}`);
}
