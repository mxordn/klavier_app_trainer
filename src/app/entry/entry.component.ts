import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';

import { HOST } from '../app.component';
import { ExerciseService } from '../exercise.service';
import { CollectionModel, EmptyColl } from 'src/models/collection';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {
  code: FormControl;

  constructor(private hC: HttpClient,
              private exerciseService: ExerciseService,
              private router: Router) {
    this.code = new FormControl('', Validators.required);
  }
  
  openCollection() {
    console.log('Hallo', HOST + '/get_collection/' + this.code.value)
    if (this.code.valid) {
      this.hC.get<CollectionModel>(HOST + '/get_collection/' + this.code.value).subscribe({
        next: (res) => {
          console.log('Response', res)
          if (res) {
            this.exerciseService.exercise = res;
            this.exerciseService.ex_loaded = true;
          } else {
            alert("Exercise not on the server.");
            this.exerciseService.exercise = EmptyColl;
            this.exerciseService.ex_loaded = false;

          }
        },
        error: (err) => {
          console.log('Error: ', err);
        },
        complete: () => {
          console.log(this.exerciseService.exercise);
          if (this.exerciseService.ex_loaded) {
            this.router.navigate(['start-exercise', this.exerciseService.exercise.user_code]);
          }
        }
      });
    }
  }
}
