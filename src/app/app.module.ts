import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { AppComponent } from './app.component';
import { StartComponent } from './exercise-views/start/start.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { EntryComponent } from './entry/entry.component';
import { MarkdownPipe } from './markdown.pipe';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ChapterViewComponent } from './exercise-views/chapter-view/chapter-view.component';
import { APP_BASE_HREF } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ImpressumComponent,
    EntryComponent,
    MarkdownPipe,
    ChapterViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AutoFocusModule,
    CardModule,
    DialogModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    MessagesModule,
    PanelModule,
    TabViewModule,
    ToastModule,
    ToolbarModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/trainer/'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
