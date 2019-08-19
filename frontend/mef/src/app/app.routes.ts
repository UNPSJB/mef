import {NgModule} from '@angular/core';
import { DinosuarioMostrarComponent } from './components/dinosuario-mostrar/dinosuario-mostrar.component';
import { Routes, RouterModule } from '@angular/router';
import { APP_ROOT } from '@angular/core/src/di/scope';
import { AppComponent } from './app.component';

const app_routes: Routes = [
    { path: 'dinosaurios', component: DinosuarioMostrarComponent}
    // { path: '**', pathMatch: 'full', redirectTo:'/' }    
];

@NgModule({
    imports: [RouterModule.forRoot(app_routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}