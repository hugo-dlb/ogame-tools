// config
let mConfig = {};

// functions
function loadValuesFromForm() {
    mConfig['hyperespace_research_level'] = document.getElementById('hyperespace_research_level').value;
    mConfig['recycler_number'] = document.getElementById('recycler_number').value;
    mConfig['small_cargo_number'] = document.getElementById('small_cargo_number').value;
    mConfig['large_cargo_number'] = document.getElementById('large_cargo_number').value;
    mConfig['hyperespace_research_cargo_boost_percentage'] = document.getElementById('hyperespace_research_cargo_boost_percentage').value;

    for (let key in mConfig) {
        mConfig[key] = Number.parseInt(mConfig[key]);
    }
}

function resetForm() {
    mConfig = {};
    document.getElementById('hyperespace_research_level').value = 1;
    document.getElementById('recycler_number').value = 0;
    document.getElementById('small_cargo_number').value = 0;
    document.getElementById('large_cargo_number').value = 0;
    document.getElementById('hyperespace_research_cargo_boost_percentage').value = 2;
}

function clearOutput() {
    document.getElementById('output').innerHTML = '';
}

function main() {
    loadValuesFromForm();
    clearOutput();

    // main logic
    const current_hyperespace_level_cost = next_level_cost('h', mConfig['hyperespace_research_level'] - 1);
    const current_recycler_cargo = mConfig['recycler_number'] * 20000 * (1 + (mConfig['hyperespace_research_level'] * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);
    const current_small_cargo_cargo = mConfig['small_cargo_number'] * 5000 * (1 + (mConfig['hyperespace_research_level'] * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);
    const current_large_cargo_cargo = mConfig['large_cargo_number'] * 25000 * (1 + (mConfig['hyperespace_research_level'] * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);

    const next_hyperespace_level_cost = next_level_cost('h', mConfig['hyperespace_research_level']);
    const next_recycler_cargo = mConfig['recycler_number'] * 20000 * (1 + ((mConfig['hyperespace_research_level'] + 1) * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);
    const next_small_cargo_cargo = mConfig['small_cargo_number'] * 5000 * (1 + ((mConfig['hyperespace_research_level'] + 1) * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);
    const next_large_cargo_cargo = mConfig['large_cargo_number'] * 25000 * (1 + ((mConfig['hyperespace_research_level'] + 1) * mConfig['hyperespace_research_cargo_boost_percentage']) / 100);

    // displaying results
    document.getElementById('output').innerHTML += 'Niveau d\'Hyperespace actuel : ' + mConfig['hyperespace_research_level'] + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de recycleur actuel : ' + format_number(current_recycler_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de petit transporteur actuel : ' + format_number(current_small_cargo_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de grand transporteur actuel : ' + format_number(current_large_cargo_cargo) + '<br>';

    document.getElementById('output').innerHTML += '<br>';

    document.getElementById('output').innerHTML += 'Niveau d\'Hyperespace souhaité : ' + (mConfig['hyperespace_research_level'] + 1) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de recycleur obtenu : ' + format_number(next_recycler_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de petit transporteur obtenu : ' + format_number(next_small_cargo_cargo) + '<br>';
    document.getElementById('output').innerHTML += 'Cargo de grand transporteur obtenu : ' + format_number(next_large_cargo_cargo) + '<br>';

    document.getElementById('output').innerHTML += '<br>';

    document.getElementById('output').innerHTML += 'Coût de Hyperespace ' + (mConfig['hyperespace_research_level'] + 1) + ' : ' + format_resources_cost(next_hyperespace_level_cost);

    return false;
}
