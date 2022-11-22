import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {AvisDto} from "./avis.model";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  urlAll = this.urls.urlUsedAvis+'api/findAllAvis';
  urlOne = this.urls.urlUsedAvis+'api/findAvis';
  urlCreate = this.urls.urlUsedAvis+'api/createAvis'; // this.urls.urlUsedRes+'api/createAvis';
  urlUpdate = this.urls.urlUsedAvis+'api/updateAvis';
  urlDelete = this.urls.urlUsedAvis+'api/deleteAvis';
  urlAllByidUt = this.urls.urlUsedAvis+'api/findAvisByUtilisateur';
  urlAllWUAI = this.urls.urlUsedAvis+'api/findAvissWithUAndI';
  urlAllByIdRecipient = this.urls.urlUsedAvis+'api/findAllAvisByIdRecipient';
  urlTotalAvisByU = this.urls.urlUsedAvis+'api/findAvisTotalByU';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(a: AvisDto) { //  : Observable<Avis> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<AvisDto>(this.urlCreate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(a: AvisDto): Observable<AvisDto> {
    const copy = this.convert(a);
    return this.http.post<AvisDto>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<AvisDto> {
    return this.http.post<AvisDto>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllByU(id: number): Observable<AvisDto> {
    return this.http.post<AvisDto>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  getAllForU(id: number): Observable<AvisDto> {
    return this.http.post<AvisDto>(this.urlAllByIdRecipient, +id, {headers:this.authService.getHeader()});
  }

  getAllForUDriver(id: number): Observable<AvisDto> {
    return this.http.get<AvisDto>(this.urlAllByIdRecipient+'/'+id, {headers:this.authService.getHeader()});
  }

  getTotalAvisByU(id: number): Observable<number> {
    return this.http.get<number>(this.urlTotalAvisByU+'/'+id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllWUAI() {
    return this.http.get<any>(this.urlAllWUAI, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<AvisDto>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<AvisDto> {
    return this.http.post<AvisDto>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: AvisDto): AvisDto {
    const copy: AvisDto = Object.assign({}, a);
    return copy;
  }
}
