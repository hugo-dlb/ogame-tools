let iCurrentStep = 1;
let aMoons = [];
let oResponse;
let oData;
let iPlayerId;
let server;
let aCoveredCoords = [];

function switchToNextStep() {
    const oFirstStepContainer = document.getElementById('first-step-container');
    const oSecondStepContainer = document.getElementById('second-step-container');
    const oThirdStepContainer = document.getElementById('third-step-container');

    const oFirstStepButton = document.getElementById('first-step-button');
    const oSecondStepButton = document.getElementById('second-step-button');
    const oThirdStepButton = document.getElementById('third-step-button');

    switch (iCurrentStep) {
        case 1:
            oSecondStepButton.classList.remove('disabled-step');
            oFirstStepButton.classList.remove('current');
            oSecondStepButton.classList.add('current');
            oFirstStepContainer.style.display = 'none';
            oSecondStepContainer.style.display = 'block';
            iCurrentStep = 2;
            break;
        case 2:
            oSecondStepButton.classList.remove('current');
            oThirdStepButton.classList.remove('disabled-step');
            oThirdStepButton.classList.add('current');
            oSecondStepContainer.style.display = 'none';
            oThirdStepContainer.style.display = 'block';
            iCurrentStep = 3;
            break;
        case 3:
            oSecondStepButton.classList.add('disabled-step');
            oThirdStepButton.classList.add('disabled-step');
            oThirdStepButton.classList.remove('current');
            oFirstStepButton.classList.add('current');
            oThirdStepContainer.style.display = 'none';
            oFirstStepContainer.style.display = 'block';
            iCurrentStep = 1;
            break;
    }
}

function toggleSearchLoading(bLoading) {
    const aSearchButtons = document.getElementsByClassName('search-button');
    const aSearchLoadingButtons = document.getElementsByClassName('search-loading-button');

    if (bLoading) {
        for (let i = 0; i < aSearchButtons.length; i++) {
            aSearchButtons[i].style.display = 'none';
            aSearchLoadingButtons[i].style.display = 'inline';
        }
    } else {
        for (let i = 0; i < aSearchButtons.length; i++) {
            aSearchButtons[i].style.display = 'inline';
            aSearchLoadingButtons[i].style.display = 'none';
        }
    }
}

function renderThirdStep() {
    const oThirdStepContainer = document.getElementById('third-step-container');
    let sHtml = '';
    sHtml += `<ul class="list-group mb-20">`;

    for (let i = 0; i < server.galaxies; i++) {
        const aGalaxyCoords = aCoveredCoords.filter(element => element[0] == i + 1);
        sHtml += `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="badge badge-primary badge-pill mb-10">G${i + 1}</span>`;
                
        for (let j = 0; j < aGalaxyCoords.length; j++) {
            sHtml += `<div>${aGalaxyCoords[j]}</div>`;
        }
        
        sHtml += `</li>`;
    }

    sHtml += '</ul>';
    oThirdStepContainer.innerHTML = sHtml;
}

function submitSecondStep() {
    toggleSearchLoading(true);

    const aGalaxy = getGalaxyArray();
    const oSecondStepForm = document.getElementById('second-step-form');
    const aPhalanxInputs = oSecondStepForm.getElementsByTagName('input');

    for (let iInputIndex = 0; iInputIndex < aPhalanxInputs.length; iInputIndex++) {
        const sMoonCoords = aPhalanxInputs[iInputIndex].getAttribute('coords');
        const iPhalanxLevel = parseInt(aPhalanxInputs[iInputIndex].value);
        const iPhalanxCoverage = Math.pow(iPhalanxLevel, 2) - 1;
        const sMoonCoordsGalaxyIndex = aGalaxy.findIndex(element => element.coords === sMoonCoords);

        // apply phalanx coverage backwards
        let i = 0;
        let j = sMoonCoordsGalaxyIndex;
        while (i <= iPhalanxCoverage) {
            aGalaxy[j].covered = true;
            i++;
            j--;
            if (j === 0) {
                j = aGalaxy.length - 1;
            }
        }

        // apply phalanx coverage forward
        i = 0;
        j = sMoonCoordsGalaxyIndex;
        while (i <= iPhalanxCoverage) {
            aGalaxy[j].covered = true;
            i++;
            j++;
            if (j === server.systems) {
                j = 0;
            }
        }
    }


    for (let i = 0; i < aGalaxy.length; i++) {
        if (aGalaxy[i].covered) {
            aCoveredCoords.push(aGalaxy[i].coords);
        }
    }

    toggleSearchLoading(false);
    renderThirdStep();
    switchToNextStep();

    return false;
}

function getGalaxyArray() {
    const aGalaxy = [];
    for (let i = 1; i <= server.galaxies; i++) {
        for (let j = 1; j <= server.systems; j++) {
            aGalaxy.push({
                coords: `${i}:${j}`,
                covered: false
            });
        }
    }
    return aGalaxy;
}

async function submitFirstStep() {
    toggleSearchLoading(true);

    const iUniverseId = Number.parseInt(document.getElementById('universe_id').value);
    const sServer = document.getElementById('server').value;
    const sPlayer = document.getElementById('username').value;

    // first call to get server data
    try {
        oResponse = await window.fetch(`https://cors-anywhere.herokuapp.com/https://s${iUniverseId}-${sServer}/api/serverData.xml`);
        oResponse = await oResponse.text();
        oData = await (new window.DOMParser()).parseFromString(oResponse, 'text/xml');
    } catch (err) {
        toggleSearchLoading(false);
        alert('Impossible de trouver l\'univers.');
        return;
    }

    server = {
        galaxies: parseInt(oData.getElementsByTagName('galaxies')[0].childNodes[0].nodeValue, 10),
        systems: parseInt(oData.getElementsByTagName('systems')[0].childNodes[0].nodeValue, 10),
        donutGalaxy: oData.getElementsByTagName('donutGalaxy')[0] === 1 ? true : false
    }

    // second call to find player id
    try {
        oResponse = await window.fetch(`https://cors-anywhere.herokuapp.com/https://s${iUniverseId}-${sServer}/api/players.xml`);
        oResponse = await oResponse.text();
        oData = await (new window.DOMParser()).parseFromString(oResponse, 'text/xml');
    } catch (err) {
        toggleSearchLoading(false);
        alert('Impossible de trouver l\'univers.');
        return;
    }

    const aPlayers = oData.getElementsByTagName('player');

    for (let i = 0; i < aPlayers.length; i++) {
        const oNode = aPlayers[i];
        if (oNode.attributes.name.value.toLowerCase() === sPlayer.toLowerCase()) {
            iPlayerId = oNode.attributes.id.value;
            break;
        }
    }

    if (!iPlayerId) {
        toggleSearchLoading(false);
        alert('Impossible de trouver le joueur ' + sPlayer + '.');
        return;
    }

    // third call to find player planets
    try {
        oResponse = await window.fetch(`https://cors-anywhere.herokuapp.com/https://s${iUniverseId}-${sServer}/api/playerData.xml?id=${iPlayerId}`)
        oResponse = await oResponse.text();
        oData = await (new window.DOMParser()).parseFromString(oResponse, 'text/xml');
    } catch (err) {
        toggleSearchLoading(false);
        alert('Une erreur technique est survenue.');
        return;
    }
    
    const aPlanets = oData.getElementsByTagName('planet');
    
    for (let i = 0; i < aPlanets.length; i++) {
        const oNode = aPlanets[i];
        const oMoon = oNode.getElementsByTagName('moon');
        if (oMoon.length === 1) {
            aMoons.push({
                name: oMoon[0].attributes.name.value,
                coords: oNode.attributes.coords.value
            });
        }
    }

    toggleSearchLoading(false);

    if (aMoons.length === 0) {
        alert('Le joueur n\'a aucune lune.');
    } else {
        const oSecondStepForm = document.getElementById('second-step-form');

        for (let i = 0; i < aMoons.length; i++) {
            const sMoonCoords = aMoons[i].coords.substring(0, aMoons[i].coords.lastIndexOf(":"));
            oSecondStepForm.innerHTML += `<div class="form-group">
                <label for="moon-${i}">Niveau de phalange sur la lune ${aMoons[i].name} (${aMoons[i].coords})</label>
                <input type="number" min="0" class="form-control" coords="${sMoonCoords}" value="0" required />
            </div>`
        }

        switchToNextStep();
    }
}
