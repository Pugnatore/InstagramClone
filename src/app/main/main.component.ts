import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Autenticacao } from '../autenticacao.service';
import { PublicacoesComponent } from './home/publicacoes/publicacoes.component';
import { Bd } from '../bd.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { HomeComponent } from './home/home.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  
 
  
})
export class MainComponent implements OnInit {
  @ViewChild(HomeComponent) home: HomeComponent;
  email: string;
  

  constructor(private bd:Bd, private router:Router, private autenticacao:Autenticacao) { }

  ngOnInit() {
    // firebase.auth().onAuthStateChanged((user)=>{
    //   if(user!=null){
    //   this.email=user.email
    //   this.atualizarTimeLine()
    //   }
    // })
  }

  atualizarTimeLine(){
    this.home.atualizarTimeLine();
    this.router.navigate(['/main/home']);
  }

  public sair():void{
    this.autenticacao.sair();

  }
}

