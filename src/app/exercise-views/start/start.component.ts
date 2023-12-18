import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from 'src/app/exercise.service';
import { LoadService } from 'src/app/load.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(public exerciseService: ExerciseService,
              private loadService: LoadService,
              private router: Router,
              private route: ActivatedRoute) {}
              
  ngOnInit(): void {
    console.log('Route', this.route.snapshot.paramMap.get('user_code'));
    let user_code: string | null = this.route.snapshot.paramMap.get('user_code') ? this.route.snapshot.paramMap.get('user_code') : '';
    const storedExerciseString = localStorage.getItem('exercise')
    if (storedExerciseString) {
      const storedExercise = JSON.parse(storedExerciseString!);
      if (storedExercise.user_code === user_code) {
        console.log('From LocalStorage');
        this.exerciseService.ex_loaded = true;
        this.exerciseService.exercise = storedExercise;
        return;
      }
    }
    this.loadService.getCollectionByUserCode(user_code!);
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

  closeCollection() {
    localStorage.clear();
    this.router.navigate(['home']);
  }
}
