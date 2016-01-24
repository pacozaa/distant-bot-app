var app = angular.module('StarterApp', ['ngMaterial','ngMdIcons']);

app.controller('AppController', function() {

});
function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("gmap"), mapProp);

   google.maps.event.trigger(map, "resize");

}
google.maps.event.addDomListener(window, 'load', initialize);
