'use strict';

init();

function init() {
    updatePanel();
    document.getElementById('refresh').addEventListener('click', getUpdate);
    document.getElementById('setting').addEventListener('click', openSetting);
}

function handleResponse(message) {
    switch (message.response) {
        case 'success':
            document.getElementById('feedback-message').children[0].innerHTML = '更新成功';
            document.getElementById('feedback-message').children[0].className = 'success';
            setTimeout(() => {
                document.getElementById('feedback-message').children[0].innerHTML = '';
                document.getElementById('feedback-message').children[0].className = 'normal';
            }, 3500);
            updatePanel();
            break;
        case 'fail': {
            let weatherInfo = browser.extension.getBackgroundPage().weatherInfo;
            document.getElementById('feedback-message').children[0].innerHTML = weatherInfo.errorMessage + '，请重试';
            document.getElementById('feedback-message').children[0].className = 'fail';
            updatePanel();
            break;
        }
    }
}

function updatePanel() {
    let weatherInfo = browser.extension.getBackgroundPage().weatherInfo,
        domParser = new DOMParser(),
        xmlDoc = domParser.parseFromString(weatherInfo.htmlCode, 'text/html'),
        mainPanel = document.getElementById('weather-info');
    while (mainPanel.hasChildNodes()) {
        mainPanel.removeChild(mainPanel.firstChild);
    }
    if (!weatherInfo.errorMessage && weatherInfo.htmlCode !== '') {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('refresh').removeAttribute('class');
        document.getElementById('setting').removeAttribute('class');
        mainPanel.appendChild(xmlDoc.querySelector('div.result-op.c-container'));
        document.body.style.backgroundColor = weatherInfo.arrowColor;
        // document.getElementById('weather-info-city').children[0].innerHTML = weatherInfo.htmlCode.match(/fk="\d+_([^"]*?)天气"/)[1];
    } else {
        document.getElementById('error-message').style.display = '';
        // document.getElementById('weather-info-city').children[0].innerHTML = '';
        document.getElementById('refresh').setAttribute('class', 'error');
        document.getElementById('setting').setAttribute('class', 'error');
    }
}

function getUpdate() {
    document.getElementById('feedback-message').children[0].innerHTML = '更新中…';
    document.getElementById('feedback-message').children[0].className = 'updating';
    browser.runtime.sendMessage({ action: 'update' }).then(handleResponse, onError);
}

function openSetting() {
    browser.runtime.openOptionsPage();
    window.close();
}

function onError(error) {
    console.log(`Error: ${error}`);
}
