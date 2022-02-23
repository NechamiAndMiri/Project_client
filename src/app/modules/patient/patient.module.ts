import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient/patient.component';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import {SliderModule} from 'primeng/slider'
import {ContextMenuModule} from 'primeng/contextmenu';
import {SlideMenuModule} from 'primeng/slidemenu';
import {ToolbarModule} from 'primeng/toolbar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabViewModule } from 'primeng/tabview/tabview';
// import { SharedModule, PanelModule } from 'primeng/primeng';


const ROUTES:Routes=[
{path:"",component:PatientComponent}
]

@NgModule({
  declarations: [
    PatientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SliderModule,
    SlideMenuModule,
    ContextMenuModule,
    ToolbarModule,
    TabViewModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PatientModule { }
