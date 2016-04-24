"use strict";angular.module("grtNowApp",["ngAnimate","ui.router","uiGmapgoogle-maps","Api","angular.filter","satellizer","angucomplete-alt","ngAnimate","toastr"]).constant("apiUrl","http://grtnow.nexxtserver.net/api").config(["$urlRouterProvider","$stateProvider","uiGmapGoogleMapApiProvider","$authProvider","apiUrl",function(a,b,c,d,e){d.baseUrl=e,d.google({url:"auth/authenticate?provider=google",clientId:"674449033922-u0k8no0grpkclntu0garorb3fvgfqk33.apps.googleusercontent.com"}),b.state("main",{url:"/",controller:"MainCtrl"}).state("trips",{url:"/trips/:trip_id",templateUrl:"views/trip_info.html",controller:"TripsCtrl"}).state("favorite-routes",{url:"/favorite-routes",templateUrl:"views/favoriteroutes.html",controller:"FavoriteRoutesCtrl"}).state("stops",{url:"/stops/:stop_id",templateUrl:"views/stop_info.html",controller:"StopsCtrl"}),a.otherwise("/"),c.configure({key:"AIzaSyA0RIGbN4IvCTcypNo1Vk0WbF-WGCmFZuk",v:"3.20"})}]).factory("Sidebar",["$rootScope",function(a){return{active:!0,stops:[],search:function(){a.$broadcast("Sidebar")}}}]).factory("Spinner",["$rootScope",function(a){return{active:!0,show:function(){this.active=!0},hide:function(){this.active=!1}}}]),angular.module("Api",["ngResource"]).factory("VehicleRealtimes",["apiUrl","$resource",function(a,b){return b(a+"/vehicle_realtimes",{},{list:{method:"GET",params:{}}})}]).factory("VehicleStops",["apiUrl","$resource",function(a,b){return b(a+"/vehicle_stops",{},{list:{method:"GET",params:{}}})}]).factory("VehicleRoutes",["apiUrl","$resource",function(a,b){return b(a+"/vehicle_routes",{},{list:{method:"GET",params:{}}})}]).factory("VehicleStopTimes",["apiUrl","$resource",function(a,b){return b(a+"/vehicle_stop_times/?vehicle_trip_id=:trip&vehicle_stop_id=:stop",{trip:"@trip_id",stop:"@stop_id"},{list:{method:"GET"}})}]).factory("User",["apiUrl","$resource","$auth",function(a,b,c){return b(a+"/user",{},{list:{method:"GET",headers:{Authorization:c.getToken()||null}}})}]).factory("UserFavorites",["apiUrl","$resource","$auth",function(a,b,c){return b(a+"/user/favorite_routes",{},{save:{method:"POST",headers:{Authorization:c.getToken()||null}},query:{method:"GET",isArray:!1,headers:{Authorization:c.getToken()||null}}})}]),angular.module("grtNowApp").controller("NavbarCtrl",["$scope","Sidebar","$interval","$auth","User","toastr",function(a,b,c,d,e,f){a.user={},a.authenticate=function(b){d.authenticate(b).then(function(b){d.setToken(b),a.user.name=b.data.name})["catch"](function(a){f.error("Could not login you.","Oh no!"),console.log("error: ",a)})},a.logout=function(){d.logout()},a.isAuthenticated=function(){return d.isAuthenticated()},a.isAuthenticated()&&e.list(function(b){a.user=b})}]),angular.module("grtNowApp").controller("WindowCtrl",["$scope","$rootScope","uiGmapGoogleMapApi","uiGmapObjectIterators","Spinner","Sidebar","VehicleStopTimes","VehicleRealtimes","UserFavorites","$interval","$auth","$window","toastr",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.isAuthenticated=function(){return k.isAuthenticated()},a.onBusStopClick=function(a){f.active=1,f.stops={spinner:!0,entries:[]},g.get({trip:a},function(a){f.stops.spinner=!1,f.stops.entries=a.entries,e.hide()})},a.onAddFavoriteClick=function(a){f.active=1;var c=new i;c.vehicle_route_id=a,c.$save(),l.location.href="#/favorite-routes",b.$broadcast("favorite-routes-update"),m.success("Route favorited")},a.onAddFavoriteGuestClick=function(){m.warning("You should login first")}}]),angular.module("grtNowApp").controller("MainCtrl",["$scope","$stateParams","uiGmapGoogleMapApi","uiGmapObjectIterators","VehicleRoutes","VehicleStops","VehicleRealtimes","Sidebar","$interval","$rootScope",function(a,b,c,d,e,f,g,h,i,j){var k=[];a.markers={},a.busRoutes=[],a.routeSearched=b.route_id||null,a.sidebar=h,a.sidebar.active=0,a.updateMarkersBusStops=function(){},a.loadRoutes=function(){e.list(function(b){a.busRoutes=b.entries})},a.updateMarkersRealtime=function(b){g.list(function(c){var d=0;b&&(a.markers=[],k=[]),c.entries.map(function(a){k[d]&&k[d].latitude==a.lat&&k[d].longitude==a["long"]||(b?b.title==a.vehicle_route_id&&(k[d]={id:a.id,latitude:a.lat,longitude:a["long"],route:a.vehicle_route_id+" "+a.vehicle_route.long_name,route_id:a.vehicle_route_id,trip_id:a.vehicle_trip_id,icon:"images/bus.a34b2090.png",title:a.vehicle_trip.name,lastUpdate:a.updated_at}):k[d]={id:a.id,latitude:a.lat,longitude:a["long"],route:a.vehicle_route_id+" "+a.vehicle_route.long_name,route_id:a.vehicle_route_id,trip_id:a.vehicle_trip_id,icon:"images/bus.a34b2090.png",title:a.vehicle_trip.name,lastUpdate:a.updated_at}),d++}),a.markers=k,c.entries.length<k.length&&(k=k.slice(0,c.entries.length))})},a.map={center:{latitude:43.453669,longitude:-80.507135},zoom:12,options:{mapTypeControl:!1}},c.then(function(b){a.updateMarkersRealtime(null),a.updateMarkersBusStops(),a.loadRoutes(),i(function(){a.updateMarkersRealtime()},5e3)}),a.onMarkerClick=function(b,c,d){d.show=!b.model.show,a.$apply()},a.onSearchClick=function(){a.routeSearched&&a.updateMarkersRealtime(a.routeSearched)},a.localSearch=function(b){var c=[];return a.busRoutes.forEach(function(a){(a.long_name.toLowerCase().indexOf(b.toString().toLowerCase())>=0||a.id.toString().indexOf(b.toString())>=0)&&c.push(a)}),c},a.selectedRoute=function(b){a.routeSearched=b,a.updateMarkersRealtime(b)}}]),angular.module("grtNowApp").controller("TripsCtrl",["$scope","$stateParams","VehicleStopTimes","Sidebar",function(a,b,c,d){d.active=!0,a.title=b.title,a.stops={spinner:!0,entries:[]},c.get({trip:b.trip_id},function(b){a.stops.spinner=!1,a.stops.entries=b.entries})}]),angular.module("grtNowApp").controller("StopsCtrl",["$scope","$stateParams","VehicleStopTimes","Sidebar",function(a,b,c,d){d.active=!0,a.stops={spinner:!0,entries:[]},c.get({stop:b.stop_id},function(b){a.stops.spinner=!1,a.stops.entries=b.entries})}]),angular.module("grtNowApp").controller("FavoriteRoutesCtrl",["$scope","UserFavorites","$interval","Sidebar","$auth",function(a,b,c,d,e){d.active=!0,d.routes={spinner:!0},a.$on("favorite-routes-update",function(b,c){a.updateUserFavorites()}),a.onRouteClick=function(){$rootScope.$broadcast("favorite-routes-update")},a.updateUserFavorites=function(){d.routes.spinner=!0,b.query(function(b){a.routes=b,d.routes.spinner=!1})},a.updateUserFavorites()}]),angular.module("grtNowApp").run(["$templateCache",function(a){a.put("views/favoriteroutes.html",'<div class="row" ng-show="!routes.spinner"> <div class="col s10"> <span>My favorite routes</span> </div> <div class="col s2 right-align"> <a ui-sref="main"><i class="material-icons">close</i></a> </div> </div> <div class="row" ng-show="!routes.spinner"> <div class="col s12"> <span>Routes</span> </div> </div> <div class="row"> <div class="s12 center" ng-show="routes.spinner"> <div class="preloader-wrapper small active"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div> <ul class="collection" ng-show="!routes.spinner"> <li class="collection-item" ng-repeat="route in routes.entries"> <span># {{ route.vehicle_route.id }}</span> <br> <small>{{ route.vehicle_route.long_name }}</small> </li> </ul> </div>'),a.put("views/main.html",'<div class="card-panel search-box pos-abs"> <form class=""> <div class="row"> <div class="input-field col s7"> <angucomplete-alt id="ex2" placeholder="Search for routes" pause="300" selected-object="selectedRoute" local-data="busRoutes" local-search="localSearch" title-field="id" description-field="long_name" minlength="1" input-class="form-control form-control-small" match-class="highlight"> <!-- input placeholder="Search for routes" id="first_name" type="text" class="validate" ng-model="search" --> </div> <div class="input-field col"> <button class="btn" ng-click="onSearchClick">Search</button> </div> </div> </form> </div> <ui-gmap-google-map center="map.center" zoom="map.zoom" options="map.options"> <ui-gmap-markers models="markers" coords="\'self\'" icon="\'icon\'" click="onMarkerClick"> <ui-gmap-windows show="show" templateurl="\'markers.window.tpl.html\'" templateparameter="\'templateParameters\'"> <div ng-controller="WindowCtrl"> <div ng-non-bindable> <h5>{{ title }}</h5> <div class="divider"></div> <div class="row"> <h6>Last update: {{ lastUpdate | date:\'medium\' }}</h6> </div> <div class="row"> <h6>Route: {{ route }}</h6> </div> </div> <div class="row center"> <a class="btn waves-effect waves-light" ui-sref="trips({trip_id: $parent.model.trip_id})">See bus stops</a> <a ng-show="isAuthenticated()" class="btn waves-effect waves-light" ng-click="onAddFavoriteClick($parent.model.route_id)">Add as favorite</a> <a ng-show="!isAuthenticated()" class="btn waves-effect waves-light disabled" ng-click="onAddFavoriteGuestClick()">Add as favorite</a> </div> </div>  </ui-gmap-windows></ui-gmap-markers> </ui-gmap-google-map>'),a.put("views/stop_info.html",'<div class="row" ng-show="!stops.spinner"> <div class="col s10"> <span>{{ stops.entries[0].vehicle_stop.name }} </span> </div> <div class="col s2 right-align"> <a ui-sref="main"><i class="material-icons">close</i></a> </div> </div> <div class="row" ng-show="!stops.spinner"> <div class="col s12"> <span>Bus Schedule</span> </div> </div> <div class="row"> <div class="s12 center" ng-show="stops.spinner"> <div class="preloader-wrapper small active"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div> <ul class="collection" ng-show="!stops.spinner"> <li class="collection-item" ng-repeat="stop in stops.entries | orderBy : \'+departure_time\'"> <span>{{ stop.departure_time }}</span> <br> <small>{{ stop.vehicle_trip.name }}</small> </li> </ul> </div>'),a.put("views/trip_info.html",'<div class="row" ng-show="!stops.spinner"> <div class="col s10"> <span> {{ stops.entries[0].vehicle_trip.name }} </span> </div> <div class="col s2 right-align"> <a ui-sref="main"><i class="material-icons">close</i></a> </div> </div> <div class="row" ng-show="!stops.spinner"> <div class="col s12"> <span>Stops</span> </div> </div> <div class="row"> <div class="s12 center" ng-show="stops.spinner"> <div class="preloader-wrapper small active"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div> <ul class="collection" ng-show="!stops.spinner"> <li class="collection-item" ng-repeat="stop in stops.entries"> <a ui-sref="stops({stop_id: stop.vehicle_stop_id})">{{ stop.vehicle_stop.name }}</a> </li> </ul> </div>')}]);