import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss']
})
export class ImpressumComponent {
  constructor(private router: Router) {}

  home() {
    this.router.navigate(['/home'])
  }
}
