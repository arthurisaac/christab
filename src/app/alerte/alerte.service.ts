import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Alerte} from "./alerte.model";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class AlerteService {

  urlAll = this.urls.urlUsedRes+'api/findAlertes';
  urlOne = this.urls.urlUsedRes+'api/findAlerte';
  urlOneByAnU = this.urls.urlUsedRes+'api/findAlerteByAnnonceAndUser/';
  urlCreate = this.urls.urlUsedRes+'api/createAlerte';
  urlUpdate = this.urls.urlUsedRes+'api/updateAlerte';
  urlDelete = this.urls.urlUsedRes+'api/deleteAlerte';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(a: Alerte) { //  : Observable<Alerte> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<Alerte>(this.urlCreate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(a:Alerte): Observable<Alerte> {
    const copy = this.convert(a);
    return this.http.post<Alerte>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Alerte> {
    return this.http.post<Alerte>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  getOnebyAnUser(idA: number, idU:number) {
    return this.http.get<Alerte>(this.urlOneByAnU+idA+'/'+idU, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Alerte>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Alerte> {
    return this.http.post<Alerte>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: Alerte): Alerte {
    const copy: Alerte = Object.assign({}, a);
    return copy;
  }
}
