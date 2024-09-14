import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Frontend_HOST, HOST } from 'src/app/app.component';
import { CourseOrCollection } from 'src/models/course';
import { ExerciseService } from 'src/app/exercise.service';
import { LoadService } from 'src/app/load.service';
import { ChapterModel, EmptyChapter } from 'src/models/chapter';
import { CollectionModel, EmptyColl } from 'src/models/collection';

@Component({
  selector: 'app-chapter-view',
  templateUrl: './chapter-view.component.html',
  styleUrls: ['./chapter-view.component.scss'],
  providers: [MessageService]
})
export class ChapterViewComponent implements OnInit {
  chapterData: ChapterModel = EmptyChapter;
  chapter_id: string | null = null;
  tab_id: string | null = null;
  user_code: string | null = null;
  audio_icon: "pi pi-play" | "pi pi-pause" = "pi pi-play"
  audioPlayer = new Audio();
  activeTab: number = 0;
  Info_visible: boolean = false;
  sidebarVisible: boolean = false;

  Media_HOST: string;

  constructor(private route: ActivatedRoute,
              private loadService: LoadService,
              private router: Router,
              private messageService: MessageService,
              public exerciseService: ExerciseService) {
    // this.exerciseService.newCollectionSet.subscribe((val) => {
    //   if (val === 'set') {
    //     this.setChapter(this.chapter_id)
    //   }
    // });
    this.Media_HOST = HOST + '/serve_media/' + this.exerciseService.exercise.user_code + '/';
  }

  ngOnInit(): void {
    //console.log('Route', this.route.snapshot.paramMap.get('user_code'));
    //check if uc queryparam is there
    // => external access (e.g. via a link)
    // => look if also a tab info is there
    // => right collection loaded? if no call loadService. Observable :)
    //if no uc param is provided an internal routing from the start-exercise page has happend
    // => tab is automatically the first in the row.
    console.log('SubRoute', this.route.snapshot.paramMap.keys);
    console.log(this.route.snapshot.paramMap.get('chapter_id'));
    console.log(this.route.snapshot.queryParamMap.get('uc'));
    //console.log('Child:', this.route.snapshot.children[0].paramMap.get('tab_num'));
    this.user_code = this.route.snapshot.queryParamMap.get('uc');
    this.chapter_id = this.route.snapshot.paramMap.get('chapter_id');
    // if (this.user_code) {
    //   if (this.chapter_id) {
    //     this.setChapter(this.chapter_id);
    //     console.log('chapter set from user_code')
    //   } else {
    //     alert("Kapitel ID nicht angegeben.");
    //     this.router.navigate(['home']);
    //     return;
    //   }
    // };

    console.log(localStorage.getItem('user_code'));
    if (this.user_code && this.user_code != localStorage.getItem('user_code')) {
      console.log('Loading new exercise from server…')

      this.Media_HOST = HOST + '/serve_media/' + this.user_code + '/';
      const resp = this.loadService.getCollectionOrCourseByUserCode(this.user_code);
      resp.subscribe({
        next: (res: CourseOrCollection) => {
          if (res) {
            this.exerciseService.set_exercise(res.type, res.collection, res.course);
            // this.loadService.sortChapters(this.exerciseService.exercise.list_of_exercises);
            // this.exerciseService.exercise.list_of_exercises.forEach((chap: ChapterModel) => {
            //   this.loadService.sortTabs(chap.exercise_ids);
            // });
            // console.log(this.exerciseService.exercise.list_of_exercises)
            this.exerciseService.ex_loaded = true;
            this.loadService.writeToLS(res.type);
            // localStorage.setItem('user_code', this.user_code!)
            // localStorage.setItem('exercise', JSON.stringify(this.exerciseService.exercise));
          } else {
            this.exerciseService.set_exercise('collection', EmptyColl);
            this.exerciseService.ex_loaded = false;
            this.router.navigate(['home']);
            return;
          }
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['home']);
        },
        complete: () => {
          console.log('Successfully opened!');
          this.exerciseService.newCollectionSet.next('set');
          this.setChapter(this.chapter_id);
          //look for tab info
          this.setTab();
        }
      });
      // return;
    } else {
      console.log("Loading Chapter from LocalStorage", localStorage.getItem('type'));
      this.exerciseService.set_exercise(localStorage.getItem('type')!,
                 JSON.parse(localStorage.getItem('exercise')!),
                 JSON.parse(localStorage.getItem('course')!));
      if (this.chapter_id) {
        this.setChapter(this.chapter_id);
        this.setTab();
      }
    }
  }

  private setTab() {
    const tab_info = this.route.snapshot.queryParamMap.get('tab');
    if (tab_info) {
      let tab_num: number = parseInt(tab_info);
      console.log(tab_num, this.chapterData.exercise_ids.length)
      if (tab_num <= this.chapterData.exercise_ids.length) {
        this.activeTab = tab_num;
        console.log('Tab', this.activeTab);
      } else {
        alert("Tab nicht gefunden");
      }
    }
  }

  openChapterFromSidebar(e: any) {
    console.log(e);
    this.setChapter(e.option.value);
    this.activeTab = 0;
    this.sidebarVisible = false;
  }

  toggleSidebar() {
    if (this.sidebarVisible === false) {
      this.sidebarVisible = true
    } else {
      this.sidebarVisible = false;
    }
    // if (this.route.snapshot.paramMap.get('chapter_id')) {
    //   let chapter_id: string = this.route.snapshot.paramMap.get('chapter_id')!;
    //   this.exerciseService.exercise.list_of_exercises.forEach((chap) => {
    //     if (chap.id === chapter_id) {
    //       this.chapterData = chap;
    //       return;
    //     }
    //   });
    // }
    // this.route.snapshot.children.forEach((entry) => {
      //   console.log(entry, entry.paramMap.get('chapter_id'), );
    // });
    //children.paramMap.get('chapter_id'));
  }

  setChapter(chapter_id: string | null) {
    console.log("Chapter set begins", this.exerciseService.exercise_type === "course");
    // probably need to set another exercise before moving to the chapter
    if (this.exerciseService.exercise_type === "\"course\"") {
      console.log("Chapter set begins again", this.exerciseService.exercise_type);
      this.exerciseService.course.list_of_collections.forEach((c: CollectionModel) => {
        console.log("Coll:", c.display_name, c.id, chapter_id);
        c.list_of_exercises.forEach((chap) => {
          console.log("Kapitel:", chap.name, chap.id, chapter_id);
          if (chap.id === chapter_id) {
            this.exerciseService.exercise = c;
          }
        });
      });
      console.log(this.exerciseService.exercise.id, chapter_id)
    }
    this.exerciseService.exercise.list_of_exercises.forEach((chap: ChapterModel) => {
      if (chap.id === chapter_id) {
        this.chapterData = chap;
        this.Media_HOST = HOST + '/serve_media/' + this.exerciseService.exercise.user_code + '/';
        console.log('chapter set!')
        return;
      }
    });
    if (this.chapterData === EmptyChapter) {
      console.log(this.exerciseService.exercise);
      console.log(this.chapterData, chapter_id);
      alert("Kapitel nicht in der Sammlung");
      this.router.navigate(['home']);
    }
  }

  playPauseAudio() {
    if (this.audio_icon === "pi pi-play") {
      this.audioPlayer.src = HOST + '/serve_media/' + this.exerciseService.exercise.user_code + '/' + this.chapterData.exercise_ids[this.activeTab].audio_url;
      this.audio_icon = "pi pi-pause";
      this.audioPlayer.play();
      this.audioPlayer.onended = () => {
        this.audio_icon = "pi pi-play";
      }
    } else {
      this.audioPlayer.pause();
      this.audio_icon = "pi pi-play";
    }
  }

  back() {
    this.router.navigate(['start-exercise', this.exerciseService.exercise.user_code])
  }

  openInfo() {
    this.Info_visible = true;
  }

  copyLink(tab: number=0) {
    let queryParam: string = '?uc=' + this.exerciseService.exercise.user_code;
    if (tab != 0) {
      queryParam += '&tab=' + tab;
    }
    navigator.clipboard.writeText(Frontend_HOST + '/chapter/' + this.chapterData.id + queryParam);
    this.messageService.add({key: 'bc', severity: 'success', summary: 'Kopiert', detail: 'Link in die Zwischenablage kopiert.'});
    console.log(this.messageService);
    console.log('Link kopiert')
  }
}
