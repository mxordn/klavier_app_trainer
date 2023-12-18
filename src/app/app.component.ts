import { Component } from '@angular/core';

export const HOST: string = 'https://klavier-app-api.satzlehre-online.de'
export const Frontend_HOST: string = 'http://localhost:4200'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'piano-lab-train';

  constructor() {}
}
