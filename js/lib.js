function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function saveJSON(text, filename) {
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}

function loadConfig(evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        var localConfig = JSON.parse(event.target.result);
        config = localConfig;

        document.getElementById('universe_speed').value = config['universe_speed'];
        document.getElementById('planet_average_temperature').value = config['planet_average_temperature'];
        document.getElementById('energy_per_satellite').value = config['energy_per_satellite'];

        document.getElementById('metal_mine_level').value = config['metal_mine_level'];
        document.getElementById('cristal_mine_level').value = config['cristal_mine_level'];
        document.getElementById('deut_synth_level').value = config['deut_synth_level'];
        document.getElementById('solar_plant_level').value = config['solar_plant_level'];
        document.getElementById('fusion_reactor_level').value = config['fusion_reactor_level'];
        document.getElementById('energy_technology_level').value = config['energy_technology_level'];
        document.getElementById('satellites_number').value = config['satellites_number'];
    };

    reader.readAsText(file)
}

function saveConfig() {
    saveJSON(JSON.stringify(config), 'config.json');
}

function next_level_cost(code, level) {
    if (code === 'm') {
        return [Math.round((60 * Math.pow(1.5, level))), Math.round((15 * Math.pow(1.5, level))), 0];
    } else if (code === 'c') {
        return [Math.round(48 * (Math.pow(1.6, level))), Math.round(24 * (Math.pow(1.6, level))), 0];
    } else if (code === 'd') {
        return [Math.round(225 * Math.pow(1.5, level)), Math.round(75 * Math.pow(1.5, level)), 0];
    } else if (code === 'e') {
        return [Math.round(75 * Math.pow(1.5, level - 1)), Math.round(30 * Math.pow(1.5, level - 1)), 0];
    } else if (code === 'f') {
        return [900 * Math.pow(1.8, level - 1), 360 * Math.pow(1.8, level - 1), 180 * Math.pow(1.8, level - 1)];
    } else if (code === 'et') {
        return [0, 800 * Math.pow(2, level - 1), 400 * Math.pow(2, level - 1)];
    } else if (code === 'h') {
        return [0, 4000 * Math.pow(2, level), 2000 * Math.pow(2, level)];
    }
}

function level_range_cost(code, levelFrom, levelTo) {
    var a = 0, b = 0, c = 0;

    for (var i = levelFrom; i < levelTo; i++) {
        var res = next_level_cost(code, i);
        a += res[0];
        b += res[1];
        c += res[2];
    }

    return [a, b, c];
}

function mine_energy_cost(mine, level) {
    if (mine === 'm') {
        return 10 * level * Math.pow(1.1, level);
    } else if (mine === 'c') {
        return 10 * level * Math.pow(1.1, level);
    } else if (mine === 'd') {
        return 20 * level * Math.pow(1.1, level);
    }
}

function satellites_resources_cost(n) {
    return [0, n * 2000, n * 500];
}

function solar_plant_energy(level) {
    return 20 * level * Math.pow(1.1, level);
}

function production(mine, level, temperature, speed) {
    if (mine === 'm') {
        return Math.round(30 * level * Math.pow(1.1, parseInt(level) + 1) * speed);
    } else if (mine === 'c') {
        return Math.round(20 * level * Math.pow(1.1, parseInt(level)) * speed);
    } else if (mine === 'd') {
        return Math.round(((10 * level * Math.pow(1.1, parseInt(level))) * (-0.004 * temperature + 1.44)) * speed);
    }
}

function fusion_reactor_energy(level, energy_level) {
    return 30 * level * Math.pow((1.05 + (0.01 * energy_level)), level);
}

function fusion_reactor_deuterium_cost(level) {
    return 10 * level * Math.pow(1.1, level);
}

function array_addition(array1, array2) {
    var total = [];
    for (var i = 0; i < array1.length; i++) {
        total.push(array1[i] + array2[i]);
    }
    return total;
}

// https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
function format_number(num, fixed) {
    if (num === null) { return null; } // terminate early
    if (num === 0) { return '0'; } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
}

function format_resources_cost(costs) {
    return format_number(costs[0]) + ' métal, ' + format_number(costs[1]) + ' cristal et ' + format_number(costs[2]) + ' deutérium'
}