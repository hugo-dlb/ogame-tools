// config
let mConfig = {};

// functions
function loadValuesFromForm() {
    mConfig['server'] = document.getElementById('server').value;
    mConfig['universe_id'] = Number.parseInt(document.getElementById('universe_id').value);
    mConfig['username'] = document.getElementById('username').value;
}

function resetForm() {
    mConfig = {};
    document.getElementById('server').value = 'fr.ogame.gameforge.com';
    document.getElementById('universe_id').value = '';
    document.getElementById('username').value = '';
}

function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

function toggleSearchLoading(bLoading) {
    const oSearchButton = document.getElementById('search-button');
    const oSearchLoadingButton = document.getElementById('search-loading-button');

    if (bLoading) {
        oSearchButton.style.display = 'none';
        oSearchLoadingButton.style.display = 'inline';
    } else {
        oSearchButton.style.display = 'inline';
        oSearchLoadingButton.style.display = 'none';
    }
}

function timestampConverter(timestamp) {
	return new Date(timestamp * 1000).toLocaleString();
}

function main() {
    loadValuesFromForm();
    clearOutput();
    toggleSearchLoading(true);

    let iPlayerId;
    let aPlayerPlanets = [];
    let aPlayerMoons = [];

    // first call to find player id
    window.fetch(`https://cors-anywhere.herokuapp.com/https://s${mConfig['universe_id']}-${mConfig['server']}/api/players.xml`)
        .then(oResponse => oResponse.text())
        .then(sRes => (new window.DOMParser()).parseFromString(sRes, 'text/xml'))
        .then(oData => {
            const aPlayers = oData.getElementsByTagName('player');
            for (let i = 0; i < aPlayers.length; i++) {
                const oNode = aPlayers[i];
                if (oNode.attributes.name.value.toLowerCase() === mConfig['username'].toLowerCase()) {
                    iPlayerId = oNode.attributes.id.value;

                    // second call to find player planets
                    window.fetch(`https://cors-anywhere.herokuapp.com/https://s${mConfig['universe_id']}-${mConfig['server']}/api/playerData.xml?id=${iPlayerId}`)
                        .then(oResponse => oResponse.text())
                        .then(sRes => (new window.DOMParser()).parseFromString(sRes, 'text/xml'))
                        .then(oData => {
                            const aPlanets = oData.getElementsByTagName('planet');
                            for (let i = 0; i < aPlanets.length; i++) {
                                const oNode = aPlanets[i];
                                aPlayerPlanets.push(oNode.attributes.coords.value);
                                const oMoon = oNode.getElementsByTagName('moon');
                                aPlayerMoons[i] = '';
                                if (oMoon.length == 1) {
                                    aPlayerMoons[i] = '(L)';
                                }
                            }
							
                            // displaying results
                            for (let i = 0; i < aPlayerPlanets.length; i++) {
                                document.getElementById('output').innerHTML += aPlayerPlanets[i] + ' ' + aPlayerMoons[i] + '<br/>';
                            }
							
							// displaying last update							
							const oPlayerData = oData.getElementById(iPlayerId);
							document.getElementById('output').innerHTML += '<br/>Date de mise à jour : ' + timestampConverter(oPlayerData.attributes.timestamp.value) + '.<br/>';
							document.getElementById('output').innerHTML += '<span class="font-weight-light">La cartographie est mise à jour une fois par semaine.</span>';

                            toggleSearchLoading(false);
                        })
                        .catch(() => {
                            toggleSearchLoading(false);
                            alert('Une erreur technique est survenue.');
                        });

                    break;
                }
            }

            if (!iPlayerId) {
                toggleSearchLoading(false);
                alert('Impossible de trouver le joueur ' + mConfig['username'] + '.');
                return false;
            }
        })
        .catch(() => {
            toggleSearchLoading(false);
            alert('Impossible de trouver l\'univers.');
        });

    return false;
}
