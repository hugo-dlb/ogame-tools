function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function next_level_cost(sCode, iLevel) {
    if (sCode === 'm') {
        return [Math.round((60 * Math.pow(1.5, iLevel))), Math.round((15 * Math.pow(1.5, iLevel))), 0];
    } else if (sCode === 'c') {
        return [Math.round(48 * (Math.pow(1.6, iLevel))), Math.round(24 * (Math.pow(1.6, iLevel))), 0];
    } else if (sCode === 'd') {
        return [Math.round(225 * Math.pow(1.5, iLevel)), Math.round(75 * Math.pow(1.5, iLevel)), 0];
    } else if (sCode === 'e') {
        return [Math.round(75 * Math.pow(1.5, iLevel - 1)), Math.round(30 * Math.pow(1.5, iLevel - 1)), 0];
    } else if (sCode === 'f') {
        return [900 * Math.pow(1.8, iLevel - 1), 360 * Math.pow(1.8, iLevel - 1), 180 * Math.pow(1.8, iLevel - 1)];
    } else if (sCode === 'et') {
        return [0, 800 * Math.pow(2, iLevel - 1), 400 * Math.pow(2, iLevel - 1)];
    } else if (sCode === 'h') {
        return [0, 4000 * Math.pow(2, iLevel), 2000 * Math.pow(2, iLevel)];
    }
}

function level_range_cost(sCode, iLevelFrom, iLevelTo) {
    let a = 0, b = 0, c = 0;

    for (let i = iLevelFrom; i < iLevelTo; i++) {
        const aCost = next_level_cost(sCode, i);
        a += aCost[0];
        b += aCost[1];
        c += aCost[2];
    }

    return [a, b, c];
}

function mine_energy_cost(sCode, iLevel) {
    if (sCode === 'm') {
        return 10 * iLevel * Math.pow(1.1, iLevel);
    } else if (sCode === 'c') {
        return 10 * iLevel * Math.pow(1.1, iLevel);
    } else if (sCode === 'd') {
        return 20 * iLevel * Math.pow(1.1, iLevel);
    }
}

function satellites_resources_cost(iSatellitesNumber) {
    return [0, iSatellitesNumber * 2000, iSatellitesNumber * 500];
}

function solar_plant_energy(iLevel) {
    return 20 * iLevel * Math.pow(1.1, iLevel);
}

function production(sCode, iLevel, iTemperature, iUniverseSpeed) {
    if (sCode === 'm') {
        return Math.round(30 * iLevel * Math.pow(1.1, parseInt(iLevel) + 1) * iUniverseSpeed);
    } else if (sCode === 'c') {
        return Math.round(20 * iLevel * Math.pow(1.1, parseInt(iLevel)) * iUniverseSpeed);
    } else if (sCode === 'd') {
        return Math.round(((10 * iLevel * Math.pow(1.1, parseInt(iLevel))) * (-0.004 * iTemperature + 1.44)) * iUniverseSpeed);
    }
}

function fusion_reactor_energy(iLevel, energy_level) {
    return 30 * iLevel * Math.pow((1.05 + (0.01 * energy_level)), iLevel);
}

function fusion_reactor_deuterium_cost(iLevel) {
    return 10 * iLevel * Math.pow(1.1, iLevel);
}

function array_addition(aArray1, aArray2) {
    let aTotal = [];
    for (let i = 0; i < aArray1.length; i++) {
        aTotal.push(aArray1[i] + aArray2[i]);
    }
    return aTotal;
}

// https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
function format_number(iNum, iDecimals) {
    if (iNum === null) { return null; } // terminate early
    if (iNum === 0) { return '0'; } // terminate early
    iDecimals = (!iDecimals || iDecimals < 0) ? 0 : iDecimals; // number of decimal places to show
    let b = (iNum).toPrecision(2).split("e"), // get power
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
        c = k < 1 ? iNum.toFixed(0 + iDecimals) : (iNum / Math.pow(10, k * 3)).toFixed(1 + iDecimals), // divide by power
        d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
        e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
}

function format_resources_cost(aCost) {
    return format_number(aCost[0]) + ' métal, ' + format_number(aCost[1]) + ' cristal et ' + format_number(aCost[2]) + ' deutérium'
}