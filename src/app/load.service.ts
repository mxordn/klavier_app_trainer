import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ExerciseService } from './exercise.service';
import { HttpClient } from '@angular/common/http';
import { CollectionModel, EmptyColl } from 'src/models/collection';
import { HOST } from './app.component';
import { Observable } from 'rxjs';
import { ChapterModel } from 'src/models/chapter';
import { TabModel } from 'src/models/tab';
import { CourseModel, CourseOrCollection } from 'src/models/course';


export const loadedActivation: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean => {
  const exerciseService = inject(ExerciseService);
  const router = inject(Router);

  if (exerciseService.ex_loaded) {
    console.log('Darfsch rein!');
    return true;
  }
  let redirect = route.data['customURL'];
  console.log('Du kommsch hier net rein!');
  router.navigate(redirect);
  return false;
}

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  constructor(private exerciseService: ExerciseService,
              private hC: HttpClient) {}

  getCollectionOrCourseByUserCode(user_code: string): Observable<CourseOrCollection> {
    return this.hC.get<CourseOrCollection>(HOST + '/get_collection_or_course/' + user_code);
  }

  getCollectionByUserCode(user_code: string): Observable<CollectionModel> {
    return this.hC.get<CollectionModel>(HOST + '/get_collection/' + user_code);
  }

  getCourseByUserCode(user_code: string): Observable<CourseModel> {
    return this.hC.get<CourseModel>(HOST + '/get_course/' + user_code);
  }

  writeToLS(ex_type: string) {
    localStorage.setItem('user_code', this.exerciseService.exercise!.user_code!);
    localStorage.setItem('course', JSON.stringify(this.exerciseService.course));
    localStorage.setItem('exercise', JSON.stringify(this.exerciseService.exercise));
    localStorage.setItem('type', JSON.stringify(ex_type));
  }

  sortChapters(chapters: Array<ChapterModel>): Array<ChapterModel> {
    return chapters.sort((a, b) => this.sortPredicate(a, b));
  }

  sortTabs(tabs: Array<TabModel>): Array<TabModel> {
    return tabs.sort((a, b) => this.sortPredicate(a, b));
  }

  private sortPredicate(a: any, b: any) {
    if (a['order_num'] < b['order_num']) {
      return -1
    }
    if (a['order_num'] > b['order_num']) {
      return 1
    }
    return 0
  }
}
