import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import {HttpClientModule} from "@angular/common/http";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {NativeGeocoder} from "@ionic-native/native-geocoder/ngx";
import { Camera } from '@ionic-native/camera/ngx';

import { IonicStorageModule } from '@ionic/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from './login/login.page';
import { UtilisateurPage } from './utilisateur/utilisateur.page';
import { DetailTrajetPage } from './detail-trajet/detail-trajet.page';
import { EnginPage } from './engin/engin.page';
import { ReservationPage } from './reservation/reservation.page';
import { ItinerairePage } from './itineraire/itineraire-page.component';
import { TypeFonctionPage } from './type-fonction/type-fonction.page';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import * as Events from "events";
import {DatePipe} from "@angular/common";

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";
import {GoogleMaps} from "@ionic-native/google-maps";
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from "@ionic-native/sms/ngx";


/******* Pour la langue française *********/
registerLocaleData(localeFr, 'fr');

// @ts-ignore
@NgModule({
  declarations: [AppComponent,
                 LoginPage,
                 UtilisateurPage,
                 DetailTrajetPage,
                 EnginPage,
                 ReservationPage,
                 ItinerairePage,
                 TypeFonctionPage
                 ],
  entryComponents: [LoginPage,
                    UtilisateurPage,
                    DetailTrajetPage,
                    EnginPage,
                    ReservationPage,
                    ItinerairePage,
                    TypeFonctionPage
                    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        HttpClientModule,
        BrowserModule, AppRoutingModule, IonicModule.forRoot({mode: 'md'}),
        IonicStorageModule.forRoot({
            name: '__ChristaBData',
            driverOrder:['localstorage']
            // driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        // pour afficher la carte google map
        /*AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAtLieUuCIpo3d18ZvIdLd6Jnpr6KAzdVA', // pour ChristaB
            libraries: ['places']
        }),*/
        FontAwesomeModule

    ],
  providers: [
    StatusBar,
    SplashScreen,
      Geolocation, // pour la géolocalisation
      NativeGeocoder, // pour retrouver le nom des places à partir des coordonnées
      Events,
      Camera,
      DatePipe,
      OneSignal,
      GoogleMaps,
      AndroidPermissions,
      SMS,
      {provide: LOCALE_ID, useValue: 'fr-FR' },
   { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, fab, far);
    }
}
