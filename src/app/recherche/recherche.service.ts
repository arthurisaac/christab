import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {Recherche} from "./recherche.model";
import {AWfilter} from "../annonce/annonce.model";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class RechercheService {

  /*urlRechercheAFiltre = 'https://christab.herokuapp.com/api/findAnnoncesByFilters';
  urlRechercheDFiltre = 'http://christab.herokuapp.com/api/findDemandesByFilters';*/

  /*urlRechercheAFiltre = 'http://localhost:8082/api/findAnnoncesByFilters';
  urlRechercheDFiltre = 'http://localhost:8082/api/findDemandesByFilters';*/

  urlRechercheAFiltre = this.urls.urlUsedRes+'api/findAnnoncesByFilters';
  urlRechercheDFiltre = this.urls.urlUsedRes+'api/findDemandesByFilters';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Getting All annonces by filters ==================== */
  getAllByFilters(r: Recherche) {
    return this.http.post<any>(this.urlRechercheAFiltre, r, {headers:this.authService.getHeader()});
  }

  getAllWFilters(r: Recherche){
    let af = new AWfilter();
    af.d = r.depart;
    af.a = r.destination;
    af.ld =r.lieuDepart;
    af.la = r.lieuArrivee;
    af.np = r.nombrePersonne;
    af.hd = r.heureDepart;
    af.ha = r.heureArrivee;
    af.dd = r.dateDepart;
    af.da = r.dateArrivee;
    af.te = r.typeEngin;
    af.tv = r.typeVoyage;
    af.idIS1 = r.codeInformationsSupplementaires1;
    af.idIS2 = r.codeInformationsSupplementaires2;
    af.idIS3 = r.codeInformationsSupplementaires3;
    af.idIS4 = r.codeInformationsSupplementaires4;
    return this.http.post<any>(this.urlRechercheAFiltre, af, {headers:this.authService.getHeader()});
  }

  getAllDWFilters(r: Recherche){
    let af = new AWfilter();
    af.d = r.depart;
    af.a = r.destination;
    af.ld =r.lieuDepart;
    af.la = r.lieuArrivee;
    af.np = r.nombrePersonne;
    af.hd = r.heureDepart;
    af.ha = r.heureArrivee;
    af.dd = r.dateDepart;
    af.da = r.dateArrivee;
    af.te = r.typeEngin;
    af.tv = r.typeVoyage;
    af.idIS1 = r.codeInformationsSupplementaires1;
    af.idIS2 = r.codeInformationsSupplementaires2;
    af.idIS3 = r.codeInformationsSupplementaires3;
    af.idIS4 = r.codeInformationsSupplementaires4;
    return this.http.post<any>(this.urlRechercheDFiltre, af, {headers:this.authService.getHeader()});
  }

}
