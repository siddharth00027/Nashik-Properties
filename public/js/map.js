console.log(mapToken);
mapboxgl.accessToken ='pk.eyJ1Ijoic2lkZGhhcnRoMDAwMjciLCJhIjoiY2xxNHF3dHQ3MGI4ZzJwbGhidm4xcXpxNyJ9.HRP80FyJvTuJrvCagzw8Aw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
console.log(listing.geometry.coordinates)

const marker1 = new mapboxgl.Marker({color:'red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4> ${listing.title}</h4>`))
    .addTo(map);


