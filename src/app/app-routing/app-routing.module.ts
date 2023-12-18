import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from '../entry/entry.component';
import { StartComponent } from '../exercise-views/start/start.component';
import { loadedActivation } from '../load.service';
import { ChapterViewComponent } from '../exercise-views/chapter-view/chapter-view.component';

const appRoutes: Routes = [
  {path: '', component: EntryComponent},
  {path: 'home', component: EntryComponent},
  {path: 'start-exercise/:user_code', component: StartComponent, canActivate: [], data: {customUrl: 'home'}},
  {path: 'chapter/:chapter_id', component: ChapterViewComponent, children: [
    {path: ":tab_num", component: ChapterViewComponent}
  ]},
  { path: '**', component: EntryComponent}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {enableTracing: true}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }