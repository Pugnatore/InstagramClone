import * as firebase from 'firebase'
import { Injectable } from '@angular/core';
import { Progresso } from './progresso.service';
import { reject } from 'q';
import { Publicacao } from './shared/publicacao.module';
import { Observable } from 'rxjs';
@Injectable()
export class Bd{

    
    constructor(private progresso:Progresso) {
        
        
    }

    public publicar(publicacao:any):void{
        //console.log(publicacao)
        
        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`).push({titulo:publicacao.titulo, publicador:publicacao.email}).then((resposta:any)=>{
            let nomeImagem=resposta.key //o nome da imagem fica com o o nome do documento do email do utilizador em base64 assim garantimos que e unico
       
            firebase.storage().ref().child(`imagens/${nomeImagem}`)
                .put(publicacao.imagem)
                .on(firebase.storage.TaskEvent.STATE_CHANGED,  //fica  a escuta de todos os estado em termmos de progresso do upload por exemplo o numero de bytes trasnferidos e a percentagem concluida
            (snapshot:any)=>{
                this.progresso.status="andamento"
                this.progresso.estado=snapshot
                
            }, 
            (error)=> {
                this.progresso.estado="erro"
                
            }, 
            ()=>{
                this.progresso.status="concluido" 
                
            }
            )
        })



        
        
        
    }



    public consultaPublicacoes(emailUsuario:string):Promise<any>{

       return  new Promise((resolve,reject)=>{
           //o once faz o mesmo que o on() mas apenas tira um snapshot ou seja no momento em que for executado vai tirar uma especie de foto dos documentos do firebase com o apth que passamos por referencia
           firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
           .orderByKey()
           .once('value')
           .then((snapshot:any)=>{
               //console.log(snapshot.val()) //retorna todos os valores do no publicacoes/email e dos respetivos filhos

               let publicacoes:Array<Publicacao>=[] //podiamos ter criado um Model publicacao e preencher com os dados relativos a publicação


               snapshot.forEach((childSnapshot:any) => {
                    let publicacao=childSnapshot.val()
                    
                    publicacao.key=childSnapshot.key
                    publicacoes.push(publicacao)
                    
                   
               });
              // resolve(publicacoes)
              return publicacoes.reverse()
           }).then((publicacoes:any)=>{

                publicacoes.forEach((publicacao)=>{
                    firebase.storage().ref().child(`imagens/${publicacao.key}`).getDownloadURL()
                    .then((url:string)=>{
                        publicacao.url_imagem=url
                        //consultar i nome do usuario
                        firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`).once('value')
                        .then((snapshot:any)=>{
                            publicacao.nome_usuario=snapshot.val().nome_usuario
                            })
                
                      })
                    
                 })
                 
                 resolve(publicacoes)

                    
            })

          
       })
        
       

            
    }
    public adicionarGosto(publicacao:any, email:string):Promise<any>{

        return  new Promise((resolve,reject)=>{
        firebase.database().ref(`publicacoes/${btoa(publicacao.publicador)}/${publicacao.key}`).once('value',function(snapshot:any){
            //console.log(snapshot.val().peopleThatLiked)
             if(snapshot.val().peopleThatLiked!==""){
                firebase.database().ref(`publicacoes/${btoa(publicacao.publicador)}/${publicacao.key}`).update({peopleThatLiked:'' }).then((response:any)=>{
                firebase.database().ref(`publicacoes/${btoa(publicacao.publicador)}/${publicacao.key}`).once('value',function(child_snapshot:any){
                    //console.log('child_snapshot_if:',child_snapshot.val())
                    let pub=child_snapshot.val();
                    pub.key=publicacao.key;
                    //console.log(pub)
                    resolve(pub);
                    
                
                
                     }).catch((error:any)=>{
                         console.log(error)
                     })

               
               }).catch((error:any)=>{
                   reject(error)
               })
            //console.log( snapshot.val().peopleThatLiked);
             }
             else{
              console.log("entrou else")
            
            firebase.database().ref(`publicacoes/${btoa(publicacao.publicador)}/${publicacao.key}`).update({peopleThatLiked:email }).then((response:any)=>{

                firebase.database().ref(`publicacoes/${btoa(publicacao.publicador)}/${publicacao.key}`).once('value',function(child_snapshot:any){
                    //console.log('child_snapshot_else:',child_snapshot.val())
                    let pub=child_snapshot.val();
                    pub.key=publicacao.key;
                    //console.log(pub)
                    resolve(pub);
                
                
                     })
                     .catch((error:any)=>{console.log(error)})
               }).catch((error:any)=>{reject(error)})
            }
        });

        


    })
    }
}

