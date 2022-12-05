export interface CreateStudentInput {
  first_name: string
  last_name: string
  photo_url: string
}

export interface UpdateStudentInput {
  id: number
  first_name: string
  last_name: string
  photo_url: string
}

export interface StudentList {
  id: number
  first_name: string
  last_name: string
  full_name: string
}
