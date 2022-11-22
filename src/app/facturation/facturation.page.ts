import { Component, OnInit } from '@angular/core';
import {NavController, PopoverController} from "@ionic/angular";
import {FilterDates, Paiement} from "../paiement/paiement.model";
import {PaiementService} from "../paiement/paiement.service";
import {Storage} from "@ionic/storage";
import {Annonce} from "../annonce/annonce.model";

@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.page.html',
  styleUrls: ['./facturation.page.scss'],
})
export class FacturationPage implements OnInit {

  paiement: Paiement = new Paiement();
  paiements: Paiement;
  filterDates: FilterDates = new FilterDates();
  dateA: string;
  mode: number;
  id: number = 0;
  idTF: number = 0;

  paiementWItin: Array<any> = [];
  annonce: Annonce = new Annonce();

  constructor(
      private paiementService: PaiementService,
      private popovertCtrl: PopoverController,
      private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = +localStorage.getItem('ID_User');
    this.idTF = +localStorage.getItem('Role');
    this.mode = 1;
    this.getAll();
  }

  isAuthorised() {
    if(this.idTF == 1) {
      this.navCtrl.navigateForward('/home-conducteur');
    } else {
      this.navCtrl.navigateForward('/itineraire');
    }
  }

  backDetails() {
    this.ngOnInit();
  }

  onSearchChangeSt(e:any) {
    // console.log(e);
    // console.log(e.target.value);
    if(e.target.name!= null && e.target.name.match('startDate')) {
      console.log(e.target.name);
      this.filterDates.startDate = e.target.value;
    }

  }

  getAll() {
    this.paiementService.getAllByU(this.id).subscribe(data=>{
      if(Array(data).length >0) {
        this.paiements = data;
      }
    })
  }

  onSearchChangeEd(e:any) {
    if(e.target.name!= null && e.target.name.match('endDate')) {
        console.log(e.target.name);
        this.filterDates.endDate = e.target.value;
        if(this.filterDates != null) {
          console.log('*********** Recherche entre deux dates **********');
          this.paiementService.getAllBetweenDates(this.filterDates).subscribe(data => {
            this.paiements = data;
          });
        }
      }
  }

  /********************** Détails de la ligne ****************/
  getRow(p: Paiement) {
    this.mode = 2;
    this.paiementService.getOne(p.idPaiement).subscribe(data =>{
      this.paiement = data;
    });
  }

  /********************* Recherche en fonction du tri ***************/

  async triView(e: MouseEvent) {
    // console.log(e);
    const popover =  await this.popovertCtrl.create({
      cssClass: 'my-popover-class',
      component: PopoverTriPage,
      event: e,
      backdropDismiss: true,
      translucent: true
    });
    popover.present();

    /******************************** Clique d'un élément du popover(liste déroulante) ************************************/
    return popover.onDidDismiss().then((res: any) => {
      let id = null;
      if (res.data != undefined) {
        // console.log(res.data);
        id = res.data;

        if (id == 1) {
          console.log('************* Par numéro facture ascendant ************');
          this.paiementService.getAllByNumAsc(this.id).subscribe(data => {
            this.paiements = data;
          });
        } else if (id == 2) {
          console.log('************* Par numéro facture descendant ************');
          this.paiementService.getAllByNumDesc(this.id).subscribe(data => {
            this.paiements = data;
          });
        } else {
          if (id == 3) {
            console.log('************* Par date ascendante ************');
            this.paiementService.getAllByPaiementDateDesc(this.id).subscribe(data => {
              this.paiements = data;
            });
          } else if (id == 4) {
            console.log('************* Par date descendante ************');
            this.paiementService.getAllByPaiementDateAsc(this.id).subscribe(data => {
              this.paiements = data;
            });
          } else {
            if (id == 5) {
              console.log('************* Par montant facture ascendant ************');
              this.paiementService.getAllByPaiementPriceAsc(this.id).subscribe(data => {
                this.paiements = data;
              });
            } else {
              console.log('************* Par montant facture descendant ************');
              this.paiementService.getAllByPaiementPriceDesc(this.id).subscribe(data => {
                this.paiements = data;
              });
            }

          }
        }
      }
    });

  }
}

@Component({
  selector: 'app-facturation',
  styleUrls: ['./facturation.page.scss'],
  template: `<ion-list *ngFor="let t of typeFiltre">
      <ion-item [id]="t?.id" (click)="getFilter($event)">{{t?.val}}</ion-item>
      </ion-list>`

})
export class PopoverTriPage {
  typeFiltre = [{id:1, val:'N° de facture: ascendant'}, {id:2, val:'N° de facture: descendant'},
    {id:3, val:'Date: du plus recent au plus ancien'}, {id:4, val:'Date: du plus ancien au plus recent'},
    {id:5, val:'Montant: ascendant'}, {id:6, val:'Montant: descendant'}];

  constructor(
      private popover: PopoverController
  ) {
  }

  getFilter(e) {
    this.popover.dismiss(e.target.id);
  }

}
