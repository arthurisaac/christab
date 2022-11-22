import { Component, OnInit } from '@angular/core';
import {Annonce, UserAnnonce} from "../annonce/annonce.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {Engin} from "../engin/engin.model";
import {Recherche} from "./recherche.model";
import {RechercheService} from "./recherche.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {DatePipe} from "@angular/common";
import {AlertController} from "@ionic/angular";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.page.html',
  styleUrls: ['./recherche.page.scss'],
})
export class RecherchePage implements OnInit {

  mode: number;
    id: number = 0;
    idTF: number = 0;
  recherche: Recherche;
  annonces: Annonce;
  annonce: Annonce;
  itineraire: Itineraire;
  engin: Engin;
  annoncesWUAIAv: Array<any> = [];
    demandesWUAIAv: Array<any> = [];
  typeEngins:Array<any> = [{id:1, val:"Auto"}, {id:2, val:"Moto"}];
  PlaceA:Array<any> = [{val:1}, {val:2}, {val:3}, {val:4}, {val:5}, {val:6}, {val:7}, {val:8}, {val:9}, {val:10}];
  PlaceM:Array<any> = [{val:1}, {val:2}];
  place: number; dep: String; arr: String;
  icones: any;
  infoSup: InformationsSupplementaires;
 annonceDetails: any;
  uai: UserAnnonce = new UserAnnonce();
  showIconesInfoSupp: boolean = false;
  showButtons: number;
  dateD: string; dateAr: string; heureD: string; heureAr: string; motD: string; motA: string; prix: number;
  enableRadioD1: boolean = false; enableRadioD2: boolean = false; enableRadioA1: boolean = false; enableRadioA2: boolean = false;
  enableSmoke: boolean = false; enableNSmoke: boolean =false;
  enableSpring: boolean = false; enableNSpring: boolean =false;
  enableAnimal: boolean = false; enableNAnimal: boolean =false;

    /****** Recherche ******/
    totalFiltre: number = 0;
    dateDep: boolean = false; dateArr: boolean = false;
    choixA: string = 'A'; showA: boolean = false;
    choixM: string = 'M'; showM: boolean = false;
    choixU: string = 'U'; showU: boolean = false;
    choixV: string = 'V'; showV: boolean = false;
    eng: string; voyage: string;
    subscription: Subscription;

    days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sept', 'Oct', 'Nov', 'Dec'];
    hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    doneBtn = 'Ok';
    backBtn = 'Retour';

  constructor(
      private alertCtrl: AlertController,
      private rechercheService: RechercheService,
      private datePipe: DatePipe,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initialise();
    this.id = +localStorage.getItem('ID_User');
    this.idTF = +localStorage.getItem('Role');
    this.annonce = new Annonce();
    this.itineraire = new Itineraire();
    this.engin = new Engin();
    this.mode = 1;
    this.totalFiltre = 0;

    this.subscription = this.route.params.subscribe((params) => {
          if (params['a'] != null && params['d'] != null) {
              this.eng = params['a'];
              this.voyage = params['d'];
          }
      });
      /*********************************** Ajout de trajet auto urbain ******************************************/
      if (this.eng.match(this.choixA) && this.voyage.match(this.choixU)) {
          // console.log('********** Urbain Auto **********');
          this.showA = true;
          this.showU = true;
      }
      /*********************************** Ajout de trajet auto voyage ******************************************/
      else {
          if (this.eng.match(this.choixA) && this.voyage.match(this.choixV)) {
              // console.log('********** Voyage Auto ************');
              this.showA = true;
              this.showV = true;
          } else {
              /*********************************** Ajout de trajet moto urbain ******************************************/
              if ((this.eng.match(this.choixM)) && (this.voyage.match(this.choixU))) {
                  // console.log('********* Urbain Moto *********');
                  this.showU = true;
                  this.showM = true;
              }
              /*********************************** Ajout de trajet moto voyage ******************************************/
              else {
                  // console.log('********** Voyage Moto ***********');
                  this.showV = true;
                  this.showM = true;
              }
          }
      }
  }


    backRecherche() {
        this.mode = 1;
    }

    nextRecherche() {
        this.mode = 2;
    }

  ajouter(){
  }

  /* ========================== Pour récupérer la sélection du  type d'engin =========================== */
  selectRTE(e:any) {
    // console.log(e.detail);
    if(e.detail.value.match('Auto')) {
      // console.log('*********** Auto ********');
      this.place = 1;
    }
    else {
      // console.log('*********** Moto ********');
      this.place = 2;
    }
    this.engin.typeEngin = e.target;
    // console.log(this.engin.typeEngin);
  }

  showInfoSupp() {
    this.router.navigate(['/informations-supplementaires']);
  }

  /*************************************************==== Recherche ====*********************************************/

  /***************** Pour ré-initialiser les champs ************/
  initialise() {
    this.recherche = new Recherche();
    this.dateD = null;
    this.dateAr = null;
    this.heureD = null;
    this.heureAr = null;
    this.motD = null;
    this.motA = null;
    this.prix = null;
    this.enableRadioD1 = false;
    this.enableRadioD2 = false;
    this.enableRadioA1 = false;
    this.enableRadioA2 = false;
    this.enableSpring = false;
    this.enableNSpring = false;
    this.enableSmoke = false;
    this.enableNSmoke = false;
    this.enableAnimal = false;
    this.enableNAnimal = false;
    this.totalFiltre = 0;
    this.dateDep = false;
    this.dateArr = false;

  }

  //pour récupérer la valeur du nombre de place
  selectRP(e:any) {
      if(e.detail.value >0) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
      }
    // console.log(e);
    // console.log(e.detail.value);
    this.recherche.nombrePersonne = e.detail.value;
  }

  getCityD(e:any) {
    // console.log(e)
    if(e.target.value == 1) {
        this.enableRadioD1 = false;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    } else {
      this.recherche.lieuDepart = null;
      this.enableRadioD1 = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
  }

  getCityA(e:any) {
    // console.log(e)
    if(e.target.value == 1) {
      this.enableRadioA1 = false;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    } else {
      this.recherche.lieuArrivee = null;
      this.enableRadioA1 = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
  }

  //pour récupérer la valeur du prix de la place
  getPrice(e: any) {
      if(e.target.value >0) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
      }
    // console.log(e.target.value);
    this.recherche.prix = e.target.value;
    this.prix = e.target.value;
  }

  // pour récupérer les critères (type de bagages, voiture fumeur/non, climatisée/non, animaux autorisés/non)
  getBag(e: any) {
    // console.log(e.target.value);
    if(e.target.value == 1) {
      this.recherche.codeInformationsSupplementaires1 = 3;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    else {
      this.recherche.codeInformationsSupplementaires1 = 4;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    return this.recherche.codeInformationsSupplementaires1;
  }

  getSmoke(e: any) {
    // console.log(e.target.name);
    if(e.target.name.match('smoke')) {
      this.recherche.codeInformationsSupplementaires2 = 7;
      this.enableNSmoke = false;
        this.enableSmoke = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    else {
      this.enableSmoke = false;
        this.enableNSmoke = true;
      this.recherche.codeInformationsSupplementaires2 = 8;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    return this.recherche.codeInformationsSupplementaires2;
  }

  getSpring(e: any) {
    // console.log(e.target.name);
    if(e.target.name.match('spring')) {
      this.recherche.codeInformationsSupplementaires3 = 15;
      this.enableNSpring = false;
        this.enableSpring = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    else {
      this.enableSpring = false;
        this.enableNSpring = true;
      this.recherche.codeInformationsSupplementaires3 = 16;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    return this.recherche.codeInformationsSupplementaires3;
  }

  getAnimal(e: any) {
    // console.log(e.target.name);
    if(e.target.name.match('animal')) {
      this.recherche.codeInformationsSupplementaires3 = 5;
      this.enableNAnimal = false;
        this.enableAnimal = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    else {
      this.recherche.codeInformationsSupplementaires3 = 6;
      this.enableAnimal = false;
        this.enableNAnimal = true;
        this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
    }
    return this.recherche.codeInformationsSupplementaires3;
  }

  getWordD(e: any) {
    // console.log(e);
    this.motD = e.target.value;
  }

  getWordA(e: any) {
    // console.log(e);
    this.motA = e.target.value;
  }

  getDateDep(e: any) {
      if(e.target.value != null) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
          this.dateDep = true;
      }
    // console.log(this.datePipe.transform(e.target.value, 'yyyy-MM-dd'));
    this.recherche.dateDepart = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
    return this.dateD = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
  }

    allAdresseD(e: any) {
        if(e.target.value == 2) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateDep = false;
            this.recherche.dateDepart = null;
            this.dateD = null;
        }
    }

    allAdresseA(e: any) {
        if(e.target.value == 2) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateArr = false;
            this.recherche.dateArrivee = null;
            this.dateAr = null;
        }
    }

  getDateAr(e: any) {
      if(e.target.value != null) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
          this.dateArr = false;
      }
    this.recherche.dateArrivee = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
    return this.dateAr = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
  }

  getHeureDep(e: any) {
      if(e.target.value != null) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
      }
    // console.log(this.datePipe.transform(e.target.value, 'HH:mm'));
    this.recherche.heureDepart = this.datePipe.transform(e.target.value, 'HH:mm');
    return this.heureD = this.datePipe.transform(e.target.value, 'HH:mm');
  }

  getHeureAr(e: any) {
      if(e.target.value != null) {
          this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
      }
    this.recherche.heureArrivee = this.datePipe.transform(e.target.value, 'HH:mm');
    return this.heureAr = this.datePipe.transform(e.target.value, 'HH:mm');
  }

  async failRechercheAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Résultat',
      message: 'Aucun résultat ne correspond à votre demande, veuillez consulter la liste des demandes disponibles',
      translucent: true,
      animated: true,
      buttons: [{
        text: 'Ok',
        handler: (data) => {
        }
      }]
    });
    await alert.present();
  }

  /**************************** Recherche en fonction des filtres *****************/

  /***** Recherche d'un trajet en tant que passager *****/
  rechercher(){
    console.log(this.recherche);
    this.rechercheService.getAllDWFilters(this.recherche).subscribe(data =>{
      if(data.length>0) {
        this.demandesWUAIAv = data;
        console.log(this.demandesWUAIAv);
        let navigationExtras: NavigationExtras = { state: { demandesWUAIAv: this.demandesWUAIAv } };
        this.router.navigate(['/demande'], navigationExtras);
      } else {
          let navigationExtras: NavigationExtras = { state: { demandesWUAIAv: this.demandesWUAIAv } };
        this.failRechercheAlert();
          this.router.navigate(['/demande'], navigationExtras);
      }
    });
  }

}
