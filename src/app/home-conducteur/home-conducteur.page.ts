import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";

@Component({
    selector: 'app-home-conducteur',
    templateUrl: './home-conducteur.page.html',
    styleUrls: ['./home-conducteur.page.scss'],
})
export class HomeConducteurPage implements OnInit {

    id: number = 0;
    idTF: number = 0;

    constructor(
        private utilisateurService: UtilisateurService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.clearStorage();

    }

    clearStorage() {
        localStorage.removeItem('lat');
        localStorage.removeItem('lng');
        localStorage.removeItem('showA');
        localStorage.removeItem('showU');
        localStorage.removeItem('dateD');
        localStorage.removeItem('heureD');
        localStorage.removeItem('dateAr');
        localStorage.removeItem('heureAr');
        localStorage.removeItem('placeD');
        localStorage.removeItem('positionD');
        localStorage.removeItem('placeA');
        localStorage.removeItem('positionA');
    }

    rechercherTrajet() {
        this.router.navigate(['itineraire'], {state: {mot: 'conducteurP'}});
    }

    ajouterTrajet() {
        this.router.navigate(['itineraire'], {state: {mot: 'conducteurA'}});
    }

    consulter() {
        this.router.navigate(['itineraire'], {state: {mot: 'conducteur'}});
    }

}
