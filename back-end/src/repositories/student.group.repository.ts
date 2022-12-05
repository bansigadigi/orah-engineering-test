import {EntityRepository, Repository} from "typeorm";
import { GroupStudent } from "../entity/group-student.entity";
import { Student } from "../entity/student.entity";
import { Groups } from "../interface/group.interface";
import { StudentList } from "../interface/student.interface";

@EntityRepository(GroupStudent)
export class GroupStudentsStudentRepository extends Repository<GroupStudent> {
    async deleteStudentsInGroup(groupId: number) {
        await this.createQueryBuilder("gs")
            .delete()
            .from(GroupStudent)
            .where("group_id = :id", { id: groupId })
            .execute()
    }

    async getStudentsInGroup(groupId: number): Promise<StudentList[]> {
        const studentNames: StudentList[] = await this.createQueryBuilder("gs")
            .innerJoin(Student, "s", "s.id = gs.student_id")
            .select(['s.first_name as first_name', 's.last_name as last_name','s.id as id'])
            .where("gs.group_id = :id", { id: groupId })
            .getRawMany()
        return studentNames
    }

    async saveAll(entities: Groups[]) {
        return await this.save(entities)
    }
}