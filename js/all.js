function GetLocationSuccess(position) {
    var today = new Date();
    var day;
    switch (true) {
        case (today.getDay() == '1'):
            day = '一';
            break;
        case (today.getDay() == '2'):
            day = '二';
            break;
        case (today.getDay() == '3'):
            day = '三';
            break;
        case (today.getDay() == '4'):
            day = '四';
            break;
        case (today.getDay() == '5'):
            day = '五';
            break;
        case (today.getDay() == '6'):
            day = '六';
            break;
        case (today.getDay() == '0'):
            day = '日';
            break;
    }
    var Month = ("0" + (today.getMonth() + 1)).slice(-2);
    var TodayDate = ("0" + today.getDate()).slice(-2);
    document.querySelector('.DayOfWeek span').textContent = day;
    document.querySelector('.Date').textContent = today.getFullYear() + '-' + Month + '-' + TodayDate;

    var IDSuffix;
    if (today.getDay() % 2 == 0) {
        IDSuffix = '2,4,6,8,0';
    } else {
        IDSuffix = '1,3,5,7,9';
    }
    document.querySelector('.WhoCanBuy em').textContent = IDSuffix;
    var map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 16);
    // var map = L.map('map').setView([24.184259, 120.669113], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    var yellowIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var markers = new L.MarkerClusterGroup();
    var xhr = new XMLHttpRequest();
    xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", true);
    xhr.send();
    xhr.onload = function () {
        data = JSON.parse(xhr.responseText).features;
        // console.log(data[0]);
        var IconColor;
        for (var i = 0; i < data.length; i++) {
            if (data[i].properties.mask_adult > 0 && data[i].properties.mask_child > 0) {
                IconColor = greenIcon;
            } else if (data[i].properties.mask_adult > 0 || data[i].properties.mask_child > 0) {
                IconColor = yellowIcon;
            } else {
                IconColor = redIcon;
            }
            markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: IconColor })
                .bindPopup('<div class="Result" style="font-size: 8px;"><div class="Store" style="height: 110px;"><p class="StoreName" style="font-size: 14px;">' + data[i].properties.name + '</p><p class="StoreAddress">' + data[i].properties.address + '</p><p class="StorePhone">' + data[i].properties.phone + '</p><div class="FaceMaskNum"><div class="FaceMaskFrame" style="font-size: 10px; width: 100px; height: 24px; background-color: #73C0D8;">成人口罩<span style="font-size: 14px;">' + data[i].properties.mask_adult + '</span></div><div class="FaceMaskFrame" style="font-size: 10px; width: 100px; height: 24px; background-color: #FFA573;">兒童口罩<span style="font-size: 14px;">' + data[i].properties.mask_child + '</span></div></div></div></div>'));
        }
    }
    map.addLayer(markers);
}

function SearchStore() {
    var SearchBarInput = document.querySelector(".SearchBar input").value;
    var Result = document.querySelector(".Result");
    var ResultStr = '';
    var ResultCount = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].properties.name == SearchBarInput || data[i].properties.address == SearchBarInput || data[i].properties.town == SearchBarInput) {
            ResultStr = ResultStr + '<div class="Store" style="height: 90px;"><p class="StoreName" style="font-size: 14px;">' + data[i].properties.name + '</p><p class="StoreAddress">' + data[i].properties.address + '</p><p class="StorePhone">' + data[i].properties.phone + '</p><div class="FaceMaskNum"><div class="FaceMaskFrame" style="font-size: 10px; width: 44%; height: 24px; background-color: #73C0D8;">成人口罩<span style="font-size: 14px;">' + data[i].properties.mask_adult + '</span></div><div class="FaceMaskFrame" style="font-size: 10px; width: 44%; height: 24px; background-color: #FFA573;">兒童口罩<span style="font-size: 14px;">' + data[i].properties.mask_child + '</span></div></div></div>';
            ResultCount++;
            if (ResultCount == 4) {
                break;
            }
        }
    }

    Result.innerHTML = ResultStr;
    // console.log(data);
    // console.log(SearchBarInput);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// function success(pos) {
//     var crd = pos.coords;

//     console.log('Your current position is:');
//     console.log('Latitude : ' + crd.latitude);
//     console.log('Longitude: ' + crd.longitude);
//     console.log('More or less ' + crd.accuracy + ' meters.');
// };

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
};
var data;
navigator.geolocation.getCurrentPosition(GetLocationSuccess, error, options);

// GetLocationSuccess();









