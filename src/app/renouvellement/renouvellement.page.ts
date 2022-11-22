import { Component, OnInit } from '@angular/core';
import {
  AdditionnalInfos,
  COMMAND, CommandDto,
  PaiementService,
  TouchCustomDto,
  TouchMoovCallBackRequestDto
} from "../paiement/paiement.service";
import {Paiement} from "../paiement/paiement.model";
import {AlertController, LoadingController, MenuController, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {LoginService} from "../login/login.service";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {UtilisateurService} from "../utilisateur/utilisateur.service";

@Component({
  selector: 'app-renouvellement',
  templateUrl: './renouvellement.page.html',
  styleUrls: ['./renouvellement.page.scss'],
})
export class RenouvellementPage implements OnInit {

  id: number = 0;
  idTF: number = 0;
  val: string; valI: string = 'I';
  increment: number = 0;
  mode: number;
  prix: number = 0;
  showBtn: boolean = false; errorCustomer: string; errorOtp: string;
  checkO: boolean = false; checkM: boolean = false; checkedO: boolean = false; checkedM: boolean = false;
  modePaiement: number = 0;
  paiement: Paiement = new Paiement();
  customer:  CommandDto = new CommandDto();
  touchCustom: TouchCustomDto = new TouchCustomDto();
  customMoov: TouchMoovCallBackRequestDto = new TouchMoovCallBackRequestDto();
  utilisateurRecipient: UtilisateurDto;

  constructor(
      private toastCtrl: ToastController,
      private alertCtrl: AlertController,
      private loadingCtrl: LoadingController,
      private menuCtrl: MenuController,
      private paiementService: PaiementService,
      private loginService: LoginService,
      private utilisateurService: UtilisateurService,
      private datePipe: DatePipe,
      private router: Router,
      private route: ActivatedRoute
  ) {
    this.menuCtrl.enable(false, 'first');
  }

  ngOnInit() {
    this.id = +localStorage.getItem('ID_User');
    this.idTF = +localStorage.getItem('Role');
    this.val = this.route.snapshot.paramMap.get('d');
    // console.log(this.val);
    if(this.val === this.valI) {
      this.mode = 3;
    } else {
      this.mode = 1;
    }

    this.touchCustom.additionnalInfos = new AdditionnalInfos();
    this.utilisateurService.getOne(this.id).subscribe(res=>{
      this.utilisateurRecipient = res;
      this.touchCustom.additionnalInfos.recipientEmail = this.utilisateurRecipient.email;
      this.touchCustom.additionnalInfos.recipientFirstName = this.utilisateurRecipient.prenom;
      this.touchCustom.additionnalInfos.recipientLastName = this.utilisateurRecipient.nom;
    });
  }

  selectType(e: any) {
    console.log(e.target.value);
    if(e.target.value == 1) {
      this.prix = 1000;
      this.paiement.montantPaiement = 1000;
    } else if(e.target.value == 2) {
      this.prix = 500;
      this.paiement.montantPaiement = 500;
    } else {
        this.prix = 1500;
        this.paiement.montantPaiement = 1500;
    }
  }

  nextPaiement() {
    if (this.modePaiement == 1) {
      this.mode = 2;
    } else if(this.modePaiement == 2) {
      this.saveMoov();
    }
  }

  nextPaiementI() {
    if (this.modePaiement == 1) {
      this.mode = 4;
    } else if(this.modePaiement == 2) {
      this.saveMoov();
    }
  }

  backGererProfil(){
    this.router.navigate(['/utilisateur', 'R']);
  }

  backPaiement() {
    this.mode = 1;
  }

  backPaiementI() {
    this.mode = 3;
  }



  getNumberOrange(e: any) {
    // console.log(e.target.value);
    if(e.target.value.length != 8) {
      this.showBtn = false;
      this.errorCustomer = 'Le numéro est incorrecte';
    } else {
      this.showBtn = true;
    }
  }

  getOtp(e: any) {
    if(e.target.value.length != 6) {
      this.showBtn = true;
      this.errorOtp = 'Le champ doit comporter 6 caractères';
    } else {
      this.showBtn = false;
    }
  }

  getOrange(e: any) {
    // console.log(e.target.value);
    if(e.target.checked) {
      this.checkO = true;
      this.checkedM = true;
    }
    else {
      this.checkO = false;
      this.checkedM = false;
    }
    return this.modePaiement = e.target.value;
  }

  getMobicash(e: any) {
    console.log(e.target.value);
    if(e.target.checked) {
      this.checkM = true;
      this.checkedO = true;
    }
    else {
      this.checkM = false;
      this.checkedO = false;
    }
    return this.modePaiement = e.target.value;
  }

  async showSuccessToastRenouvellement() {
    const toast = await this.toastCtrl.create({
      message: 'Renouvellement effectué avec succès',
      color: "success",
      duration: 2000,
      position: "middle"
    });
    await toast.present();
  }

  async showFailToastRenouvellement() {
    const toast = await this.toastCtrl.create({
      message: 'Echec du renouvellement',
      color: "danger",
      duration: 2000,
      position: "middle"
    });
    await toast.present();
  }

  async showSuccessToastInscription() {
    const toast = await this.toastCtrl.create({
      message: 'Inscription effectuée avec succès',
      color: "success",
      duration: 2000,
      position: "middle"
    });
    await toast.present();
  }

  async showFailToastInscription() {
    this.increment = this.increment+1;
    if (this.increment <= 5) {
      const toast = await this.toastCtrl.create({
        message: "Echec de l'Inscription, veuillez re-essayer",
        color: "danger",
        duration: 2000,
        position: "middle"
      });
      await toast.present();
    } else {
        const alert = await this.alertCtrl.create({
          cssClass: 'my-custom-classF',
          header: 'Echec',
          subHeader: "Inscription échouée",
          message: "Après 5 tentatives, veuillez ré-essayer plutard",
          buttons: [
            {
              text: '',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Ok',
              handler: () => {
                console.log('Ok appuyé');
                this.loginService.logout();
                this.router.navigateByUrl('/login').then((res)=>{
                  window.location.reload();
                });
              }
            }
          ]
        });

        await alert.present();
    }

  }

  loadDataOrange() {
    /*this.touchCustom.recipientNumber = this.paiement.numeroClient.toString();
    this.touchCustom.idUtilisateur = this.id;
    this.touchCustom.additionnalInfos.destinataire = this.paiement.numeroClient.toString();
    this.touchCustom.additionnalInfos.otp = this.paiement.codeOtp.toString();*/
    this.customer.customer_msisdn = this.paiement.numeroClient.toString();
    this.customer.amount = this.paiement.montantPaiement;
    this.customer.otp = this.paiement.codeOtp;
    this.customer.idUtilisateur = this.id;
  }

  async inscrire() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter svp...'
    })
    await loading.present();
    this.loadDataOrange();
    // this.touchCustom.amount = this.paiement.montantPaiement;
    this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
    this.paiement.adhesion = true;
    this.paiement.idUtilisateur = this.id;
    console.log(this.paiement);
      console.log('******* Paiement par Orange ********');
      this.paiementService.createOrange(this.customer).subscribe(res => {
        console.log(res);
          // if(res.status == 200 && res.body.status.includes('SUCCESSFUL')) {
         if (res.status == 200 && res.body == 200) {
      /********** Enregistrement du paiement **********/
      this.paiementService.create(this.paiement).subscribe(res => {
        // console.log(res);
        if(res.status == 200) {
          loading.dismiss();
          this.router.navigate(['/home-conducteur']);
          this.touchCustom = new TouchCustomDto();
          this.paiement = new Paiement();
          this.showSuccessToastInscription();
        } else {
          loading.dismiss();
          this.showFailToastInscription();
        }
      },error => {
        loading.dismiss();
        this.showFailToastInscription();
      });
      }
      else {
        console.log(res.status);
            loading.dismiss();
            this.showFailToastInscription();
      }

    },error => {
        loading.dismiss();
        this.showFailToastInscription();
      });

  }

  async save() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter svp...'
    })
    await loading.present();
    this.loadDataOrange();
    this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
    this.paiement.renouveler = true;
    this.paiement.idUtilisateur = this.id;
    this.touchCustom.amount = this.paiement.montantPaiement;
    console.log(this.paiement);
      console.log('******* Paiement par Orange ********');
    this.paiementService.createOrange(this.customer).subscribe(res => {
      console.log(res);
      if (res.status == 200 && res.body == 200) {
          /********** Enregistrement du paiement **********/
          this.paiementService.create(this.paiement).subscribe(res => {
            // console.log(res);
            if (res.status == 200) {
              loading.dismiss();
              this.router.navigate(['/utilisateur', 'R']);
              this.touchCustom = new TouchCustomDto();
              this.paiement = new Paiement();
              this.showSuccessToastRenouvellement();
            } else {
              loading.dismiss();
              this.showFailToastRenouvellement();
            }
          }, error => {
            loading.dismiss();
            this.showFailToastRenouvellement();
          });
        } else {
          console.log(res.status);
          loading.dismiss();
          this.showFailToastRenouvellement();
        }

      }, error => {
        loading.dismiss();
        this.showFailToastRenouvellement();
      });


  }

  loadData() {
    this.touchCustom.recipientNumber = this.paiement.numeroClient.toString();
    this.touchCustom.amount = this.paiement.montantPaiement;
    this.touchCustom.idUtilisateur = this.id;
    this.touchCustom.additionnalInfos.destinataire = this.paiement.numeroClient.toString();
  }

  async saveMoov() {
    console.log(this.modePaiement);
    this.loadData();
    console.log(this.touchCustom);
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter svp...'
    });
    await loading.present();
    console.log('******* Paiement par Moov ********');
    this.paiementService.touchMoov(this.touchCustom).subscribe(res => {
      console.log(res);
      if (res.status == 200 && res.body.status.includes('INITIATED')) {
        this.customMoov.amount = res.body.amount;
        this.customMoov.partnerTransactionId = res.body.idFromClient;
        loading.dismiss();
        this.mode = 21;
      }
      else {
        loading.dismiss();
        console.log(res.status);
        this.showFailToastInscription();
      }

    }, error => {
      loading.dismiss();
      this.showFailToastInscription();
    });

  }

  async finaliserMoovTransaction() {
    this.customMoov.idUtilisateur = this.touchCustom.idUtilisateur;
    console.log(this.customMoov);
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter svp...'
    });
    await loading.present();
    console.log('******* Finalisation paiement par Moov ********');
    this.paiementService.touchMoovCallBack(this.customMoov).subscribe(res => {
      if (res.status == 200 && res.body.status.includes('SUCCESSFUL')) {
          /********** Enregistrement du paiement **********/
          this.paiementService.create(this.paiement).subscribe(res => {
            // console.log(res);
            if (res.status == 200) {
              loading.dismiss();
              this.router.navigate(['/home-conducteur']);
              this.touchCustom = new TouchCustomDto();
              this.paiement = new Paiement();
              this.showSuccessToastInscription();
            } else {
              loading.dismiss();
              this.showFailToastInscription();
            }
          }, error => {
            loading.dismiss();
            this.showFailToastInscription();
          });
      } else {
        loading.dismiss();
        console.log(res.status);
        this.showFailToastInscription();
      }
    }, error => {
      loading.dismiss();
      this.showFailToastInscription();
    })
  }

  logOut() {
    this.loginService.logout();
    localStorage.clear();
    this.router.navigate(['home']).then((res) => {
      location.reload();
    });
  }
}
