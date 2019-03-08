// config
var config = {};

// functions
function loadValuesFromForm() {
    config['hyperespace_research_level'] = document.getElementById('hyperespace_research_level').value;
    config['recycler_number'] = document.getElementById('recycler_number').value;
    config['small_cargo_number'] = document.getElementById('small_cargo_number').value;
    config['large_cargo_number'] = document.getElementById('large_cargo_number').value;
    config['hyperespace_research_cargo_boost_percentage'] = document.getElementById('hyperespace_research_cargo_boost_percentage').value;

    for (let key in config) {
        config[key] = Number.parseInt(config[key]);
    }
}

function resetForm() {
    config = {};
    document.getElementById('hyperespace_research_level').value = '';
    document.getElementById('recycler_number').value = '';
    document.getElementById('small_cargo_number').value = '';
    document.getElementById('large_cargo_number').value = '';
    document.getElementById('hyperespace_research_cargo_boost_percentage').value = 2;
}

function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

function main() {
    loadValuesFromForm();
    clearOutput();

    // main logic
    const current_hyperespace_level_cost = next_level_cost('h', config['hyperespace_research_level'] - 1);
    const current_recycler_cargo = config['recycler_number'] * 20000 * (1 + (config['hyperespace_research_level'] * config['hyperespace_research_cargo_boost_percentage']) / 100);
    const current_small_cargo_cargo = config['small_cargo_number'] * 5000 * (1 + (config['hyperespace_research_level'] * config['hyperespace_research_cargo_boost_percentage']) / 100);
    const current_large_cargo_cargo = config['large_cargo_number'] * 25000 * (1 + (config['hyperespace_research_level'] * config['hyperespace_research_cargo_boost_percentage']) / 100);

    const next_hyperespace_level_cost = next_level_cost('h', config['hyperespace_research_level']);
    const next_recycler_cargo = config['recycler_number'] * 20000 * (1 + ((config['hyperespace_research_level'] + 1) * config['hyperespace_research_cargo_boost_percentage']) / 100);
    const next_small_cargo_cargo = config['small_cargo_number'] * 5000 * (1 + ((config['hyperespace_research_level'] + 1) * config['hyperespace_research_cargo_boost_percentage']) / 100);
    const next_large_cargo_cargo = config['large_cargo_number'] * 25000 * (1 + ((config['hyperespace_research_level'] + 1) * config['hyperespace_research_cargo_boost_percentage']) / 100);

    // displaying results
    document.getElementById('output').innerHTML += 'Niveau d\'Hyperespace actuel : ' + config['hyperespace_research_level'] + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de recycleur actuel : ' + format_number(current_recycler_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de petit transporteur actuel : ' + format_number(current_small_cargo_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de grand transporteur actuel : ' + format_number(current_large_cargo_cargo) + '<br>';

    document.getElementById('output').innerHTML += '<br>';

    document.getElementById('output').innerHTML += 'Niveau d\'Hyperespace souhaité : ' + (config['hyperespace_research_level'] + 1) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de recycleur obtenu : ' + format_number(next_recycler_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de petit transporteur obtenu : ' + format_number(next_small_cargo_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de grand transporteur obtenu : ' + format_number(next_large_cargo_cargo) + '<br>';

    document.getElementById('output').innerHTML += '<br>';

    document.getElementById('output').innerHTML += 'Coût de Hyperespace ' + config['hyperespace_research_level'] + ' : ' + format_resources_cost(next_hyperespace_level_cost);

    return false;
}
