import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {InformationsSupplementaires} from "./informations-supplementaires.model";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class InformationsSupplementairesService {


  urlAll = this.urls.urlUsedRes+'api/findInformationsSupplementaires';
  urlOne = this.urls.urlUsedRes+'api/findOneInformationsSupplementaires';
  urlCreate = this.urls.urlUsedRes+'api/createInformationsSupplementaires';
  urlUpdate = this.urls.urlUsedRes+'api/updateInformationsSupplementaires';
  urlDelete = this.urls.urlUsedRes+'api/deleteInformationsSupplementaires';
  urlAllByidUt = this.urls.urlUsedRes+'api/findInformationsSupplementairesByU';
  urlAllByidA = this.urls.urlUsedRes+'api/findInformationsSuppByA';
  urlAllByidUA = this.urls.urlUsedRes+'api/findInformationsSuppByUA';
  urlAllByidUD = this.urls.urlUsedRes+'api/findInformationsSuppByUD';

  public infoSupplementaires = [{idInformationsSupplementaires: 1, libelleInformationsSupplementaires:'Voiture Berline', iconeInformationsSupplementaires: 'assets/nouvellesIcones/13.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 2, libelleInformationsSupplementaires:'Voiture SUV/ 4*4', iconeInformationsSupplementaires: 'assets/nouvellesIcones/1.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 3, libelleInformationsSupplementaires:'Valise/ grand sac à dos', iconeInformationsSupplementaires: 'assets/nouvellesIcones/18.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 4, libelleInformationsSupplementaires:'Petit sac à dos', iconeInformationsSupplementaires: 'assets/nouvellesIcones/2.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 5, libelleInformationsSupplementaires:'Animaux de compagnie en laisse autorisés', iconeInformationsSupplementaires: 'assets/nouvellesIcones/19.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 6, libelleInformationsSupplementaires:'Animaux interdits', iconeInformationsSupplementaires: 'assets/nouvellesIcones/3.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 7, libelleInformationsSupplementaires:'Espace fumeur', iconeInformationsSupplementaires: 'assets/nouvellesIcones/16.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 8, libelleInformationsSupplementaires:'Espace non fumeur', iconeInformationsSupplementaires: 'assets/nouvellesIcones/15.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 9, libelleInformationsSupplementaires:'Moto de cylindrée inférieure à 300cm3', iconeInformationsSupplementaires: 'assets/nouvellesIcones/5.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 10, libelleInformationsSupplementaires:'Moto de cylindrée supérieure à 300cm3', iconeInformationsSupplementaires: 'assets/nouvellesIcones/6.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 11, libelleInformationsSupplementaires:'Accès au numéro de téléphone du conducteur', iconeInformationsSupplementaires: 'assets/nouvellesIcones/7.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 12, libelleInformationsSupplementaires:'Pas daccès au numéro de téléphone du conducteur', iconeInformationsSupplementaires: 'assets/nouvellesIcones/8.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 13, libelleInformationsSupplementaires:'Accès à ladresse email du conducteur' , iconeInformationsSupplementaires: 'assets/nouvellesIcones/9.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 14, libelleInformationsSupplementaires:'Pas daccès à ladresse email du conducteur', iconeInformationsSupplementaires: 'assets/nouvellesIcones/10.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 15, libelleInformationsSupplementaires:'Véhicule climatisé', iconeInformationsSupplementaires: 'assets/nouvellesIcones/11.png', idAnnonce: 0, idUtilisateur: 0},
    {idInformationsSupplementaires: 16, libelleInformationsSupplementaires:'Véhicule non climatisé', iconeInformationsSupplementaires: 'assets/nouvellesIcones/12.png', idAnnonce: 0, idUtilisateur: 0},];

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(i: InformationsSupplementaires) : Observable<InformationsSupplementaires> {
    const copy = this.convert(i);
    // console.log(copy);
    return this.http.post<InformationsSupplementaires>(this.urlCreate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Updating ==================== */
  update(a: InformationsSupplementaires): Observable<InformationsSupplementaires> {
    const copy = this.convert(a);
    return this.http.post<InformationsSupplementaires>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<InformationsSupplementaires> {
    return this.http.post<InformationsSupplementaires>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllByU(id: number): Observable<InformationsSupplementaires> {
    let info = new InformationsSupplementaires();
    info.idUtilisateur = id;
    return this.http.post<InformationsSupplementaires>(this.urlAllByidUt, info, {headers:this.authService.getHeader()});
  }

  getAllByA(idA: number) : Observable<InformationsSupplementaires> {
    return this.http.post<InformationsSupplementaires>(this.urlAllByidA, idA, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllByUAn(idU: number, idA: number): Observable<InformationsSupplementaires> {
    let info = new InformationsSupplementaires();
    info.idUtilisateur = idU;
    info.idAnnonce = idA;
    return this.http.post<InformationsSupplementaires>(this.urlAllByidUA, info, {headers:this.authService.getHeader()});
  }

  getAllByUD(idU: number, idD: number): Observable<InformationsSupplementaires> {
    let info = new InformationsSupplementaires();
    info.idUtilisateur = idU;
    info.idDemande = idD;
    return this.http.post<InformationsSupplementaires>(this.urlAllByidUD, info, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<InformationsSupplementaires>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<InformationsSupplementaires> {
    return this.http.post<InformationsSupplementaires>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(d: InformationsSupplementaires): InformationsSupplementaires {
    const copy: InformationsSupplementaires = Object.assign({}, d);
    return copy;
  }
}
