import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {Reservation, UserItin} from "./reservation.model";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  /*urlAll = 'https://christab.herokuapp.com/api/findReservations';
  urlOne = 'https://christab.herokuapp.com/api/findReservation';
  urlCreate = 'https://christab.herokuapp.com/api/createReservation';
  urlUpdate = 'https://christab.herokuapp.com/api/updateReservation';
  urlDelete = 'https://christab.herokuapp.com/api/deleteReservation';
  urlAllByidUt = 'https://christab.herokuapp.com/api/findReservationsByUtilisateur';*/

  /*urlAll = 'http://localhost:8082/api/findReservations';
  urlOne = 'http://localhost:8082/api/findReservation';
  urlCreate = 'http://localhost:8082/api/createReservation';
  urlUpdate = 'http://localhost:8082/api/updateReservation';
  urlDelete = 'http://localhost:8082/api/deleteReservation';
  urlAllByidUt = 'http://localhost:8082/api/findReservationsByUtilisateur';*/

  urlAll = this.urls.urlUsedRes+'api/findReservations';
  urlOne = this.urls.urlUsedRes+'api/findReservation';
  urlOneByUI = this.urls.urlUsedRes+'api/findReservationByUI';
  urlCreate = this.urls.urlUsedRes+'api/createReservation';
  urlUpdate = this.urls.urlUsedRes+'api/updateReservation';
  urlDelete = this.urls.urlUsedRes+'api/deleteReservation';
  urlAllByidUt = this.urls.urlUsedRes+'api/findReservationsByUtilisateur';
  urlAllByidI = this.urls.urlUsedRes+'api/findReservationsByItineraire';
  urlReservationNumber = this.urls.urlUsedRes+'api/findCarpoolingNumber/';


  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(r: Reservation){ //  : Observable<Reservation> {
    const copy = this.convert(r);
    return this.http.post<Reservation>(this.urlCreate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(a: Reservation): Observable<Reservation> {
    const copy = this.convert(a);
    return this.http.post<Reservation>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  getOneByUI(id: UserItin) { // : Observable<Reservation> {

    return this.http.post<Reservation>(this.urlOneByUI, id, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllBy(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  getAllByItin(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(this.urlAllByidI, +id, {headers:this.authService.getHeader()});
  }

  getReservationNumberByU(id: number) {
    return this.http.get<number>(this.urlReservationNumber+id, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Reservation>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Reservation> {
    return this.http.post<Reservation>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(r: Reservation): Reservation {
    const copy: Reservation = Object.assign({}, r);
    return copy;
  }


}
