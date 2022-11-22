import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TypeFonction } from './type-fonction.model';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication.service";
import {Urls} from "../urls";

@Injectable({
  providedIn: 'root'
})
export class TypeFonctionService {

    /*private headers =  new HttpHeaders({
            'Access-Control-Allow-Origin': 'http://localhost:8082',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type'});*/

    /*urlAll = 'https://christab.herokuapp.com/api/findTypeFonctions';
    urlOne = 'https://christab.herokuapp.com/api/findTypeFonction';
    urlCreate = 'https://christab.herokuapp.com/api/createTypeFonction';
    urlUpdate = 'https://christab.herokuapp.com/api/updateTypeFonction';
    urlDelete = 'https://christab.herokuapp.com/api/deleteTypeFonction';*/

    /*urlAll = 'http://localhost:8082/api/findTypeFonctions';
    urlOne = 'http://localhost:8082/api/findTypeFonction';
    urlCreate = 'http://localhost:8082/api/createTypeFonction';
    urlUpdate = 'http://localhost:8082/api/updateTypeFonction';
    urlDelete = 'http://localhost:8082/api/deleteTypeFonction';*/


    urlAll = this.urls.urlUsedRes+'api/findTypeFonctions';
    urlOne = this.urls.urlUsedRes+'api/findTypeFonction';
    urlCreate = this.urls.urlUsedRes+'api/createTypeFonction';
    urlUpdate = this.urls.urlUsedRes+'api/updateTypeFonction';
    urlDelete = this.urls.urlUsedRes+'api/deleteTypeFonction';



    constructor(
        private storage: Storage,
        private http: HttpClient,
        private authService: AuthenticationService,
        private urls: Urls
    ) { }

    /* ======================= Adding ==================== */
    create(t: TypeFonction) : Observable<TypeFonction> {
        const copy = this.convert(t);
        return this.http.post<TypeFonction>(this.urlCreate, copy, {headers:this.authService.getHeader()});
    }

    /* ======================= Updating ==================== */
    update(t:TypeFonction): Observable<TypeFonction> {
        const copy = this.convert(t);
        return this.http.post<TypeFonction>(this.urlUpdate, copy, {headers:this.authService.getHeader()});
    }

    /* ======================= Getting one ==================== */
    getOne(id: number): Observable<TypeFonction> {
        return this.http.post<TypeFonction>(this.urlOne, +id, {headers:this.authService.getHeader()});
    }

    /* ======================= Reading ==================== */
    getAll() {
        return this.http.get<TypeFonction>(this.urlAll); // pas besoin d'entête car cette ressource est accessible à tous, {headers:this.authService.getHeader()});
    }

    /* ======================= Deleting ==================== */
    delete(id:number): Observable<TypeFonction> {
        return this.http.post<TypeFonction>(this.urlDelete, +id, {headers:this.authService.getHeader()});
    }

    /* ======================= Converting ====================== */
    private convert(t: TypeFonction): TypeFonction {
        const copy: TypeFonction = Object.assign({}, t);
        return copy;
    }
  
}
