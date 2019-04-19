import { Usuario } from './acesso/usuario.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { reject } from 'q';
import { throws } from 'assert';
@Injectable()
export class Autenticacao{


    public token_id:string
    public mensagem_erro:string
    
    constructor(private router:Router) {
        
    }
    public cadastrarUsuario(usuario:Usuario):Promise<any>{
      return firebase.auth().createUserWithEmailAndPassword(usuario.email,usuario.senha).then((resposta:any)=>{
           //eliminamos a senha
            delete usuario.senha

            //adicionamos os dados complementares do utilizador a base de dados
           firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`).set(usuario) //btoa serve para criptografar, para descriptografar e so fazer atob
       }).catch((erro:Error)=>{throw erro});
       
    }

    public autenticar(email:string,senha:string):Promise<any>{
        
        return firebase.auth().signInWithEmailAndPassword(email,senha).then((resposta:any)=>(
            firebase.auth().currentUser.getIdToken().then((idtoken:string)=>{
                this.token_id=idtoken;
                localStorage.setItem('idToken',idtoken); //guarda no browser o valor de idtoken e este e guadado mesmo que o browser seja fechado
                this.router.navigate(['/main/home'])

            })
        ))
        .catch((error:Error)=>{
           throw error
        })            

        
    }


    public autenticado():boolean{

        if(this.token_id===undefined&&localStorage.getItem('idToken')!=null){
            this.token_id=localStorage.getItem('id_Token');
        }

        if(this.token_id===undefined){
            this.router.navigate([''])
        }
        return this.token_id!==undefined

        //retorna true se o valor de token_id for diferente de undifined
    }


    public sair():void{
        firebase.auth().signOut().then(()=>{
            localStorage.removeItem('idToken');
            localStorage.removeItem("firebase:host:jta-instagram-clone-ea2e0.firebaseio.com");
            this.token_id=undefined;
            //console.log("lougou efetuado")
            this.router.navigate(['/'])
        })
        
    }

  
}