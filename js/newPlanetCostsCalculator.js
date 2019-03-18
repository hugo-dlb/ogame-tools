document.getElementById('file-input').addEventListener('change', loadConfig, false);

// config
let mConfig = {};
const aSavedOutputs = [];

// functions
function loadValuesFromForm() {
    mConfig['universe_speed'] = document.getElementById('universe_speed').value;
    mConfig['planet_average_temperature'] = document.getElementById('planet_average_temperature').value;
    mConfig['energy_per_satellite'] = document.getElementById('energy_per_satellite').value;

    mConfig['metal_mine_level'] = document.getElementById('metal_mine_level').value;
    mConfig['cristal_mine_level'] = document.getElementById('cristal_mine_level').value;
    mConfig['deut_synth_level'] = document.getElementById('deut_synth_level').value;
    mConfig['solar_plant_level'] = document.getElementById('solar_plant_level').value;
    mConfig['fusion_reactor_level'] = document.getElementById('fusion_reactor_level').value;
    mConfig['energy_technology_level'] = document.getElementById('energy_technology_level').value;
    mConfig['satellites_number'] = document.getElementById('satellites_number').value;
}

function loadConfig(evt) {
    const aFiles = evt.target.files;
    const oFile = aFiles[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const oLocalConfig = JSON.parse(event.target.result);
        mConfig = oLocalConfig;

        document.getElementById('universe_speed').value = mConfig['universe_speed'];
        document.getElementById('planet_average_temperature').value = mConfig['planet_average_temperature'];
        document.getElementById('energy_per_satellite').value = mConfig['energy_per_satellite'];

        document.getElementById('metal_mine_level').value = mConfig['metal_mine_level'];
        document.getElementById('cristal_mine_level').value = mConfig['cristal_mine_level'];
        document.getElementById('deut_synth_level').value = mConfig['deut_synth_level'];
        document.getElementById('solar_plant_level').value = mConfig['solar_plant_level'];
        document.getElementById('fusion_reactor_level').value = mConfig['fusion_reactor_level'];
        document.getElementById('energy_technology_level').value = mConfig['energy_technology_level'];
        document.getElementById('satellites_number').value = mConfig['satellites_number'];
    };

    reader.readAsText(oFile)
}

function saveJSON(text, filename) {
    const oLink = document.createElement('a');
    oLink.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
    oLink.setAttribute('download', filename);
    oLink.click();
}

function saveConfig() {
    saveJSON(JSON.stringify(mConfig), 'config.json');
}

function saveOutput() {
    const innerHtml = document.getElementById('output').innerHTML;

    if (!innerHtml) {
        alert('Impossible d\'enregistrer un résultat vide.');
        return;
    }

    const name = prompt("Veuillez entrer un nom pour le résultat sauvegardé");

    if (name == null) {
        return;
    }

    aSavedOutputs.push({
        id: uuid(),
        name: name,
        content: innerHtml
    });

    updateSavedOutputs();
}

function loadOutput(evt) {
    const uuid = evt.target.getAttribute('data-uuid');
    let content;

    for (let i = 0; i < aSavedOutputs.length; i++) {
        if (uuid === aSavedOutputs[i].id) {
            content = aSavedOutputs[i].content;
            break;
        }
    }

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = content;
}

function updateSavedOutputs() {
    const outputDiv = document.getElementById('saved-outputs');
    let string = '';

    for (let i = 0; i < aSavedOutputs.length; i++) {
        string += "<div type='button' class='list-group-item list-group-item-action' data-uuid=" + aSavedOutputs[i].id + ">" + aSavedOutputs[i].name + "</div>";
    }

    outputDiv.innerHTML = string;

    const outputDivs = document.getElementsByClassName('list-group-item');

    // for each <li> inside #links
    for (let i = 0; i < outputDivs.length; i++) {
        const div = outputDivs[i];
        div.onclick = loadOutput;
    }
}

function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

function main() {
    loadValuesFromForm();
    clearOutput();

    // main logic
    const metal_energy_required = mine_energy_cost('m', mConfig['metal_mine_level']);
    const cristal_energy_required = mine_energy_cost('c', mConfig['cristal_mine_level']);
    const deut_energy_required = mine_energy_cost('d', mConfig['deut_synth_level']);
    const total_energy_required =	metal_energy_required + cristal_energy_required + deut_energy_required;

    const satellites_available_energy = mConfig['satellites_number'] * mConfig['energy_per_satellite'];
    const solar_plant_available_energy = solar_plant_energy(mConfig['solar_plant_level']);
    const fusion_reactor_available_energy = fusion_reactor_energy(mConfig['fusion_reactor_level'], mConfig['energy_technology_level']);
    const available_energy = satellites_available_energy + solar_plant_available_energy + fusion_reactor_available_energy;

    const metal_mine_cost = level_range_cost('m', 1, mConfig['metal_mine_level']);
    const cristal_mine_cost = level_range_cost('c', 1, mConfig['cristal_mine_level']);
    const deut_synth_cost = level_range_cost('d', 1, mConfig['deut_synth_level']);
    const solar_plant_cost = level_range_cost('e', 1, mConfig['solar_plant_level']);
    const fusion_reactor_cost = level_range_cost('f', 1, mConfig['fusion_reactor_level']);
    const energy_tech_cost = level_range_cost('et', 1, mConfig['energy_technology_level']);
    const satellites_cost = satellites_resources_cost(mConfig['satellites_number']);

    let total_cost = array_addition(metal_mine_cost, cristal_mine_cost);
    total_cost = array_addition(total_cost, deut_synth_cost);
    total_cost = array_addition(total_cost, solar_plant_cost);
    total_cost = array_addition(total_cost, fusion_reactor_cost);
    total_cost = array_addition(total_cost, energy_tech_cost);
    total_cost = array_addition(total_cost, satellites_cost);

    // displaying results
    document.getElementById('output').innerHTML += 'Energie :' + '<br>';
    const energy_status = available_energy - total_energy_required;
    document.getElementById('output').innerHTML += energy_status.toLocaleString() + '<br><br>';

    document.getElementById('output').innerHTML += 'Total des ressources nécéssaires pour tous les batîments, recherches et satellites (M, C, D) :' + '<br>';
    for (let i = 0; i < total_cost.length; i++) {
        document.getElementById('output').innerHTML += total_cost[i].toLocaleString() + '<br>';
    }
    document.getElementById('output').innerHTML += '<br>';

    document.getElementById('output').innerHTML += 'Total des ressources nécéssaires pour tous les batîments, recherches et satellites (M, Taux 2/1.5/1) :' + '<br>';
    const rounded_cost = total_cost[0] + total_cost[1]*1.33 + total_cost[2]*2;
    document.getElementById('output').innerHTML += rounded_cost.toLocaleString() + '<br><br>';

    document.getElementById('output').innerHTML += 'Production par heure (M, C, D):' + '<br>';
    document.getElementById('output').innerHTML += production('m', mConfig['metal_mine_level'], mConfig['planet_average_temperature'], mConfig['universe_speed']).toLocaleString() + '<br>';
    document.getElementById('output').innerHTML += production('c', mConfig['cristal_mine_level'], mConfig['planet_average_temperature'], mConfig['universe_speed']).toLocaleString() + '<br>';
    document.getElementById('output').innerHTML += (production('d', mConfig['deut_synth_level'], mConfig['planet_average_temperature'], mConfig['universe_speed']) - fusion_reactor_deuterium_cost(mConfig['fusion_reactor_level'])).toLocaleString() + '<br>';

    return false;
}
