// this is a helper to get the distance between a pharmacy and
// a user. The calculated distance in this case should not be
// longer than 50 kilometres.
function getDistance({lat1, lng1, lat2, lng2}) {
    const radius = 6371;

    let latitudeDistance = toRad(lat2 - lat1);
    let longitudeDistance = toRad(lng2 - lng1);

    const latitude_1 = toRad(lat1);
    const latitude_2 = toRad(lat2);

    let a = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) + 
            Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2) * Math.cos(latitude_1) * 
            Math.cos(latitude_2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (c * radius).toFixed(3);
}


function toRad(value) {
    return value * Math.PI / 180;
}


module.exports = getDistance;
