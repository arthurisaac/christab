import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Itineraire} from "./itineraire.model";

@Component({
    selector: 'app-trajet',
    templateUrl: './itineraire-page.component.html',
    styleUrls: ['./itineraire-page.component.scss'],
})
export class ItinerairePage implements OnInit {

    itineraires: Itineraire;
    itineraire: Itineraire = new Itineraire();
    from: string = 'conducteur';
    fA: string = 'conducteurA';
    cp: string = 'conducteurP';
    subscription: Subscription;
    val: any;
    mode: number;
    id: number = 0;
    idTF: number = 0;
    mod: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.clearStorage();
        if (this.router.getCurrentNavigation().extras.state) {
            this.val = this.router.getCurrentNavigation().extras.state.mot; //ici c'est le paramètre ajouté dans app.router.module
        }
        if (this.val && (this.val === this.from)) {
            this.mode = 1;
            console.log("***** Consultation de la liste des demandes de trajets en tant que conducteur *****");
            this.mod = true;
            // console.log(this.val);
        } else if (this.val && (this.val === this.fA)) {
            this.mode = 3;
            console.log("***** Ajout d'un trajet en tant que conducteur *****");
            this.mod = true;
        } else {
            if (this.val && (this.val === this.cp)) {
                console.log("***** Recherche de trajet d'un conducteur en tant que passager *****");
                this.mode = 4;
                this.mod = true;
            } else {
                console.log("***** Consultation de la liste des trajets en tant que passager *****");
                this.mode = 2;
            }
        }
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

    prec() {
        console.log('******* Retour Home conductour ******');
        this.router.navigate(['/home-conducteur']);
    }


}
