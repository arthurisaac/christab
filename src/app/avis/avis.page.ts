import { Component, OnInit } from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from "@ionic/angular";
import {LoginService} from "../login/login.service";
import {AuthenticationService} from "../authentication.service";
import {AvisService} from "./avis.service";
import {AvisDto} from "./avis.model";
import {ActivatedRoute} from "@angular/router";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {TypeAvis} from "../type-avis/type-avis.model";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-avis',
  templateUrl: './avis.page.html',
  styleUrls: ['./avis.page.scss'],
})
export class AvisPage implements OnInit {

  id: number = 0;
  idTF: number = 0;
  avi: AvisDto = new AvisDto();
  avis: AvisDto;
  typeAvi: TypeAvis = new TypeAvis();
  typeAvis: TypeAvis;
  typeAs = [];

  typeAvs: TypeAvis[] = []
    mode: number;
  data: any;
  utilisateur: UtilisateurDto;
  rate: number; rateF: number = 0; rateR: number = 0; rateN: number = 0;
  dateA = new Date();
  colored: number = 0;

  constructor(
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController,
      private navCtrl: NavController,
      private avisService: AvisService,
      private typeAvisService: TypeAvisService,
      private loginService: LoginService,
      public datepipe: DatePipe,
      private authService: AuthenticationService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = +localStorage.getItem('ID_User');
    this.idTF = +localStorage.getItem('Role');
    this.mode = 1;
    this.typeAvs = this.typeAvisService.typeavis;
      this.getAll();
    this.data = atob(this.route.snapshot.paramMap.get('data')); // atob() permet de décoder le paramètre encodé
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  isAuthorised() {
    if(this.idTF == 1) {
      this.navCtrl.navigateForward('/home-conducteur');
    } else {
      this.navCtrl.navigateForward('/itineraire');
    }
  }

  /* ============================== Liste ou affichage ============================== */
  getAll() {
    this.avisService.getAll().subscribe(data=>{
      this.avis = data;
    });

    this.typeAvisService.getAll().subscribe(data=>{
      this.typeAvis = data;
    });

  }

  getAllByU(id: number) {
    this.avisService.getOne(id).subscribe(data=>{
      this.avis = data;
    });
  }

  /********************** Get stars *****************/
  onRate(e: any, r) {
    console.log(e);
    if(r != null) {
      this.rate = r;
    } else {
      this.rate = 0;
    }
  }

  initialize() {
    this.rateF = 0;
    this.rateR = 0;
    this.rateN = 0;
    this.avi = new AvisDto();
    this.typeAvi = new TypeAvis();
  }

    onRateF(e: any, r, note) {
      // console.log(e);
        // console.log(r);
        if(note != 0) {
            this.rateF = note;
            // console.log(this.avi.note);
        } else {
            this.rateF = 0;
        }
      let t  = {val1: r, val2: note};
        // console.log(t);
        return this.typeAs.push(t);

    }

    onRateR(e: any, r, note) {
      // console.log(e);
        // console.log(r);
        if(note != 0) {
            this.rateR = note;
          // console.log(this.avi.note);
        } else {
            this.rateR = 0;
        }
      let t  = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    onRateN(e: any, r, note) {
      // console.log(e);
        // console.log(r);
        if(note != 0) {
            this.rateN = note;
          // console.log(this.avi.note);
        } else {
            this.rateN = 0;
        }
      let t  = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

  /* ============================ Création =============================== */
  add(){
    this.mode = 2;
  }

  async echecSaveAvis() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Echec',
      subHeader: "Enregistrement échouée",
      message: "Votre avis n'a pas pu être enregistré, veuillez re-essayer plutard!",
      buttons: ['OK']
    });

    await alert.present();
  }

  async save() {
    this.avi.dateAvis = this.datepipe.transform(this.dateA, 'yyyy-MM-dd');
    this.avi.idUtilisateur = this.id;
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Enregistrement en cours...',
      // duration: 2000
    });


    /********** Enregistrement des avis *********/

    await loading.present();
    this.avi.idUtilisateur = this.id;

    this.avisService.create(this.avi).subscribe(result => {

      console.log(result);
      /******** Enregistrement des libellés concernant les avis **********/
      if(this.typeAs.length > 0) {
        for (let t of this.typeAs) {
          /*console.log(t);
          console.log(t.val1);*/
          let res = this.typeAvs.find(ta => ta.idTypeAvis == t.val1);
          this.typeAvi.libelleTypeAvis = res.libelleTypeAvis;
          this.typeAvi.idAvis = result.body.idAvis;
          this.typeAvi.note = t.val2;
          this.typeAvisService.create(this.typeAvi).subscribe(resp=> {
            console.log(resp);
            loading.dismiss();
            this.mode = 2;
            this.initialize();
          });
        }
      }  else {
        loading.dismiss();
        this.mode = 2;
        this.initialize();
      }
        // console.log(this.typeAvi);
      // console.log(result);
    }, error => {
      loading.dismiss();
      this.echecSaveAvis();
      console.log(error);
    });
  }

  /* ============================ Edition ============================ */
  edit(a: AvisDto){
    this.mode = 3;
    this.avisService.getOne(a.idAvis).subscribe(data=>{
      this.avi = data;
    });
  }

  async update() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Modification en cours...'
    });
    await loading.present();
    this.avisService.update(this.avi).subscribe(async res => {
      await loading.dismiss();
      this.ngOnInit();
    }, async error => {
      await loading.dismiss();
      console.log(error)
    });
  }

  /* ================================= Suppression ===================== */
  async delete(a: AvisDto) {
    let alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous supprimer cet avis?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            console.log('Cancel confirmed');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            console.log('Oui');
            this.avisService.delete(a.idAvis).subscribe(res =>{
              this.ngOnInit();
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
