import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../usuario.model';
import { Autenticacao } from 'src/app/autenticacao.service';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {

  @Output() public exibirPainel:EventEmitter<string>=new EventEmitter<string>()
  @Output() public erroCadastro:EventEmitter<string>=new EventEmitter<string>()
  public erro:string
  
public formulario:FormGroup=new FormGroup({
  'email':new FormControl(null, [Validators.required]),
  'nome_completo':new FormControl(null,[Validators.required]),
  'nome_usuario':new FormControl(null,[Validators.required]),
  'senha':new FormControl(null,[Validators.required, Validators.minLength(6)]),

})

public estadoPainel='erro';
  
  constructor(private auth:Autenticacao) { }

  ngOnInit() {
  }

  public fazerLogin():void{
    this.exibirPainel.emit('login')
  }

  public cadastrarUsuario():void{
    let usuario:Usuario=new Usuario(this.formulario.value.email,this.formulario.value.nome_completo,this.formulario.value.nome_usuario, this.formulario.value.senha)
    this.auth.cadastrarUsuario(usuario).then(()=>this.fazerLogin()).catch((erro:any)=>{this.erro=erro; this.erroCadastro.emit()});
  }



}
