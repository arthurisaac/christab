import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "../authentication.service";
import {FilterDates, Paiement} from "./paiement.model";
import {Observable} from "rxjs";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class PaiementService {


  urlAll = this.urls.urlUsedRes+'api/findAllPaiement';
  urlOne = this.urls.urlUsedRes+'api/findPaiement';
  urlOneWithItin = this.urls.urlUsedRes+'api/findPaiementWItin';
  urlCreate = this.urls.urlUsedRes+'api/createPaiement';
  urlUpdate = this.urls.urlUsedRes+'api/updatePaiement';
  urlDelete = this.urls.urlUsedRes+'api/deletePaiement';
  urlAllByidUt = this.urls.urlUsedRes+'api/findPaiementByU';
  urlAllWUAI = this.urls.urlUsedRes+'api/findPaiementsWithUAndI';
  urlAllByNumAsc = this.urls.urlUsedRes+'api/findPaiementsByNAsc';
  urlAllByNumDesc = this.urls.urlUsedRes+'api/findPaiementsByNDesc';
  urlAllByDateAsc = this.urls.urlUsedRes+'api/findPaiementsByDAsc';
  urlAllByDateDesc = this.urls.urlUsedRes+'api/findPaiementsByDDesc';
  urlAllByMtntAsc = this.urls.urlUsedRes+'api/findPaiementsByMAsc';
  urlAllByMtntDesc = this.urls.urlUsedRes+'api/findPaiementsByMDesc';
  urlAllBetweenDates = this.urls.urlUsedRes+'api/findPaiementsBetweenDates';
  urlLastPaiement = this.urls.urlUsedRes+'api/findLastPaiement';

  urlOrangeMoney = this.urls.urlUsedPaie+'api/createPaymentViaOrange';
  urlOrange = this.urls.urlUsedPaie+'api/createOrangePayment';
  urlOrangeT = this.urls.urlUsedPaie+'api/createOrangePaymentT';
  urlMobicash = this.urls.urlUsedPaie+'api/createPaymentViaMobicash';
  urlTouchOrange = this.urls.urlUsedPaie+'api/createTouchOrange';
  urlTouchMoov = this.urls.urlUsedPaie+'api/createTouchPayMoov';
  urlTouchMoovCallBack = this.urls.urlUsedPaie+'api/touchPMoovCallBackResponse';

  constructor(
      private http: HttpClient,
      private authService: AuthenticationService,
      private urls: Urls
  ) { }

  /* ======================= Adding ==================== */
  create(a: Paiement){ //  : Observable<Paiement> {
    const copy = this.convert(a);
    // console.log(copy);
    return this.http.post<Paiement>(this.urlCreate, copy, {observe: 'response'}); // {headers:this.authService.getHeader(), observe: 'response'});
  }

  /*createOrange(c: COMMAND) {
    return this.http.post(this.urlOrangeMoney, c, {observe: 'response', responseType: 'text'}); // {headers:this.authService.getHeader(), observe:'response'});
  }*/

  createOrange(c: CommandDto) {
    return this.http.post<CommandDto>(this.urlOrange, c, {observe: 'response'}); // {headers:this.authService.getHeader(), observe:'response'});
  }

  createMobicash(c: COMMAND) {
    return this.http.post<Paiement>(this.urlMobicash, c, {observe: 'response'}); // {headers:this.authService.getHeader(), observe:'response'});
  }

  touchOrange(t: TouchCustomDto) {
    return this.http.post<TouchOrangeResponseDto>(this.urlTouchOrange, t, {observe: 'response'}); // {headers:this.authService.getHeader(), observe:'response', responseType: 'text'});
  }

  touchMoov(t: TouchCustomDto) {
    return this.http.post<MoovCallBackRequestDto>(this.urlTouchMoov, t, {observe: 'response'}); // {headers:this.authService.getHeader(), observe:'response'});
  }

  touchMoovCallBack(t: TouchMoovCallBackRequestDto) {
    return this.http.post<MoovCallBackDto>(this.urlTouchMoovCallBack, t, {observe: 'response'}); // {headers:this.authService.getHeader(), observe:'response'});
  }

  /* ======================= Updating ==================== */
  update(a: Paiement): Observable<Paiement> {
    const copy = this.convert(a);
    return this.http.post<Paiement>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOne(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(this.urlOne, +id, {headers:this.authService.getHeader()});
  }

  getLastByU(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(this.urlLastPaiement, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting one ==================== */
  getOneWItin(id: number){
    return this.http.post<any>(this.urlOneWithItin, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by user's id ==================== */
  getAllByU(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(this.urlAllByidUt, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All with user and itineraire ==================== */
  getAllBetweenDates(fd: FilterDates) {
    return this.http.post<Paiement>(this.urlAllBetweenDates, fd,{headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by number ascendant ==================== */
  /*getAllByNumAsc() {
    return this.http.get<any>(this.urlAllByNumAsc, {headers:this.authService.getHeader()});
  }*/

  getAllByNumAsc(id: number) {
    return this.http.post(this.urlAllByNumAsc, +id,  {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by number descendant ==================== */
  getAllByNumDesc(id: number) {
    return this.http.post(this.urlAllByNumDesc, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by date ascendant ==================== */
  getAllByPaiementDateAsc(id: number) {
    return this.http.post(this.urlAllByDateAsc, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by date descendant ==================== */
  getAllByPaiementDateDesc(id: number) {
    return this.http.post(this.urlAllByDateDesc, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by price ascendant ==================== */
  getAllByPaiementPriceAsc(id: number) {
    return this.http.post(this.urlAllByMtntAsc, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Getting All by price descendant ==================== */
  getAllByPaiementPriceDesc(id: number) {
    return this.http.post(this.urlAllByMtntDesc, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Reading ==================== */
  getAll() {
    return this.http.get<Paiement>(this.urlAll, {headers:this.authService.getHeader()});
  }

  /* ======================= Deleting ==================== */
  delete(id:number): Observable<Paiement> {
    return this.http.post<Paiement>(this.urlDelete, +id, {headers:this.authService.getHeader()});
  }

  /* ======================= Converting ====================== */
  private convert(a: Paiement): Paiement {
    const copy: Paiement = Object.assign({}, a);
    return copy;
  }
}

export class COMMAND {
  customer_msisdn?: number;
  amount?: number;
  otp?: number;

}

export class CommandDto {
  customer_msisdn?: string;
  amount?: number;
  otp?: number;
  idUtilisateur?: number;

}

export class TouchMoovCallBackRequestDto {
  partnerTransactionId: string;
  amount?: number;
  idUtilisateur: number;
}

export class TouchCustomDto {
  additionnalInfos?: any; // AdditionnalInfos;
  amount: number;
  // callback: string;
  recipientNumber: string;
  // serviceCode: string;
  idUtilisateur: number;
}

export class AdditionnalInfos {
  recipientEmail?: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  destinataire?: string;
  otp: string;
}

export class AdditionnalInfosMoov {
  recipientEmail?: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  destinataire?: string;
}

export class MoovCallBackRequestDto {
  idFromClient: string;
  idFromGU: string;
  amount: number;
  fees: number;
  serviceCode: string;
  recipientNumber: number;
  dateTime: number;
  status: string;
  numTransaction: string;
  detailMessage: string;
}

export class TouchOrangeResponseDto {
  idFromClient: string;
  idFromGU: string;
  amount: number;
  fees: number;
  serviceCode: string;
  recipientNumber: number;
  dateTime: number;
  status: string;
  numTransaction: string;
}

export class MoovCallBackDto {
  partnerTransactionId: string;
  status: string;
  message: string;
}