import { Component, OnInit } from '@angular/core';
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {Platform} from "@ionic/angular";
import {
  GoogleMap,
  GoogleMaps,
  GoogleMapsAnimation,
  GoogleMapsEvent,
  HtmlInfoWindow,
  Marker
} from "@ionic-native/google-maps";
import {Router} from "@angular/router";

@Component({
  selector: 'app-detail-urbain',
  templateUrl: './detail-trajet.page.html',
  styleUrls: ['./detail-trajet.page.scss'],
})
export class DetailTrajetPage implements OnInit {

  id: number = 0;
  idTF: number = 0;
  lat: number;
  long: number;
  map: GoogleMap;

  constructor(
      private router: Router,
      private geolocation: Geolocation,
      public platform: Platform
  ) { }

  ngOnInit() {

    /********** Affichage de la carte ************/
    this.geolocation.getCurrentPosition().then((resp) => {
      // console.log(resp);

      // récupération des coordonnées géographiques(latitude et longitude) de la position actuelle
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      /*console.log('Dans la géolocalisation');
      console.log('lat: '+this.lat+', long: '+this.long);*/
      this.platform.ready().then(() => this.loadMap(resp.coords.latitude, resp.coords.longitude, this.router.getCurrentNavigation().extras.state));

    }).catch((error) => {
      console.log('Error getting location', error);
      alert("Pas d'accès internet");
    });
  }

  /******************************* Carte **************************/
  loadMap(lat: number, lng: number, data: any) {
    this.map = GoogleMaps.create('map', {
      camera: {
        target: {lat: lat, lng: lng},
        zoom: 16
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      }
    });
    let htmlInfoWindow = new HtmlInfoWindow();

    for(let a of data) {
      // flip-flop contents
      let frame: HTMLElement = document.createElement('div');
      if(a[0].depart != null) {
        frame.innerHTML =`
        <div id="flip-container">
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].depart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].destination + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
      } else {
        frame.innerHTML =`
        <div id="flip-container">
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].lieuDepart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].lieuArrivee + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
      }


      frame.addEventListener("click", (evt) => {
        console.log(evt.target);
        let root: any = evt.target;
        while (root.parentNode) {
          root = root.parentNode;
        }
        this.router.navigate(['demande', 'TC'], {state: {data: a, items: data}});
        let container = root.getElementById('flip-container');
        if (container.className.indexOf(' hover') > -1) {
          container.className = container.className.replace(" hover", "");
        } else {
          container.className += " hover";
        }
      });
      htmlInfoWindow.setContent(frame, {
        width: "auto"
      });

      const marker: Marker = this.map.addMarkerSync({
        'position': {lat: a[2].latitude, lng: a[2].longitude},
        'draggable': true,
        'disableAutoPan': true,
        'animation': GoogleMapsAnimation.DROP
      });

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        htmlInfoWindow.open(marker);
      });

      marker.trigger(GoogleMapsEvent.MARKER_CLICK);
    }
  }

}
