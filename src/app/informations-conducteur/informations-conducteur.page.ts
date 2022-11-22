import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Engin} from "../engin/engin.model";

@Component({
  selector: 'app-informations-conducteur',
  templateUrl: './informations-conducteur.page.html',
  styleUrls: ['./informations-conducteur.page.scss'],
})
export class InformationsConducteurPage implements OnInit {

  conducteur: string;
  subscription: Subscription;
  utilisateur: UtilisateurDto = new UtilisateurDto();
  engin: Engin = new Engin();
  id: number = 0;
  idTF: number = 0;

  constructor(
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      if (params['d'] != null) {
        this.id = +atob(params['id']);
      }
    });
  }

}
