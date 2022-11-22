import {Component, OnInit} from '@angular/core';
import {Annonce, AnnonceDto} from "../annonce/annonce.model";
import {AnnonceService} from "../annonce/annonce.service";
import {Itineraire} from "../itineraire/itineraire.model";
import {AvisDto} from "../avis/avis.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {ItineraireService} from "../itineraire/itineraire.service";
import {AvisService} from "../avis/avis.service";
import {DomSanitizer} from "@angular/platform-browser";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {DatePipe} from "@angular/common";
import {Paiement} from "../paiement/paiement.model";
import {PaiementService} from "../paiement/paiement.service";
import {NavController, Platform} from "@ionic/angular";

@Component({
    selector: 'app-trajet',
    templateUrl: './trajet.page.html',
    styleUrls: ['./trajet.page.scss'],
})
export class TrajetPage implements OnInit {

    mode: number;
    annonces: AnnonceDto;
    annoncesEC: AnnonceDto;
    annonce: Annonce = new Annonce();
    annoncesWUAIAv: Array<AnnonceDto>;
    annoncesWUAIAvEC: Array<AnnonceDto>;
    itineraires: Itineraire;
    itinerairesEC: Itineraire;
    itineraire: Itineraire = new Itineraire();
    itiner: Itineraire = new Itineraire();
    utilisateurs: UtilisateurDto;
    utilisateursEC: UtilisateurDto;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    paiement: Paiement = new Paiement();
    infoSup: InformationsSupplementaires;
    avis: AvisDto;
    avisEC: AvisDto;
    avi: AvisDto = new AvisDto();
    id: number = 0;
    idTF: number = 0;
    dateA: string;
    images: any;
    icones: any;
    notif: boolean = false;

    constructor(
        private navCtrl: NavController,
        private annonceService: AnnonceService,
        private utilisateurService: UtilisateurService,
        private itineraireService: ItineraireService,
        private aviService: AvisService,
        private paiementService: PaiementService,
        private infoSupService: InformationsSupplementairesService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
    }

    getAll() {
        this.trajetPEC();
        this.trajetP();
        this.trajetCEC();
        this.trajetC();
    }

    back() {
        this.ngOnInit();
    }

    isAuthorised() {
        if (this.idTF == 1) {
            this.navCtrl.navigateForward('/home-conducteur');
        } else {
            this.navCtrl.navigateForward('/itineraire');
        }
    }

    trajetC() {
        this.mode = 2;
        this.annonceService.getAllWUAIAvFC(this.id).subscribe(data => {
            this.annoncesWUAIAv.push(data);
            for (let a of this.annoncesWUAIAv) {
                // console.log(a);
                this.annonces = a[0];
                if (this.annonces.dateAnnonce) {
                    this.dateA = this.datePipe.transform(this.annonces.dateAnnonce, 'EEEE d MMMM ');
                }
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.itineraires = a[2];
            }
        });
        this.trajetCEC();
    }


    trajetP() {
        this.mode = 2;
        this.annonceService.getAllWUAIAvFP(this.id).subscribe(data => {
            this.annoncesWUAIAv = data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                if (this.annonces.dateAnnonce) {
                    this.dateA = this.datePipe.transform(this.annonces.dateAnnonce, 'EEEE d MMMM ');
                }
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.utilisateurs.photo = sanitizedUrl;
                }
                this.itineraires = a[2];
            }
        });
    }

    trajetPEC() {
        this.mode = 2;
        this.annonceService.getAllWUAIAvFCEC(this.id).subscribe(data => {
            this.annoncesWUAIAvEC.push(data);
            if (this.annoncesWUAIAvEC) {
                this.getTrajets(this.annoncesWUAIAvEC);
            }
        });
    }

    trajetCEC() {
        this.mode = 2;
        this.annonceService.getAllWUAIAvFPEC(this.id).subscribe(data => {
            this.annoncesWUAIAvEC = data;
            if (this.annoncesWUAIAvEC) {
                this.getTrajets(this.annoncesWUAIAvEC);
            }
        });
    }

    getTrajets(d: any) {
        for (let a of d) {
            this.annoncesEC = a[0];
            if (this.annoncesEC.dateAnnonce) {
                this.dateA = this.datePipe.transform(this.annoncesEC.dateAnnonce, 'EEEE d MMMM ');
            }
            let p = a[1].photo;
            if (p != null) {
                let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.images = sanitizedUrl;
            }
            this.utilisateursEC = a[1];
            this.itinerairesEC = a[2];
            this.avisEC = a[3];
        }
    }

    getTrajet(d: any) {
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.avi = d[3];
    }

    /*********************** Annuler trajet *************/
    annuler(d: any) {
        this.mode = 3;
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.avi = d[3];
    }

    validerAnnulation() {

    }

    /*********************** Terminer trajet *************/
    terminer(d: any) {
        this.mode = 5;
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.avi = d[3];
        this.itineraireService.getOne(this.itineraire.idItineraire).subscribe(data => {
            this.itiner.confirmerDepart = true;
            this.itiner.confirmerArrivee = true;
        });
    }

    validerFin() {
        this.itineraireService.update(this.itiner).subscribe(res => {
            console.log(res);
            this.mode = 2;
        });
    }

    /*********************** Détails d'un trajet *************/
    details(d: any) {
        this.mode = 7;
        this.annoncesWUAIAv = d;
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        this.utilisateur = d[1];
        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.avi = d[3];
    }

    isC() {
        if (this.idTF && this.idTF == 1) {
            // console.log('************ Conducteur **************');
            return true;
        } else {
            return false;
        }
    }

    isP() {
        if (this.idTF && this.idTF == 2) {
            return true;
        } else {
            return false;
        }
    }


}
