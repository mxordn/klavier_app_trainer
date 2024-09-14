import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';

import { HOST } from '../app.component';
import { ExerciseService } from '../exercise.service';
import { CollectionModel, EmptyColl } from 'src/models/collection';
import { CourseModel, CourseOrCollection } from 'src/models/course';
import { LoadService } from '../load.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {
  code: FormControl;
  exercise_type: string = "";

  constructor(private hC: HttpClient,
              private exerciseService: ExerciseService,
              private loadService: LoadService,
              private router: Router) {
    this.code = new FormControl('', Validators.required);
  }

  // testAPI() {
  //   return this.hC.get<CourseModel>(HOST + '/get_course/zbU8rI')
  //   .subscribe({
  //     next: (res) => {
  //       console.log('Again:', res);
  //       return res;
  //     }
  //   });
  // }

  openCollectionOrCourse() {
    // console.log('Hallo', HOST + '/get_collection_or_course/' + this.code.value)
    if (this.code.valid) {
      // this.hC.get<CourseOrCollection>(HOST + '/get_collection_or_course/zbU8rI').subscribe({
      //   next: (res) => {
      //     console.log('First Call', res.data);
      //   }
      // });
      const response: Observable<CourseOrCollection> = this.loadService.getCollectionOrCourseByUserCode(this.code.value);
      response.subscribe({
        next: (res) => {
          console.log('Response', res.type, res.course, res.collection);
          this.exercise_type = res.type;
          this.exerciseService.set_exercise(res.type, res.collection, res.course);
          this.loadService.writeToLS(res.type);
        },
        error: (err) => {
          console.log('Error: ', err);
        },
        complete: () => {
          console.log("Loaded…", this.exerciseService.ex_loaded)
          if (this.exerciseService.ex_loaded) {
            if (this.exercise_type === 'course') {
              console.log('Set exercise:', this.exerciseService.course);
              this.router.navigate(['start-course', this.exerciseService.course.user_code], {queryParams: {from_home: true}});
            } else {
              console.log('Set exercise:', this.exerciseService.exercise);
              this.router.navigate(['start-exercise', this.exerciseService.exercise.user_code], {queryParams: {from_home: true}});
            }
          }
                // }
                // else if (res.type === 'collection') {
                //     this.exerciseService.set_exercise(res.type, res.collection);
                //     this.exerciseService.ex_loaded = true;
                //     this.loadService.writeToLS(res.type);
                // } else {
                //   alert("Exercise not on the server.");
                //   this.exerciseService.exercise = EmptyColl;
                //   this.exerciseService.ex_loaded = false;
                //   this.router.navigate(['home'])
                // }
          // if (this.exercise_type === 'course') {
          //   this.loadService.getCourseByUserCode(this.code.value).subscribe({
          //     next: (value) => {
          //       console.log("Course:", value);
          //       this.exerciseService.set_exercise(this.exercise_type, value);
          //       this.exerciseService.ex_loaded = true;
          //       this.loadService.writeToLS(this.exercise_type);
          //     },
          //   });
          // }
        }
      });
    }
  }
}
