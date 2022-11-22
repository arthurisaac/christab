import { Component, OnInit } from '@angular/core';
import {Storage} from "@ionic/storage";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  idTF: number;
  mode: number;

  constructor(
      private localStorage: Storage,
      private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.idTF = +localStorage.getItem('Role');
    this.mode = 1;
  }

  isAuthorised() {
    if(this.idTF == 1) {
      this.navCtrl.navigateForward('/home-conducteur');
    } else {
      this.navCtrl.navigateForward('/itineraire');
    }
  }

  goFaq() {
    // console.log(e);
      this.mode = 2;
  }

  goCu() {
    this.mode = 3;
  }

  backFaqAndCu() {
    this.ngOnInit();
  }

}
