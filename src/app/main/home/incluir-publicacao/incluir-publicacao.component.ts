import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Progresso } from 'src/app/progresso.service';
import { Bd } from 'src/app/bd.service';
import * as firebase from 'firebase';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public email:string
  private imagem:any
  @Output() public atualizarTimeLine:EventEmitter<any>=new EventEmitter<any>()
  public progressoPublicacao:string='pendente'
  public percentagemUpload:number
  public formulario:FormGroup=new FormGroup({
    "titulo":new FormControl(null)
  })
  constructor(private bd:Bd, private progresso:Progresso) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user!=null){
      this.email=user.email
      }
    })

    //console.log(this.progressoPublicacao)
  }

  public publicar():void{
    this.bd.publicar({
      email:this.email,
      titulo:this.formulario.value.titulo,
      imagem:this.imagem[0],
      publicador:this.email
    })

    let continua=new Subject()
    continua.next(true)

       let acompanhamentoUpload=interval(1500)


      acompanhamentoUpload.pipe(takeUntil(continua)).subscribe(()=>
      {
        //console.log(this.progresso.estado)
        //console.log(this.progresso.status)
        this.progressoPublicacao='andamento'
        this.percentagemUpload=Math.round((this.progresso.estado.bytesTransferred/this.progresso.estado.totalBytes)*100)


        if(this.progresso.status==='concluido'){
          this.progressoPublicacao='concluido'
          continua.next(false)
          this.atualizarTimeLine.emit()
          //console.log('inc-pub')
        } //isto faz uma especia de unsubscribe quando o status e concluido
      })
      

  }

  public preparaImagemUpload(event:Event):void{
    this.imagem=(<HTMLInputElement>event.target).files

  }
}
