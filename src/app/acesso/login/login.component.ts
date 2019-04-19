import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Autenticacao } from 'src/app/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() public exibirPainel:EventEmitter<string>=new EventEmitter<string>();

  public erro:string
 public formulario:FormGroup=new FormGroup({
   'email':new FormControl(null,[Validators.required, Validators.email]),
   'senha':new FormControl(null, [Validators.required,Validators.minLength(6)])
 })
 
  constructor(private autenticacao:Autenticacao) { }

  ngOnInit() {
  }

  public exibirPainelCadastro():void{
    this.exibirPainel.emit('cadastro');
  }

  public autenticar(){
   this.autenticacao.autenticar(this.formulario.value.email, this.formulario.value.senha).then().catch((error:Error)=>this.erro=error.message)
   
  }
}
