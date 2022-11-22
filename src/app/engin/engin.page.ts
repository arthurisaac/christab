import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../login/login.service';
import {AuthenticationService} from "../authentication.service";
import {Engin} from "./engin.model";
import {EnginService} from "./engin.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {EventManagerService} from "../event-manager.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-engin',
    templateUrl: './engin.page.html',
    styleUrls: ['./engin.page.scss'],
})
export class EnginPage implements OnInit {

    engins: Engin;
    engin: Engin = new Engin();
    utilisateurs: UtilisateurDto;
    show: boolean;
    mode: number;
    val: string;
    choixVoyage: string = 'V';
    choixUrbain: string = 'U';
    id: number = 0;
    idTF: number = 0;
    typeEngins: Array<any> = [{id: 1, val: "Auto"}, {id: 2, val: "Moto"}];
    PlaceA: Array<any> = [{val: 1}, {val: 2}, {val: 3}, {val: 4}];
    PlaceM: Array<any> = [{val: 1}, {val: 2}];
    place: number;
    subscription: Subscription;
    val1: string;
    val2: string;

    constructor(
        private alertCtrl: AlertController,
        private enginService: EnginService,
        private loginService: LoginService,
        private utilisateurService: UtilisateurService,
        private loadingController: LoadingController,
        private authService: AuthenticationService,
        private eventManager: EventManagerService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.clearStorage();
        this.subscription = this.route.params.subscribe((params) => {
            if (params['a'] != null && params['d'] != null) {
                this.val1 = params['a'];
                this.val2 = params['d'];
            }
        });
        this.val = this.route.snapshot.paramMap.get('a');
        if (this.val1 && this.val2) {
            if (this.val1 === this.choixUrbain && this.val2.match('a')) {
                this.mode = 5;
                console.log('******* Conducteur  Urbain (Ajout de trajet) ******');
            } else if (this.val1 === this.choixVoyage && this.val2.match('a')) {
                console.log('******* Conducteur  Voyage (Ajout de trajet) ******');
                this.mode = 6;
            } else {
                if (this.val1 === this.choixUrbain && this.val2.match('p')) {
                    this.mode = 1;
                } else if (this.val1 === this.choixVoyage && this.val2.match('p')) {
                    this.mode = 2;
                } else {
                    if (this.val1 === this.choixUrbain) {
                        console.log('******* Conducteur  Urbain (Consultation) ******');
                        this.mode = 3;
                    } else {
                        console.log('******* Conducteur  Voyage (Consultation) ******');
                        this.mode = 4;
                    }
                }

            }
        } else {
            if (this.val && (this.val === this.choixUrbain)) {
                this.mode = 1;
            } else {
                this.mode = 2;
            }
        }

    }

    clearStorage() {
        console.log('Initialisation du localStorage');
        localStorage.removeItem('lat');
        localStorage.removeItem('lng');
        localStorage.removeItem('showA');
    }

    prec() {
        if (this.val1 && this.val2) {
            if (this.val1 === this.choixUrbain && this.val2.match('a')) {
                console.log('******* Retour Conducteur  Urbain (Ajout de trajet) ******');
                this.router.navigate(['itineraire'], {state: {mot: 'conducteurA'}});
            } else if (this.val1 === this.choixVoyage && this.val2.match('a')) {
                console.log('******* Retour Conducteur  Voyage (Ajout de trajet) ******');
                this.router.navigate(['itineraire'], {state: {mot: 'conducteurA'}});
            } else {
                if (this.val1 === this.choixUrbain && this.val2.match('p')) {
                    console.log('******* Retour Conducteur  Urbain (Recherhce de trajet) ******');
                    this.router.navigate(['itineraire'], {state: {mot: 'conducteurP'}});
                } else if (this.val1 === this.choixVoyage && this.val2.match('p')) {
                    console.log('******* Retour Conducteur  Voyage (Recherhce de trajet) ******');
                    this.router.navigate(['itineraire'], {state: {mot: 'conducteurP'}});
                } else {
                    if (this.val1 === this.choixUrbain) {
                        console.log('******* Retour Conducteur  Urbain (Consultation de trajet) ******');
                        this.router.navigate(['itineraire'], {state: {mot: 'conducteur'}});
                    } else {
                        console.log('******* Retour Conducteur  Voyage (Consultation de trajet) ******');
                        this.router.navigate(['itineraire'], {state: {mot: 'conducteur'}});
                    }
                }

            }
        } else {
            if (this.val && (this.val === this.choixUrbain)) {
                console.log('******* Retour Passager Urbain ******');
                this.router.navigate(['itineraire', 'U']);
            } else {
                console.log('******* Retour Passager Voyage ******');
                this.router.navigate(['itineraire', 'V']);
            }
        }
    }

}
