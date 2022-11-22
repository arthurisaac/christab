import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";
import {Decompte, FilterDates} from "./decompte.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DecompteService {

  urlAll = this.urls.urlUsedPaie+'api/findAllDecompte';
  urlOne = this.urls.urlUsedPaie+'api/findDecompte';
  urlOneWithItin = this.urls.urlUsedPaie+'api/findDecompteWItin';
  urlCreateD = this.urls.urlUsedPaie+'api/createDecompteD';
  urlCreateC = this.urls.urlUsedPaie+'api/createDecompteC';
  urlUpdate = this.urls.urlUsedPaie+'api/updateDecompte';
  urlDelete = this.urls.urlUsedPaie+'api/deleteDecompte';
  urlAllByidUt = this.urls.urlUsedPaie+'api/findDecompteByUtilisateur';
  urlAllByDateAsc = this.urls.urlUsedPaie+'api/findDecomptesByDAsc';
  urlAllByDateDesc = this.urls.urlUsedPaie+'api/findDecomptesByDDesc';
  urlAllByMtntAsc = this.urls.urlUsedPaie+'api/findDecomptesByMAsc';
  urlAllByMtntDesc = this.urls.urlUsedPaie+'api/findDecomptesByMDesc';
  urlAllBetweenDates = this.urls.urlUsedPaie+'api/findDecomptesBetweenDates';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  createD(d: Decompte) { //  : Observable<Decompte> {
    const copy = this.convert(d);
    // console.log(copy);
    return this.http.post<Decompte>(this.urlCreateD, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  createC(d: Decompte) { //  : Observable<Decompte> {
    const copy = this.convert(d);
    // console.log(copy);
    return this.http.post<Decompte>(this.urlCreateC, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(d: Decompte): Observable<Decompte> {
    const copy = this.convert(d);
    return this.http.post<Decompte>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Decompte> {
    return this.http.post<Decompte>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOneWItin(id: number){
    return this.http.post<any>(this.urlOneWithItin, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllBy(id: number): Observable<Decompte> {
    return this.http.post<Decompte>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllBetweenDates(fd: FilterDates) {
    return this.http.post<Decompte>(this.urlAllBetweenDates, fd,{headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by date ascendant ==================== */
  getAllByDecompteDateAsc() {
    return this.http.get<any>(this.urlAllByDateAsc, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by date descendant ==================== */
  getAllByDecompteDateDesc() {
    return this.http.get<any>(this.urlAllByDateDesc, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by price ascendant ==================== */
  getAllByDecomptePriceAsc() {
    return this.http.get<any>(this.urlAllByMtntAsc, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by price descendant ==================== */
  getAllByDecomptePriceDesc() {
    return this.http.get<any>(this.urlAllByMtntDesc, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Decompte>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Decompte> {
    return this.http.post<Decompte>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: Decompte): Decompte {
    const copy: Decompte = Object.assign({}, a);
    return copy;
  }
  
}
