import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GeocoderResult} from "@ionic-native/google-maps";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingController, NavController, Platform} from "@ionic/angular";
import {NativeGeocoder, NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";

declare var google;

@Component({
    selector: 'app-recherche-carte',
    templateUrl: './recherche-carte.page.html',
    styleUrls: ['./recherche-carte.page.scss'],
})
export class RechercheCartePage implements OnInit, OnDestroy {

    loading: any;
    showDetails: boolean = false;
    id: number = 0;
    idTF: number = 0;
    dateA: string;
    images: any;
    icones: any;
    photo: any;
    from: string;
    lieu = 0;
    place: string;
    val: string;
    valUD: string = 'UD'; // recherche
    valUA: string = 'UA';
    valVD: string = 'VD';
    valVA: string = 'VA';
    valUDD: string = 'UDD'; // demande
    valUAD: string = 'UAD';
    valVDD: string = 'VDD';
    valVAD: string = 'VAD';
    valUDA: string = 'UDAn'; // annonce
    valUAA: string = 'UAAn';
    valVDA: string = 'VDAn';
    valVAA: string = 'VAAn';

    @ViewChild('map', {static: false}) mapElement: ElementRef;
    map: any;
    address: string;
    lat: string;
    long: string;
    autocomplete: { input: '' };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
    geocoder: any;
    markers: any;

    constructor(
        public loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        public platform: Platform
    ) {
    }

    ngOnInit() {
        this.val = this.route.snapshot.paramMap.get('d');
        this.place = '';
        this.autocompleteItems = [];
        this.geocoder = new google.maps.Geocoder;
        this.markers = [];
        this.lieu = 0;

        /*console.log(this.val);
        console.log(this.route.snapshot.paramMap.get('d'));*/

        if (this.val === this.valUD) {
            // console.log('***** Recherche urbain départ *******');
            this.lieu = 1;
        } else if (this.val === this.valUA) {
            // console.log('***** Recherche urbain arrivée *******');
            this.lieu = 2;
        } else if (this.val === this.valVD) {
            // console.log('***** Recherche voyage départ *******');
            this.lieu = 3;
        } else if (this.val === this.valVA) {
            // console.log('***** Recherche voyage arrivée *******');
            this.lieu = 4;
        } else if (this.val === this.valUDD) {
            // console.log('***** Demande urbain départ *******');
            this.lieu = 5;
        } else if (this.val === this.valUAD) {
            // console.log('***** Demande urbain arrivée *******');
            this.lieu = 6;
        } else if (this.val === this.valVDD) {
            // console.log('***** Demande voyage départ *******');
            this.lieu = 7;
        } else if (this.val === this.valVAD) {
            // console.log('***** Demande voyage arrivée *******');
            this.lieu = 8;
        } else if (this.val === this.valUDA) {
            // console.log('***** Annonce urbain départ *******');
            this.lieu = 9;
        } else if (this.val === this.valUAA) {
            // console.log('***** Annonce urbain arrivée *******');
            this.lieu = 10;
        } else if (this.val === this.valVDA) {
            // console.log('***** Annonce voyage départ *******');
            this.lieu = 11;
        } else if (this.val === this.valVAA) {
            // console.log('***** Annonce voyage arrivée *******');
            this.lieu = 12;
        }

        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.loadMap();
    }


    ngOnDestroy() {
    }

    ionViewWillenter() {
        this.loadMap();
        this.place = '';
        this.autocompleteItems = [];
        this.geocoder = new google.maps.Geocoder;
        this.markers = [];
    }


    loadMap() {

        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.map.addListener('click', () => {
                this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
                this.lat = resp.coords.latitude.toString();
                this.long = resp.coords.longitude.toString();
            });
        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
        });
    }


    getAddressFromCoords(latitude, longitude) {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
            .then((result: GeocoderResult[]) => {
                this.address = "";
                let responseAddress = [];
                for (let [key, value] of Object.entries(result[0])) {
                    if (value.length > 0)
                        responseAddress.push(value);
                }
                responseAddress.reverse();
                for (let value of responseAddress) {
                    this.address += value + ", ";
                }
                this.address = this.address.slice(0, -2);

            })
            .catch((error: any) => {
                this.address = "Addresse indisponible!";
            });
    }

    UpdateSearchResults() {
        if (this.place == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.place},
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    SelectSearchResult(item) {
        this.autocompleteItems = [];

        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {
                this.map.setZoom(18);
                this.map.setCenter(results[0].geometry.location);
                const infoWindow = new google.maps.InfoWindow({
                    content: item.description,
                });
                let marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: this.map
                })

                infoWindow.open(this.map, marker);

                marker.addListener('click', () => {
                // console.log(item.description);
                    this.map.panTo(marker.getPosition());
                    this.zone.run(()=>{

                        let p = marker.getPosition();
                        console.log(this.lieu);
                        console.log(item.description);
                        if(item.description !== null) {
                          if (this.lieu === 1) {
                              console.log('***** Recherche urbain départ *******');
                              this.router.navigate(['demande', 'SUD'], {state: {result: item.description + p}});
                          } else if (this.lieu === 2) {
                              console.log('***** Recherche urbain arrivée *******');
                              this.router.navigate(['demande', 'SUA'], {state: {result: item.description + p}});
                          } else if (this.lieu === 3) {
                              console.log('***** Recherche voyage départ *******');
                              this.router.navigate(['demande', 'SVD'], {state: {result: item.description + p}});
                          } else if (this.lieu === 4) {
                              console.log('***** Recherche voyage arrivée *******');
                              this.router.navigate(['demande', 'SVA'], {state: {result: item.description + p}});
                          } else if (this.lieu === 5) {
                              console.log('***** Demande urbain départ *******');
                              this.router.navigate(['demande', 'SUDD'], {state: {result: item.description + p}});
                              // this.router.navigate(['demande', 'SUD'], {state: {resultD: item.description + p}});
                          } else if (this.lieu === 6) {
                              console.log('***** Demande urbain arrivée *******');
                              this.router.navigate(['demande', 'SUAD'], {state: {result: item.description + p}});
                              // this.router.navigate(['demande', 'SUA'], {state: {resultD: item.description + p}});
                          } else if (this.lieu === 7) {
                              console.log('***** Demande voyage départ *******');
                              this.router.navigate(['demande', 'SVDD'], {state: {result: item.description + p}});
                              // this.router.navigate(['demande', 'SVD'], {state: {resultD: item.description + p}});
                          } else if (this.lieu === 8) {
                              console.log('***** Demande voyage arrivée *******');
                              this.router.navigate(['demande', 'SVAD'], {state: {result: item.description + p}});
                              // this.router.navigate(['demande', 'SVA'], {state: {resultD: item.description + p}});
                          } else if (this.lieu === 9) {
                              this.router.navigate(['annonce', 'SUD'], {state: {result: item.description + p}});
                          } else if (this.lieu === 10) {
                              this.router.navigate(['annonce', 'SUA'], {state: {result: item.description + p}});
                          } else if (this.lieu === 11) {
                              this.router.navigate(['annonce', 'SVD'], {state: {result: item.description + p}});
                          } else if (this.lieu === 12) {
                              this.router.navigate(['annonce', 'SVA'], {state: {result: item.description + p}});
                          }
                        } else{
                          alert("lieu indisponible");
                        }

                    });
                });

            }
        })
    }


    ClearAutocomplete() {
        this.autocompleteItems = [];
        this.place = '';
    }


    backSearch() {
        console.log(this.lieu);
        if (this.lieu === 1) {
            this.router.navigate(['demande', 'SUD']);
        } else if (this.lieu === 2) {
            this.router.navigate(['demande', 'SUA']);
        } else if (this.lieu === 3) {
            this.router.navigate(['demande', 'SVD']);
        } else if (this.lieu === 4) {
            this.router.navigate(['demande', 'SVA']);
        } else if (this.lieu === 5) {
            this.router.navigate(['demande', 'SUDD']);
        } else if (this.lieu === 6) {
            this.router.navigate(['demande', 'SUAD']);
        } else if (this.lieu === 7) {
            this.router.navigate(['demande', 'SVDD']);
        } else if (this.lieu === 8) {
            this.router.navigate(['demande', 'SVAD']);
        } else if (this.lieu === 9) {
            this.router.navigate(['annonce', 'SUD']);
        } else if (this.lieu === 10) {
            this.router.navigate(['annonce', 'SUA']);
        } else if (this.lieu === 11) {
            this.router.navigate(['annonce', 'SVD']);
        } else if (this.lieu === 12) {
            this.router.navigate(['annonce', 'SVA']);
        }
    }

}
