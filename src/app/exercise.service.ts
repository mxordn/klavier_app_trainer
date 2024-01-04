import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CollectionModel, EmptyColl } from 'src/models/collection';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  exercise: CollectionModel = EmptyColl;
  ex_loaded: boolean = false;
  public newCollectionSet: BehaviorSubject<string>;

  constructor() {
    if (localStorage.getItem('exercise')) {
      this.exercise = JSON.parse(localStorage.getItem('exercise')!);
    }
    this.newCollectionSet = new BehaviorSubject('empty');
  }

  set_exercise(ex: CollectionModel) {
    this.exercise = ex;
    this.exercise.list_of_exercises.sort((a, b) => a.order_num - b.order_num);
    this.exercise.list_of_exercises.forEach((e) => {
      e.exercise_ids.sort((a, b) => a.order_num - b.order_num);
    });
  }
}
