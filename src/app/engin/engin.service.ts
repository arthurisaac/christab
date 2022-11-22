import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Engin, UA} from './engin.model';
import {StatusBarInfoResult} from "@capacitor/core";
import {HttpClient} from "@angular/common/http";
import {Itineraire} from "../itineraire/itineraire.model";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class EnginService {


    urlAll = this.urls.urlUsedRes+'api/findEngins';
    urlAllByUser = this.urls.urlUsedRes+'api/findEnginsByUser';
    urlAllByUAndA = this.urls.urlUsedRes+'api/findEnginsByUAndA';
    urlOne = this.urls.urlUsedRes+'api/findEngin';
    urlCreate = this.urls.urlUsedRes+'api/createEngin';
    urlUpdate = this.urls.urlUsedRes+'api/updateEngin';
    urlDelete = this.urls.urlUsedRes+'api/deleteEngin';


    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private urls: Urls
    ) { }

    /* ======================= Adding ==================== */
    create(e: Engin) { // : Observable<Engin> {
        // console.log(e);
        /*e.photoEngin = this.concatFile(e.photoEnginF, e.photoEnginP, e.photoEnginA);
        e.photoPermis = this.concatFile(e.photoPermisR, e.photoPermisV);
        e.carteGrise = this.concatFile(e.carteGriseR, e.carteGriseV);
        e.photoAssurance = this.concatFile(e.photoAssuranceR, e.photoAssuranceV);*/
        e.photoEngin = e.photoEnginP;
        e.photoPermis = e.photoPermisR;
        e.carteGrise = e.carteGriseR;
        e.photoAssurance = e.photoAssuranceR;
        const copy = this.convert(e);
        console.log(copy);
        return this.http.post<Engin>(this.urlCreate, copy, {observe: 'response'}); // headers:this.authService.getHeader(),
    }

    /* ======================= Updating ==================== */
    update(e:Engin): Observable<Engin> {
        /*if(e.photoEnginA && e.photoEnginP && e.photoEnginF)
            e.photoEngin = this.concatFile(e.photoEnginF, e.photoEnginP, e.photoEnginA);
        if(e.photoPermisR && e.photoPermisV)
            e.photoPermis = this.concatFile(e.photoPermisR, e.photoPermisV);
        if(e.carteGriseR && e.carteGriseV)
            e.carteGrise = this.concatFile(e.carteGriseR, e.carteGriseV);
        if(e.photoAssuranceR && e.photoAssuranceV)
            e.photoAssurance = this.concatFile(e.photoAssuranceR, e.photoAssuranceV);*/
        if(e.photoEnginP != null)
            e.photoEngin = e.photoEnginP;
        if(e.photoPermisR != null)
            e.photoPermis = e.photoPermisR;
        if(e.carteGriseR != null)
            e.carteGrise = e.carteGriseR;
        if(e.photoAssuranceR != null)
            e.photoAssurance = e.photoAssuranceR;
        const copy = this.convert(e);
        return this.http.post<Engin>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
    }

    /* ======================= Getting one ==================== */
    getOne(id: number): Observable<Engin> {
        return this.http.post<Engin>(this.urlOne, +id, {headers:this.authService.getHeader()});
    }

    /* ======================= Reading ==================== */
    getAll() {
        return this.http.get<Engin>(this.urlAll, {headers:this.authService.getHeader()});
    }

    /* ======================= Reading ==================== */
    getAllByUser(id: number) {
        return this.http.post<Engin>(this.urlAllByUser, +id, {headers:this.authService.getHeader()});
    }

    getAllByUAndA(idU: number, idA: number) {
        let ua = new UA();
        ua.idU = idU;
        ua.idA = idA;
        return this.http.post<Engin>(this.urlAllByUAndA, ua, {headers:this.authService.getHeader()});
    }

    /* ======================= Deleting ==================== */
    delete(id:number): Observable<Engin> {
        return this.http.post<Engin>(this.urlDelete, +id, {headers:this.authService.getHeader()});
    }

    /* ======================= Converting ====================== */
    private convert(e: Engin): Engin {
        const copy: Engin = Object.assign({}, e);
        return copy;
    }

    /* =============================== Concat strings(photo engin, carte grise...) ========================= */
    private concatFile(s1: string, s2: string, s3?: string) { // '?' signifie que ce paramètre n'est pas obligatoire
        let sResult: string = null;
        if(s3 != null) {
            return sResult = s1.concat('-', s2, '-', s3);
        } else {
            return sResult = s1.concat('-', s2);
        }
    }

    /*engins: Array<Engin> = [];

  constructor(
          private storage: Storage
          ) { }
  
  //Adding
  create(e: Engin) {
      this.engins.push(e);
      this.storage.set('engins', this.engins);
  }
  
  // Reading
  getAll() {
      return this.storage.get('engins').then(data => {
          this.engins = data!=null?data:[]; // si le localStorage est vide, on retourne un tableau vide
          return this.engins;
      })
  }
  
  // Removing
  delete(idEngin) {
      this.storage.remove('idEngin');
  }*/
  
  /*localStorage.setItem(
          "My-Key",
          JSON.stringify(
              JSON.parse(localStorage.getItem("My-key")).filter(item => {
                  return item.title !== item_title;
              })
          )
      );
      }*/
  
}
