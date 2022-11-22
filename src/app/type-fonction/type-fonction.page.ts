import { Component, OnInit } from '@angular/core';
import { TypeFonction } from './type-fonction.model';
import { TypeFonctionService } from './type-fonction.service';
import {AlertController, NavController} from "@ionic/angular";

@Component({
  selector: 'app-type-fonction',
  templateUrl: './type-fonction.page.html',
  styleUrls: ['./type-fonction.page.scss'],
})
export class TypeFonctionPage {
    
    typeFonction: TypeFonction = new TypeFonction();
    typeFonctions: TypeFonction;
    mode: number;
    id: number = 0;
    idTF: number = 0;

  constructor(
          private typeFonctionService: TypeFonctionService,
          private alertCtrl: AlertController
          ) { }

  ngOnInit() {
      this.mode = 1;
      this.typeFonctionService.getAll().subscribe(data =>{
          this.typeFonctions = data;
          // console.log(this.typeFonctions);
      })
  }
  
  addNew() {
      this.typeFonction = new TypeFonction();
      this.mode = 2;
  }
  
  save() {
      if(this.typeFonctions != null) {
          this.typeFonctionService.create(this.typeFonction);
          this.mode = 1;
      }
      else{
          this.typeFonctionService.create(this.typeFonction);
          this.mode = 1;
      }
      
  }

    edit(t: TypeFonction) {
        this.mode = 3;
        this.typeFonctionService.getOne(t.idTypeFonction).subscribe(data=>{
            this.typeFonction = data;
        })
    }

    update() {
        this.typeFonctionService.update(this.typeFonction).subscribe(data=>{
                this.ngOnInit();
        })
    }

    async delete(t:TypeFonction) {
        let alert = await this.alertCtrl.create({
            header: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer <strong>'+t.libelleTypeFonction+'</strong>?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel confirmed');
                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        console.log('Oui');
                        this.typeFonctionService.delete(t.idTypeFonction).subscribe(res =>{
                            this.ngOnInit();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

}
