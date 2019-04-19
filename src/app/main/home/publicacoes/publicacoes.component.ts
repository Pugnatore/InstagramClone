import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Publicacao } from 'src/app/shared/publicacao.module';
import { Bd } from 'src/app/bd.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit, OnDestroy {
  public email:string
  public publicacoes:Publicacao[];
  public gostou:boolean=false;
  
  constructor(private bd:Bd) { }

  ngOnInit() {
    
    firebase.auth().onAuthStateChanged((user)=>{
      if(user!=null){
      
      this.email=user.email
      this.atualizarTimeLine()
      }
    })
    this.atualizarTimeLine();

  }

  public atualizarTimeLine(){
    
    this.bd.consultaPublicacoes(this.email)
    .then((publicacoes:any)=>{
      this.publicacoes=publicacoes
      
    })
    
  }

  public gostar(publicacao:any){

    
    firebase.auth().onAuthStateChanged((user)=>{
      this.email=user.email
      this.bd.adicionarGosto(publicacao, this.email).then((pub:any)=>{
        let itemPubEncontrado= this.publicacoes.findIndex((item:Publicacao)=>item.key==pub.key)
        this.publicacoes[itemPubEncontrado].peopleThatLiked=pub.peopleThatLiked
        
      })
      
    })
   
  }


  public mostrarComentarios(publicacao:any){
    
    let itemPubEncontrado= this.publicacoes.findIndex((item:Publicacao)=>item.key==publicacao.key)
    
    this.publicacoes[itemPubEncontrado].mostrar_comentarios=!this.publicacoes[itemPubEncontrado].mostrar_comentarios
  }

  ngOnDestroy(){
    console.log("destroyed")
  }

}
