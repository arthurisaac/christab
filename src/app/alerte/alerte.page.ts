import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Alerte} from "./alerte.model";
import {AlerteService} from "./alerte.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {LoginService} from "../login/login.service";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-alerte',
  templateUrl: './alerte.page.html',
  styleUrls: ['./alerte.page.scss'],
})
export class AlertePage implements OnInit {

  alertes: Alerte;
  alerte: Alerte = new Alerte();
  id: number = 0;
  idTF: number = 0;
  mode: number;

  constructor(
      private loadingCtrl: LoadingController,
      private alertCtrl: AlertController,
      private alerteService: AlerteService,
      private loginService: LoginService,
      private authService: AuthenticationService,
      private geolocation: Geolocation
  ) { }

  ngOnInit() {
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
    this.alerteService.getAll().subscribe(data=>{
      this.alertes = data;
    });
  }

  getAllByU(id: number) {
    this.alerteService.getOne(id).subscribe(data=>{
      this.alertes = data;
    });
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
    this.geolocation.getCurrentPosition().then((resp) => {
      // récupération des coordonnées géographiques(latitude et longitude) de la position actuelle
      this.alerte.latitude = resp.coords.latitude;
      this.alerte.longitude = resp.coords.longitude;
      this.alerte.idUtilisateur = this.id;
      this.alerteService.create(this.alerte).subscribe(res => {
        loading.dismiss();
          console.log(res);
          this.ngOnInit();
      });
    }).catch((error) => {
      console.log('Error getting location', error);
      this.alerte.latitude = 0;
      this.alerte.longitude = 0;
      this.alerte.idUtilisateur = this.id;
      this.alerteService.create(this.alerte).subscribe(res => {
        loading.dismiss();
          console.log(res);
          this.ngOnInit();
      });

    });
  }

  /* ============================ Edition ============================ */
  edit(a: Alerte){
    this.mode = 3;
    this.alerteService.getOne(a.idAlerte).subscribe(data=>{
      this.alerte = data;
    });
  }

  async update() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Modification en cours...'
    });
    await loading.present();
    this.alerteService.update(this.alerte).subscribe(async res => {
      await loading.dismiss();
        this.ngOnInit();
    }, async error => {
      await loading.dismiss();
      console.log(error)
    });
  }

  /* ================================= Suppression ===================== */
  async delete(a: Alerte) {
    let alert = await this.alertCtrl.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous supprimer cette alerte?',
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
            this.alerteService.delete(a.idAlerte).subscribe(res =>{
              this.ngOnInit();
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
