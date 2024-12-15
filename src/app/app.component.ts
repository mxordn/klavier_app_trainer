import { Component } from '@angular/core';
import { Router } from '@angular/router';

export const HOST: string = 'http://localhost:8000'

export const Frontend_HOST: string = 'http://localhost:4200/trainer'

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
