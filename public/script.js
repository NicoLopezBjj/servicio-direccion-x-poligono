let polygon = []
let mapInitialized = false;
let map, drawControl;

window.onload = function () {

    document.getElementById('cityInput').value = ''

    document.getElementById('cityForm').addEventListener('submit', function (event) {
        event.preventDefault()
        document.getElementById('result').textContent = ''

        fetch('/address/city', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // coordinates example
                // drawArea: [[[-63.503413089583,-33.63419771421],[-62.976069339583,-41.030804903972],[-55.417475589583,-37.24904685609],[-60.031733402083,-32.083879139012],[-63.503413089583,-33.63419771421]]],
                drawArea: polygon,
                address: document.getElementById('cityInput').value
            }),
        })
            .then(response => response.json())
            .then(data => {
                const txt = data.esta_dentro ? data.city : ''

                document.getElementById('result').textContent = data.message + txt
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    document.getElementById('drawPolygon').addEventListener('click', function () {

        var mapContainer = document.getElementById('mapid');
        mapContainer.style.display = 'block';

        if (!mapInitialized) {
            map = L.map('mapid').setView([-34.615127, -58.40332], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            drawControl = new L.Control.Draw({
                draw: {
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    polygon: true
                },
                edit: {
                    featureGroup: new L.FeatureGroup().addTo(map),
                    remove: true
                }
            }).addTo(map);

            map.on(L.Draw.Event.CREATED, function (e) {
                var type = e.layerType,
                    layer = e.layer;                
                // trigger only when the poylygon is closed
                if (type === 'polygon') {
                    let geojson = layer.toGeoJSON();

                    // turf require onle the coordinates from geojson
                    polygon = geojson.geometry.coordinates
                }

                map.addLayer(layer);
            });

            // prevent double init error
            mapInitialized = true;
        }
    });
};
