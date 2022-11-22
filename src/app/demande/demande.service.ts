import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Demande, UserDemande} from "./demande.model";
import {AuthenticationService} from "../authentication.service";
import {AWfilter, UserAnnonce} from "../annonce/annonce.model";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class DemandeService {


  urlAll = this.urls.urlUsedRes+'api/findDemandes';
  urlOne = this.urls.urlUsedRes+'api/findDemande';
  urlCreate = this.urls.urlUsedRes+'api/createDemande';
  urlUpdate = this.urls.urlUsedRes+'api/updateDemande';
  urlDelete = this.urls.urlUsedRes+'api/deleteDemande';
  urlAllByidUt = this.urls.urlUsedRes+'api/findDemandesByUtilisateur';
  urlAllWUAIAvFP = this.urls.urlUsedRes+'api/findDemandesWithUAndIAvFP';
  urlAllWUAIAvFPEC = this.urls.urlUsedRes+'api/findDemandesWithUAndIAvFPEC';
  urlAllWUAIAv = this.urls.urlUsedRes+'api/findDemandesWithUAndIAv';
  urlAllByPriceAsc = this.urls.urlUsedRes+'api/findDemandesByPrA';
  urlAllByPriceDesc = this.urls.urlUsedRes+'api/findDemandesByPrD';
  urlAllByPlaceAsc = this.urls.urlUsedRes+'api/findDemandesByPlA';
  urlAllByPlaceDesc = this.urls.urlUsedRes+'api/findDemandesByPlD';
  urlAllByDateAsc = this.urls.urlUsedRes+'api/findDemandesByDepA';
  urlAllByDateDesc = this.urls.urlUsedRes+'api/findDemandesByDepD';
  urlAllWAIAvByU = this.urls.urlUsedRes+'api/findDemandesWithUAndIAvByUtilisateur';
  urlAllByFilters = this.urls.urlUsedRes+'api/findDemandesByFilters';
  urlAllAU = this.urls.urlUsedRes+'api/findDemandesAU';
  urlAllAV = this.urls.urlUsedRes+'api/findDemandesAV';
  urlAllMU = this.urls.urlUsedRes+'api/findDemandesMU';
  urlAllMV = this.urls.urlUsedRes+'api/findDemandesMV';
  urlAllByItinAn = this.urls.urlUsedRes+'api/findDemandesByItinAn';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(d: Demande){ //  : Observable<Demande> {
    const copy = this.convert(d);
    // console.log(copy);
    return this.http.post<Demande>(this.urlCreate, copy, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(a: Demande): Observable<Demande> {
    const copy = this.convert(a);
    return this.http.post<Demande>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Demande> {
    return this.http.post<Demande>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllBy(id: number): Observable<Demande> {
    return this.http.post<Demande>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFP(id: number) {
    return this.http.post<any>(this.urlAllWUAIAvFP, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFPEC(id:number) {
    // console.log(id);
    return this.http.post<any>(this.urlAllWUAIAvFPEC, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All Auto urbain ==================== */
  getAllAU() {
    return this.http.get<any>(this.urlAllAU, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All Auto voyage ==================== */
  getAllAV() {
    return this.http.get<any>(this.urlAllAV, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All Moto urbain ==================== */
  getAllMU() {
    return this.http.get<any>(this.urlAllMU, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All Moto voyage ==================== */
  getAllMV() {
    return this.http.get<any>(this.urlAllMV, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllWAIByU(d: UserDemande) {
    return this.http.post<any>(this.urlAllWAIAvByU, d, {headers:this.authService.getHeader()}); // , observe: 'response'});
  }

  /*getAllByIAn(idI: number, idD: number) {
    let d = new UserDemande();
    d.idI = idI;
    d.idD = idD;
    return this.http.post<any>(this.urlAllByItinAn, d, {headers:this.authService.getHeader()}); // , observe: 'response'});
  }*/

  getAllByIAn(idI: number) {
    return this.http.post<any>(this.urlAllByItinAn, idI, {headers:this.authService.getHeader()});
  }

  getAllWFilters(ld: string, la: string, np: string, hd: string, ha: string, dd: string, da: string, te: string, tv: string,
                 idIS1: number, idIS2: number, idIS3: number, idIS4: number){
    let af = new AWfilter();
    af.ld =ld;
    af.la = la;
    af.np = np;
    af.hd = hd;
    af.ha = ha;
    af.dd = dd;
    af.da = da;
    af.te = te;
    af.tv = tv;
    af.idIS1 = idIS1;
    af.idIS2 = idIS2;
    af.idIS3 = idIS3;
    af.idIS4 = idIS4;
    return this.http.post<any>(this.urlAllByFilters, af, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAv() {
    return this.http.get<any>(this.urlAllWUAIAv, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All By price ==================== */
  getAllByPriceAsc() {
    return this.http.get<any>(this.urlAllByPriceAsc, {headers:this.authService.getHeader()});
  }

  getAllByPriceDesc() {
    return this.http.get<any>(this.urlAllByPriceDesc, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All By place ==================== */
  getAllByPlaceAsc() {
    return this.http.get<any>(this.urlAllByPlaceAsc, {headers:this.authService.getHeader()});
  }

  getAllByPlaceDesc() {
    return this.http.get<any>(this.urlAllByPlaceDesc, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All By date ==================== */
  getAllByDateAsc() {
    return this.http.get<any>(this.urlAllByDateAsc, {headers:this.authService.getHeader()});
  }

  getAllByDateDesc() {
    return this.http.get<any>(this.urlAllByDateDesc, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Demande>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Demande> {
    return this.http.post<Demande>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(d: Demande): Demande {
    const copy: Demande = Object.assign({}, d);
    return copy;
  }

}
