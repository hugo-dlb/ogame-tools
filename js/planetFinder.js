// config
var config = {};

// functions
function loadValuesFromForm() {
    config['server'] = document.getElementById('server').value;
    config['universe_id'] = Number.parseInt(document.getElementById('universe_id').value);
    config['username'] = document.getElementById('username').value;
}

function resetForm() {
    config = {};
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
	return new Date(timestamp * 1000);
}

function main() {
    loadValuesFromForm();
    clearOutput();
    toggleSearchLoading(true);

    let playerId;
    let playerPlanets = [];
    let playerMoons = [];

    // main logic

    // first call to find player id
    window.fetch(`https://cors-anywhere.herokuapp.com/https://s${config['universe_id']}-${config['server']}/api/players.xml`)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const players = data.getElementsByTagName("player");
            for (let i = 0; i < players.length; i++) {
                const node = players[i];
                if (node.attributes.name.value.toLowerCase() === config['username'].toLowerCase()) {
                    playerId = node.attributes.id.value;

                    // second call to find player planets
                    window.fetch(`https://cors-anywhere.herokuapp.com/https://s${config['universe_id']}-${config['server']}/api/playerData.xml?id=${playerId}`)
                        .then(response => response.text())
                        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
                        .then(data => {
                            const planets = data.getElementsByTagName("planet");
                            for (let i = 0; i < planets.length; i++) {
                                const node = planets[i];
                                playerPlanets.push(node.attributes.coords.value);
                                const moon = node.getElementsByTagName("moon");
                                playerMoons[i] = "";
                                if (moon.length == 1) {
                                    playerMoons[i] = "(L)";
                                }
                            }
							
                            // displaying results
                            for (let i = 0; i < playerPlanets.length; i++) {
                                document.getElementById('output').innerHTML += playerPlanets[i] + ' ' + playerMoons[i] + '<br/>';
                            }
							
							// displaying last update							
							const playerData = data.getElementById(playerId);
							document.getElementById('output').innerHTML += '<br/> Date de mise à jour : ' + timestampConverter(playerData.attributes.timestamp.value);

                            toggleSearchLoading(false);
                        })
                        .catch(err => {
                            toggleSearchLoading(false);
                            alert("Une erreur technique est survenue.");
                        });

                    break;
                }
            }

            if (!playerId) {
                toggleSearchLoading(false);
                alert("Impossible de trouver le joueur " + config['username'] + ".");
                return false;
            }
        })
        .catch(err => {
            toggleSearchLoading(false);
            alert("Impossible de trouver l'univers.");
        });

    return false;
}
