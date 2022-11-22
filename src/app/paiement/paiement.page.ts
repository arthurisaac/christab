import { Component, OnInit } from '@angular/core';
import {Paiement} from "./paiement.model";
import {PaiementService} from "./paiement.service";
import {LoginService} from "../login/login.service";
import {AuthenticationService} from "../authentication.service";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.page.html',
  styleUrls: ['./paiement.page.scss'],
})
export class PaiementPage implements OnInit {

  id: number = 0;
  idTF: number = 0;
  mode: number;
  paiement: Paiement = new Paiement();
  paiements: Paiement;
  checked: boolean = false;


  constructor(
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController,
      private paiemenentService: PaiementService,
      private loginService: LoginService,
      private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.mode = 1;
    this.id = +localStorage.getItem('ID_User');
    this.idTF = +localStorage.getItem('Role');
    if(this.isAuthenticated() && this.authService.isUser()) {
      this.getAllByU(this.id);
    } else {
      this.getAll();
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  /* ============================== Liste ou affichage ============================== */
  getAll() {
    this.paiemenentService.getAll().subscribe(data=>{
      this.paiements = data;
    });
  }

  getAllByU(id: number) {
    this.paiemenentService.getOne(id).subscribe(data=>{
      if(data) {
        this.paiements = data;
      }
    });
  }

  /********************** Procédure du paiement *************/
  getChecked(e:any) {
    // console.log(e);
    if(e.target.value != null) {
      this.checked = true;

    } else {
      this.checked = false;
    }
  }

  nextSecondEtape() {
    this.mode = 2;
  }

  nextThirdEtape() {
    this.mode = 3;
  }

  nextFourthEtape() {
    this.mode = 4;
  }

  backFirstEtape(){
    this.mode = 1;
  }

  backSecondEtape(){
    this.mode = 2;
  }

  backThirdEtape(){
    this.mode = 3;
  }


  /* ============================ Création =============================== */
  add(){
    this.mode = 2;
  }

  async save() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Création en cours...'
    });
    await loading.present();
    this.paiement.idUtilisateur = this.id;
    this.paiemenentService.create(this.paiement).subscribe(async res => {
      await loading.dismiss();
      this.ngOnInit();
      console.log(res);
    }, async error => {
      await loading.dismiss();
      console.log(error);
    });
  }

  /* ============================ Edition ============================ */
  edit(p: Paiement){
    this.mode = 3;
    this.paiemenentService.getOne(p.idPaiement).subscribe(data=>{
      this.paiement = data;
    });
  }

  async update() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Modification en cours...'
    });
    await loading.present();
    this.paiemenentService.update(this.paiement).subscribe(async res => {
      await loading.dismiss();
      this.ngOnInit();
    }, async error => {
      await loading.dismiss();
      console.log(error)
    });
  }

  /* ================================= Suppression ===================== */
  async delete(p: Paiement) {
      let alert = await this.alertCtrl.create({
        header: 'Confirmer la suppression',
        message: 'Voulez-vous supprimer ce paiement?',
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
              this.paiemenentService.delete(p.idPaiement).subscribe(res =>{
                this.ngOnInit();
              });
            }
          }
        ]
      });
      await alert.present();
  }

}
