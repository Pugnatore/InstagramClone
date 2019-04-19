import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('publicacoes') public publicacoes:any
  constructor() { }

  ngOnInit() {
    
  }

  

  public atualizarTimeLine(){
    this.publicacoes.atualizarTimeLine()
  }
}
