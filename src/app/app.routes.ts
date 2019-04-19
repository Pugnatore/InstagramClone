import {Routes} from '@angular/router'
import { AcessoComponent } from './acesso/acesso.component';
import { HomeComponent } from './main/home/home.component';
import { AutenticacaoGuard } from './autenticacao-guard.service';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './main/profile/profile.component';



export const ROUTES:Routes=[
    {path:'', component:AcessoComponent},
    { path: "main", component: MainComponent, canActivate:[AutenticacaoGuard], children: [
        { path: "home",component:HomeComponent},
        { path: "profile",component:ProfileComponent}]
    }
    
    
]
