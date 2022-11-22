import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {AvisService} from "../avis/avis.service";
import {AvisDto} from "../avis/avis.model";
import {InformationsSupplementairesService} from "./informations-supplementaires.service";
import {InformationsSupplementaires} from "./informations-supplementaires.model";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-informations-supplementaires',
  templateUrl: './informations-supplementaires.page.html',
  styleUrls: ['./informations-supplementaires.page.scss'],
})
export class InformationsSupplementairesPage implements OnInit {

  conducteur: string;
  subscription: Subscription;
  utilisateur: UtilisateurDto;
  infoSupps: InformationsSupplementaires;
  infoSupp: InformationsSupplementaires = new InformationsSupplementaires();
  avis: AvisDto;
  id: number = 0;
  idTF: number = 0;
  showConducteur: boolean = false;
  icone: any;

  constructor(
      private utilisateurService: UtilisateurService,
      private aviService: AvisService,
      private infoSuppService: InformationsSupplementairesService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.infoSuppService.getAll().subscribe(data=>{
      this.infoSupps = data;
    }, error => {
      console.log(error);
    });
    this.subscription = this.route.params.subscribe((params) => {
      if (params['d'] != null) {
        this.id = +atob(params['id']);
        console.log(this.id);
        this.getAll();
      } else {
        this.showConducteur = true;
      }
    });
  }

  backReservation() {
    this.router.navigate(['/reservation']);
  }

  getAll() {
    this.utilisateurService.getOne(this.id).subscribe(data=>{
      this.utilisateur = data;
    });

    this.infoSuppService.getAllByU(this.id).subscribe(data=>{
      this.infoSupps = data;
      let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.infoSupps.iconeInformationsSupplementaires);
      this.icone = sanitizedUrl;
    })

    this.aviService.getAllByU(this.id).subscribe(data=>{
      this.avis = data;
    })
  }

  save() {
    // console.log(this.infoSupp.iconeInformationsSupplementaires);
      this.infoSuppService.create(this.infoSupp).subscribe(res=>{
        console.log(res);
        this.ngOnInit();
      }, error => {
        console.log(error);
      });
  }

  edit(i: InformationsSupplementaires) {
      this.infoSuppService.getOne(i.idInformationsSupplementaires).subscribe(data=>{
        this.infoSupp = data;
        let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.infoSupp.iconeInformationsSupplementaires);
        this.icone = sanitizedUrl;
      });
  }

  update() {
    this.infoSuppService.update(this.infoSupp).subscribe(res=>{
      console.log(res);
    }, error => {
      console.log(error);
    })
  }

  delete(i:InformationsSupplementaires) {
    this.infoSuppService.delete(i.idInformationsSupplementaires).subscribe(data=>{
      this.infoSupp = data;
    });
  }

  /**************************** Pour charger les icônes ************************/
  uploadLibelleInfoSupp(e){
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload =  (e: any) => {
      this.icone = e.target.result;
      return this.infoSupp.iconeInformationsSupplementaires = e.target.result;
    };
    // console.log(this.infoSupp.iconeInformationsSupplementaires);
    reader.readAsDataURL(file);
    reader.onerror = function (error) {
    };
  }

}
