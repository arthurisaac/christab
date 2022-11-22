import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {TypeAvis} from "./type-avis.model";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class TypeAvisService {

  /*urlAll = 'https://christab.herokuapp.com/api/findAllTypeAvis';
  urlOne = 'https://christab.herokuapp.com/api/findTypeAvis';
  urlCreate = 'https://christab.herokuapp.com/api/createTypeAvis';
  urlUpdate = 'https://christab.herokuapp.com/api/updateTypeAvis';
  urlDelete = 'https://christab.herokuapp.com/api/deleteTypeAvis';
  urlAllByidUt = 'https://christab.herokuapp.com/api/findTypeAvisByUtilisateur';
  urlAllWUAI = 'https://christab.herokuapp.com/api/findTypeAvissWithUAndI';
  urlAllByAvis = 'https://christab.herokuapp.com/api/findAllfindTypeAvisByAvis';*/

  /*urlAll = 'http://localhost:8082/api/findAllTypeAvis';
  urlOne = 'http://localhost:8082/api/findTypeAvis';
  urlCreate = 'http://localhost:8082/api/createTypeAvis';
  urlUpdate = 'http://localhost:8082/api/updateTypeAvis';
  urlDelete = 'http://localhost:8082/api/deleteTypeAvis';
  urlAllByidUt = 'http://localhost:8082/api/findTypeAvisByUtilisateur';
  urlAllWUAI = 'http://localhost:8082/api/findTypeAvissWithUAndI';
  urlAllByAvis = 'http://localhost:8082/api/findAllfindTypeAvisByAvis';*/


  urlAll = this.urls.urlUsedAvis+'api/findAllTypeAvis';
  urlOne = this.urls.urlUsedAvis+'api/findTypeAvis';
  urlCreate = this.urls.urlUsedAvis+'api/createTypeAvis';
  urlUpdate = this.urls.urlUsedAvis+'api/updateTypeAvis';
  urlDelete = this.urls.urlUsedAvis+'api/deleteTypeAvis';
  urlAllByidUt = this.urls.urlUsedAvis+'api/findTypeAvisByUtilisateur';
  urlAllNByUtId = this.urls.urlUsedAvis+'api/findNoteByUtilisateur/';
  urlAllWUAI = this.urls.urlUsedAvis+'api/findTypeAvissWithUAndI';
  urlAllByAvis = this.urls.urlUsedAvis+'api/findAllfindTypeAvisByAvis';
  urlAvgNoteByU = this.urls.urlUsedAvis+'api/findAvgByNoteAndU/';

  typeavis: TypeAvis[] = [{idTypeAvis: 1, libelleTypeAvis:'Ponctualité', idAvis: 0, note: 0},
    {idTypeAvis: 2, libelleTypeAvis:'Sécurité', idAvis: 0, note: 0},
    {idTypeAvis: 3, libelleTypeAvis:'Confort', idAvis: 0, note: 0},
    {idTypeAvis: 4, libelleTypeAvis:'Courtoisie', idAvis: 0, note: 0},
    {idTypeAvis: 5, libelleTypeAvis:'Fiabilité', idAvis: 0, note: 0},
    {idTypeAvis: 6, libelleTypeAvis:'Facilité d’utilisation de l’application', idAvis: 0, note: 0},
    {idTypeAvis: 7, libelleTypeAvis:'Réactivité du service Client', idAvis: 0, note: 0},
    {idTypeAvis: 8, libelleTypeAvis:'Niveau de sécurité', idAvis: 0, note: 0},]

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(a: TypeAvis) : Observable<TypeAvis> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<TypeAvis>(this.urlCreate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Updating ==================== */
  update(a: TypeAvis): Observable<TypeAvis> {
    const copy = this.convert(a);
    return this.http.post<TypeAvis>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<TypeAvis> {
    return this.http.post<TypeAvis>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllByU(id: number): Observable<TypeAvis> {
    return this.http.post<TypeAvis>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  getAllNoteByU(id: number) {
    return this.http.get<Number>(this.urlAllNByUtId+id, {headers:this.authService.getHeader()});
  }

  getAvgByNoteAndU(id: number) {
    return this.http.get<any>(this.urlAvgNoteByU+id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by type-avis's id ==================== */
  getAllByAvis(id: number): Observable<TypeAvis> {
    return this.http.post<TypeAvis>(this.urlAllByAvis, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllWUAI() {
    return this.http.get<any>(this.urlAllWUAI, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<TypeAvis>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<TypeAvis> {
    return this.http.post<TypeAvis>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: TypeAvis): TypeAvis {
    const copy: TypeAvis = Object.assign({}, a);
    return copy;
  }
}
