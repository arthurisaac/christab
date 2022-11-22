import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Annonce, AnnonceDto, AWfilter, UserAnnonce} from "./annonce.model";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {

  /*urlAllByPriceAsc = this.urls.urlUsedSearch+'api/findAnnoncesByPrA';
  urlAllByPriceDesc = this.urls.urlUsedSearch+'api/findAnnoncesByPrD';
  urlAllByPlaceAsc = this.urls.urlUsedSearch+'api/findAnnoncesByPlA';
  urlAllByPlaceDesc = this.urls.urlUsedSearch+'api/findAnnoncesByPlD';
  urlAllByDateAsc = this.urls.urlUsedSearch+'api/findAnnoncesByDepA';
  urlAllByDateDesc = this.urls.urlUsedSearch+'api/findAnnoncesByDepD';
  urlAllByFilters = this.urls.urlUsedSearch+'api/annoncesByFilters'; // findAnnoncesByFilters';
  urlAllAU = this.urls.urlUsedSearch+'api/findAnnoncesAU';
  urlAllAV = this.urls.urlUsedSearch+'api/findAnnoncesAV';
  urlAllMU = this.urls.urlUsedSearch+'api/findAnnoncesMU';
  urlAllMV = this.urls.urlUsedSearch+'api/findAnnoncesMV';
  urlByUser = this.urls.urlSearch+'api/annoncesByU/';
  urlAllWUAI = this.urls.urlSearch+'api/annoncesWithUI'; // findAnnoncesWithUAndI';
  urlAllWUAIAv = this.urls.urlSearch+'api/annoncesWithUI'; // findAnnoncesWithUAndIAv';
  urlAllWUAIAvFC = this.urls.urlUsedSearch+'api/findAnnoncesWithUAndIAvFC/';
  urlAllWUAIAvFCEC = this.urls.urlUsedSearch+'api/findAnnoncesWithUAndIAvFCEC/';

  urlAllByPriceAscP = this.urls.urlUsedSearch+'api/findDemandesByPrA';
  urlAllByPriceDescP = this.urls.urlUsedSearch+'api/findDemandesByPrD';
  urlAllByPlaceAscP = this.urls.urlUsedSearch+'api/findDemandesByPlA';
  urlAllByPlaceDescP = this.urls.urlUsedSearch+'api/findDemandesByPlD';
  urlAllByDateAscP = this.urls.urlUsedSearch+'api/findDemandesByDepA';
  urlAllByDateDescP = this.urls.urlUsedSearch+'api/findDemandesByDepD';
  urlAllByFiltersP = this.urls.urlUsedSearch+'api/demandesByFilters';
  urlAllAUP = this.urls.urlUsedSearch+'api/findDemandesAU';
  urlAllAVP = this.urls.urlUsedSearch+'api/findDemandesAV';
  urlAllMUP = this.urls.urlUsedSearch+'api/findDemandesMU';
  urlAllMVP = this.urls.urlUsedSearch+'api/findDemandesMV';
  urlByUserP = this.urls.urlSearch+'api/demandesByU/';
  urlAllWUAIP = this.urls.urlSearch+'api/demandesWithUI';
  urlAllWUAIAvP = this.urls.urlSearch+'api/demandesWithUI';
  urlAllWUAIAvFP = this.urls.urlUsedSearch+'api/findDemandesWithUAndIAvFC/';
  urlAllWUAIAvFPEC = this.urls.urlUsedSearch+'api/findDemandesWithUAndIAvFCEC/';
  */

  urlAll = this.urls.urlUsedRes+'api/findAnnonces';
  urlOne = this.urls.urlUsedRes+'api/findAnnonce';
  urlCreate = this.urls.urlUsedRes+'api/createAnnonce';
  urlUpdate = this.urls.urlUsedRes+'api/updateAnnonce';
  urlDelete = this.urls.urlUsedRes+'api/deleteAnnonce';
  urlAllByidUt = this.urls.urlUsedRes+'api/findAnnoncesByUtilisateur';
  urlAllWUAI = this.urls.urlUsedRes+'api/findAnnoncesWithUAndI';
  urlAllWUAIAv = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAv';
  urlAllWUAIAvFC = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAvFC';
  urlAllWUAIAvFP = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAvFP';
  urlAllWUAIAvFCEC = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAvFCEC';
  urlAllWUAIAvFPEC = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAvFPEC';
  urlAllByPriceAsc = this.urls.urlUsedRes+'api/findAnnoncesByPrA';
  urlAllByPriceDesc = this.urls.urlUsedRes+'api/findAnnoncesByPrD';
  urlAllByPlaceAsc = this.urls.urlUsedRes+'api/findAnnoncesByPlA';
  urlAllByPlaceDesc = this.urls.urlUsedRes+'api/findAnnoncesByPlD';
  urlAllByDateAsc = this.urls.urlUsedRes+'api/findAnnoncesByDepA';
  urlAllByDateDesc = this.urls.urlUsedRes+'api/findAnnoncesByDepD';
  urlAllWAIAvByU = this.urls.urlUsedRes+'api/findAnnoncesWithUAndIAvByUtilisateur';
  urlAllByFilters = this.urls.urlUsedRes+'api/findAnnoncesByFilters';
  urlAllAU = this.urls.urlUsedRes+'api/findAnnoncesAU';
  urlAllAV = this.urls.urlUsedRes+'api/findAnnoncesAV';
  urlAllMU = this.urls.urlUsedRes+'api/findAnnoncesMU';
  urlAllMV = this.urls.urlUsedRes+'api/findAnnoncesMV';
  urlAllByItinAn = this.urls.urlUsedRes+'api/findAnnoncesByItinAn';

  urlAnnonce = this.urls.urlUsedSearch+'api/annonces';
  urlForOne = this.urls.urlUsedSearch+'api/annonce';
  urlAnnonceP = this.urls.urlUsedSearch+'api/demandes';
  urlForOneP = this.urls.urlUsedSearch+'api/demande';



  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(a: AnnonceDto) { //  : Observable<Annonce> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<AnnonceDto>(this.urlAnnonce, a, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  update(a: AnnonceDto) { // : Observable<Annonce> {
    const copy = this.convert(a);
    return this.http.put<AnnonceDto>(this.urlAnnonce, a, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  /*getOne(id: number): Observable<Annonce> {
    return this.http.post<Annonce>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }*/
  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<AnnonceDto> {
    return this.http.get<AnnonceDto>(this.urlForOne+id, {headers:this.authService.getHeader()});
  }


  /* ======================= Getting All by user's id ==================== */
  getAllBy(id: number): Observable<Annonce> {
    return this.http.post<Annonce>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllWUAI() {
    return this.http.get<any>(this.urlAllWUAI, {headers:this.authService.getHeader()});
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
  getAllWAIByU(d: UserAnnonce) {
    /*console.log('********* Annonce ********');
    console.log(d.idA);
    console.log('********* Utilisateur ********');
    console.log(d.idU);
    console.log('********* Itineraire ********');
    console.log(d.idI);*/
    return this.http.post<any>(this.urlAllWAIAvByU, d, {headers:this.authService.getHeader()}); // , observe: 'response'});
  }

  /*getAllByIAn(idI: number, idA: number) {
    let d = new UserAnnonce();
    d.idI = idI;
    d.idA = idA;
    return this.http.post<any>(this.urlAllByItinAn, d, {headers:this.authService.getHeader()}); // , observe: 'response'});
  }*/
  getAllByIAn(idI: number) {
    return this.http.post<any>(this.urlAllByItinAn, idI, {headers:this.authService.getHeader()}); // , observe: 'response'});
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

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFC(id: number) {
    return this.http.post<any>(this.urlAllWUAIAvFC, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFP(id: number) {
    return this.http.post<any>(this.urlAllWUAIAvFP, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFCEC(id:number) {
    return this.http.post<any>(this.urlAllWUAIAvFCEC, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user itineraire and avis ==================== */
  getAllWUAIAvFPEC(id:number) {
    return this.http.post<any>(this.urlAllWUAIAvFPEC, +id, {headers:this.authService.getHeader()});
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
    return this.http.get<Annonce>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Annonce> {
    return this.http.post<Annonce>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: AnnonceDto): AnnonceDto {
    const copy: AnnonceDto = Object.assign({}, a);
    return copy;
  }

  /**************************** For passenger *********************************/
  createP(a: AnnonceDto) { //  : Observable<Annonce> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<AnnonceDto>(this.urlAnnonceP, a, {headers:this.authService.getHeader(), observe: 'response'});
  }

  /* ======================= Updating ==================== */
  updateP(a: AnnonceDto) { // : Observable<Annonce> {
    const copy = this.convert(a);
    return this.http.put<AnnonceDto>(this.urlAnnonceP, a, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOneP(id: number): Observable<AnnonceDto> {
    return this.http.get<AnnonceDto>(this.urlForOneP+id, {headers:this.authService.getHeader()});
  }

}
