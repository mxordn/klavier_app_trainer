import { Component } from '@angular/core';
import { Router } from '@angular/router';

export const HOST: string = 'https://klavier-app-api.satzlehre-online.de'
export const Frontend_HOST: string = 'https://piano-lab.satzlehre-online.de'
//'http://localhost:4200'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'piano-lab-train';

  constructor(private router: Router) {}

  open_impressum() {
    this.router.navigate(['/impressum']);
  }
}
