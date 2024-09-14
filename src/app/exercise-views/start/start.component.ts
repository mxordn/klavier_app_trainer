import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseOrCollection } from 'src/models/course';
import { ExerciseService } from 'src/app/exercise.service';
import { LoadService } from 'src/app/load.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  sidebarVisible: boolean = false;

  constructor(public exerciseService: ExerciseService,
              private loadService: LoadService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('Route', this.route.snapshot.paramMap.get('user_code'));
    const user_code: string | null = this.route.snapshot.paramMap.get('user_code');
    const uc: string | null = this.route.snapshot.paramMap.get('user_code');
    if (this.route.snapshot.queryParamMap.get('from_home') === 'true') {
      console.log('Chill… everthing is already done.');
      return;
    }
    else {
      console.log("Course-check", this.exerciseService.exercise_type);
      if (uc != null && uc === localStorage.getItem('user_code')) {
        console.log('Load from local Storage…')
        this.exerciseService.set_exercise(localStorage.getItem('type')!, JSON.parse(localStorage.getItem('exercise')!));
        return;
      }
      else if (this.exerciseService.exercise_type === "\"course\"") {
        console.log("Course-check")
        this.exerciseService.course.list_of_collections.forEach((coll) => {
          if (coll.user_code === user_code) {
            this.exerciseService.exercise = coll;
            return;
          }
        });
      }
      else {
        console.log('Reload from server…');
        if (user_code) {
          const res = this.loadService.getCollectionOrCourseByUserCode(user_code);
          res.subscribe({
            next: (exercise: CourseOrCollection) => {
              this.exerciseService.set_exercise(exercise.type, exercise.collection, exercise.course);
              // this.exerciseService.set_exercise(exercise.type, exercise);
              this.exerciseService.ex_loaded = true;
              this.loadService.writeToLS(exercise.type);
            }
          });
        } else {
          alert('No user code given.');
        }
      }
    }
  }

  toggleSidebar() {
    if (this.sidebarVisible === false) {
      this.sidebarVisible = true
    } else {
      this.sidebarVisible = false;
    }
  }

  openChapterFromSidebar(e: any) {
    this.openChapter(e.option.value);
    this.sidebarVisible = false;
  }

  openChapter(chapterId: string) {
    console.log('Chapter:', chapterId);
    //console.log('lS:', this.exerciseService.exercise.list_of_exercises);

    // this.exerciseService.exercise.list_of_exercises.forEach((chap) => {
    //   if (chap.order_num === chapterIndex + 1) {
    //     let chapterId: string = chap.id;
    //   }
    // });
    this.router.navigate(['chapter', chapterId])
  }
  courseStart() {
    this.router.navigate(['start-course', this.exerciseService.course.user_code])
  }

  closeCollection() {
    localStorage.clear();
    this.exerciseService.content_structure = [];
    this.router.navigate(['home']);
  }
}
