import { ChapterModel } from "./chapter"
import { CollectionModel, EmptyColl } from "./collection"

export interface CourseOrCollection {
    'type': string,
    'course': CourseModel | null,
    'collection': CollectionModel | null
}

export interface CourseModel {
    display_name: string,
    owner: string,
    coll_order: string | null,
    course_description: string,
    user_code: string,
    id: string,
    list_of_collections: CollectionModel[],
}

export const EmptyCourse: CourseModel = {
    display_name: '',
    coll_order: '',
    course_description: '',
    owner: '',
    user_code: '',
    id: '',
    list_of_collections: [],
  }
