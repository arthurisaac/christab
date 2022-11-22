import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Itineraire} from "./itineraire.model";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class ItineraireService {

  /*urlAll = 'https://christab.herokuapp.com/api/findItineraires';
  urlOne = 'https://christab.herokuapp.com/api/findItineraire';
  urlCreate = 'https://christab.herokuapp.com/api/createItineraire';
  urlUpdate = 'https://christab.herokuapp.com/api/updateItineraire';
  urlDelete = 'https://christab.herokuapp.com/api/deleteItineraire';*/

  /*urlAll = 'http://localhost:8082/api/findItineraires';
  urlOne = 'http://localhost:8082/api/findItineraire';
  urlCreate = 'http://localhost:8082/api/createItineraire';
  urlUpdate = 'http://localhost:8082/api/updateItineraire';
  urlDelete = 'http://localhost:8082/api/deleteItineraire';*/


  urlAll = this.urls.urlUsedRes+'api/findItineraires';
  urlOne = this.urls.urlUsedRes+'api/findItineraire';
  urlCreate = this.urls.urlUsedRes+'api/createItineraire';
  urlUpdate = this.urls.urlUsedRes+'api/updateItineraire';
  urlDelete = this.urls.urlUsedRes+'api/deleteItineraire';


  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(i: Itineraire) { //  : Observable<Itineraire> {
    const copy = this.convert(i);
    // console.log(copy);
    return this.http.post<Itineraire>(this.urlCreate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(i:Itineraire) { // : Observable<Itineraire> {
    const copy = this.convert(i);
    return this.http.post<Itineraire>(this.urlUpdate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Itineraire> {
    return this.http.post<Itineraire>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Itineraire>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Itineraire> {
    return this.http.post<Itineraire>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(i: Itineraire): Itineraire {
    const copy: Itineraire = Object.assign({}, i);
    return copy;
  }

}
