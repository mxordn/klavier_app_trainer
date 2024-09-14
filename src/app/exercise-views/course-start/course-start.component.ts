import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseOrCollection } from 'src/models/course';
import { ExerciseService } from 'src/app/exercise.service';
import { LoadService } from 'src/app/load.service';

@Component({
  selector: 'app-start',
  templateUrl: './course-start.component.html',
  styleUrls: ['./course-start.component.scss']
})
export class CourseStartComponent implements OnInit {
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
      if (uc != null && uc === localStorage.getItem('user_code')) {
        console.log('Load from local Storage…')
        this.exerciseService.set_exercise(localStorage.getItem('type')!,
             JSON.parse(localStorage.getItem('exercise')!),
             JSON.parse(localStorage.getItem('course')!));
        return;
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
          this.router.navigate(['home']);
        }
      }
    }
  }

  openCollection(coll_id: string) {
    console.log('Collection open', coll_id);
    this.router.navigate(['start-exercise', coll_id])
  }

  openChapter(coll_id: string) {
    console.log('Collection open', coll_id);
    this.router.navigate(['chapter', coll_id])
  }

  openCourseFromSidebar(e: any) {
    console.log("value:", e.option.value)
    this.openChapter(e.option.value);
    this.sidebarVisible = false;
  }

  closeCourse() {
    localStorage.clear();
    this.exerciseService.content_structure = [];
    this.router.navigate(['home'])
  }

  toggleSidebar() {
    if (this.sidebarVisible === false) {
      this.sidebarVisible = true
    } else {
      this.sidebarVisible = false;
    }
  }
}
