import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectItemGroup } from 'primeng/api';
import { ChapterModel } from 'src/models/chapter';
import { CollectionModel, EmptyColl } from 'src/models/collection';
import { CourseModel, EmptyCourse } from 'src/models/course';

export interface ContentStruct {
  'name': string,
  'id': string
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  course: CourseModel = EmptyCourse;
  exercise: CollectionModel = EmptyColl;
  ex_loaded: boolean = false;
  current_user_code: string = "";
  content_structure: SelectItemGroup[] = [];
  exercise_type: string = "";
  is_collection: boolean = true;
  public newCollectionSet: BehaviorSubject<string>;

  constructor() {
    if (localStorage.getItem('exercise')) {
      this.exercise = JSON.parse(localStorage.getItem('exercise')!);
    }
    this.newCollectionSet = new BehaviorSubject('empty');
  }

  set_exercise(type: string, ex_coll: CollectionModel | null=null, ex_course: CourseModel | null=null) {
    // this.exercise = ex;
    console.log('Content Type:', type);
    console.log('data to set', ex_coll, ex_course)
    this.exercise_type = type;
    if (type === 'course' && ex_course) {
      this.current_user_code = ex_course.user_code;
      this.course = ex_course;
      this.is_collection = false;
      this.course.list_of_collections.forEach((coll: CollectionModel) => {
        this.sort_chapters(coll);
      });
      this.sortCollections();
      this.exercise = this.course.list_of_collections[0];
      this.setContentStructureCourse();
      console.log('ContentStructure set');
      if (this.course) {
        this.ex_loaded = true;
      }
      return
    }
    if (type === 'collection' && ex_coll) {
      this.current_user_code = ex_coll.user_code;
      this.course = EmptyCourse;
      this.is_collection = true;
      this.exercise = this.sort_chapters(ex_coll);
      this.setContentStructureCollection();
      console.log('ContentStructure set');
      this.ex_loaded = true;
    }
  }

  private sortCollections() {
    if (this.course.coll_order) {
      const order_list: string[] = this.course.coll_order.split(",");
      this.course.list_of_collections.sort(
        (a, b) => order_list.indexOf(a.id) - order_list.indexOf(b.id)
      );
    }
  }

  private setContentStructureCourse() {
    this.content_structure = [];
    if (this.course) {
      this.course.list_of_collections.forEach((coll: CollectionModel) => {
        let items: any[] = [];
        coll.list_of_exercises.forEach((chap: ChapterModel) => {
          items.push({label: chap.name, value: chap.id});
        });
        console.log('Gruppen_Liste:', {label: coll.display_name, value: coll.id, items: items});
        this.content_structure.push({label: coll.display_name, value: coll.id, items: items});
      });
    }
    console.log('Content Structure Course:', this.content_structure);
  }

  private setContentStructureCollection() {
    this.content_structure = [];
    let items: any[] = [];
    if (this.exercise && 'list_of_exercises' in this.exercise) {
      this.exercise.list_of_exercises.forEach((chap: ChapterModel) => {
        items.push({label: chap.name, value: chap.id})
      });
      this.content_structure = [];
      this.content_structure.push({'label': this.exercise.display_name,
        'value': this.exercise.id, 'items': items}
      );
    }
    console.log('Content Structure:', this.content_structure);
  }

  sort_chapters<CollectionModel>(ex: any) {
    ex.list_of_exercises.sort((a: ChapterModel, b: ChapterModel) => a.order_num - b.order_num);
      ex.list_of_exercises.forEach((e: ChapterModel) => {
        e.exercise_ids.sort((a, b) => a.order_num - b.order_num);
    });
    return ex
  }
}
