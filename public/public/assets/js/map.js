var map,				//map instance
	linepath,			//poly lines
	points = [],		//lat and long objects
	markers = [];		//marker lists

var mapTimer;           //map timer

var mapRequestFlag = false;
//var mapImg;            //map image container

var mapAPI = {
    init: function (data) {
        //default lat and lon value
        var start_point = {
            lat: 0,
            lon: 0
        };

        //if branch_data array have value
        if (data.length > 0) {
            start_point = {
                lat: data[0].latitude,
                lon: data[0].longitude
            }
        }

        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(start_point.lat, start_point.lon),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        //mapAPI.generatePolyLine(data);
        markers = mapAPI.generateMarker(data);

        //mapAPI.autoZoom();	//use this to auto zoom the map base on all points given

        google.maps.event.addListener(map, 'tilesloaded', function () {
            window.clearTimeout(mapTimer);
        });
    },
    createLatLong: function (latitude, longitude) {
        //SAMPLE	createLatLong(-25.363882,131.044922)
        return new google.maps.LatLng(latitude, longitude);
    },
    createMarker: function (options) {
        //source https://developers.google.com/maps/documentation/javascript/markers
        /* SAMPLE OPTION
        {
            position: createLatLong(-25.363882,131.044922),
            map: map,
            animation: google.maps.Animation.DROP,
            title:"Hello World!",
            icon: image //image path
        }
        */
        return new google.maps.Marker(options);
    },
    createPoint: function (coord) {	//creates the point to be used by polylines
        var coordinates = [];
        for (var i = 0; i < coord.length; i++) {
            var latitude = coord[i].latitude;
            var longitude = coord[i].longitude;
            coordinates.push(mapAPI.createLatLong(latitude, longitude));
        };
        return coordinates;
    },
    getIcon: function (type_id) {
        //generate icon base on activity id
        //source https://developers.google.com/maps/documentation/javascript/markers#simple_icons
        switch (type_id) {
            case 1:
                return "public/assets/images/avatar5.png";
                break;
            default:
                return ""; //use default icon if activity id dont match
                break;
        }
    },
    generatePolyLine: function (locations) {	//generate the polylines needed
        //source : https://developers.google.com/maps/documentation/javascript/shapes#polyline_add
        linepath = new google.maps.Polyline({
            path: mapAPI.createPoint(locations),
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        linepath.setMap(map);
    },
    generateMarker: function (locations) {
        var arr_marker = [];
        for (var i = 0; i < locations.length; i++) {
            var o = locations[i];	//o = branch_data object
            var latlon = mapAPI.createLatLong(o.latitude, o.longitude);	//position of item in map base on lat and long;
            points.push(latlon);
            var marker_title = o.name + '\n' + o.address;
            var tnmMarker = mapAPI.createMarker({
                position: latlon,
                map: map,								//set which map to show this icon
                animation: google.maps.Animation.DROP,	//marker animation
                title: marker_title,					//marker tooltip content
                tnm_data: o,							//additional property in marker object
                icon: mapAPI.getIcon(100)	                //generate icon base on activity
            })
            arr_marker.push(tnmMarker);

            google.maps.event.addListener(arr_marker[i], 'click', function () {
                /* SAMPLE OUTPUT
                MKY Trading - DATE GOES HERE
                Print Collection(10A02L000001)
                */
                var marker_data = this.tnm_data;
                //use html tags to modify the content of the info window
                //i add classes on some tags
                //i add styles at top of html to modify the design of info window
                var content = '<div>';
                content += '<span class="marker-info-title"><b>' + marker_data.name + '</b></span><br>';
                content += '<p class="marker-info-description">';
                content += marker_data.address;
                content += '</p>';
                content += '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: content,
                });
                infowindow.open(map, this);
            });
        }
        return arr_marker;
    },
    autoZoom: function () {
        //create bound object
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < points.length; i++) {
            bounds.extend(points[i]);	//extend all points to bounds to know the scope of all points in the map
        }
        map.setCenter(bounds.getCenter()); //center the map
        map.fitBounds(bounds);				//fit the map base on the bounds computed

        //remove one zoom level to ensure no marker is on the edge.
        map.setZoom(map.getZoom() - 1);

        // set a minimum zoom 
        // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
        if (map.getZoom() > 15) {
            map.setZoom(15);
        }
    }
};

