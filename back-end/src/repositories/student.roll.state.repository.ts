import {EntityRepository, Repository} from "typeorm";
import { StudentRollState } from "../entity/student-roll-state.entity";
import { GroupResult } from "../interface/group.interface";

@EntityRepository(StudentRollState)
export class StudentRollStateRepository extends Repository<StudentRollState> {
    async getMatchingStudents(rollIds: number[], ltmt: string, incidents: number): Promise<GroupResult[]> {
        const result = await this.createQueryBuilder("studentRollState")
            .select("studentRollState.student_id", "student_id")
            .addSelect("COUNT(*)", "count")
            .where("studentRollState.roll_id IN (:...ids)", { ids: rollIds })
            .groupBy("studentRollState.student_id")
            .having(`count ${ltmt} ${incidents}`)
            .getRawMany()
        return result
    }
}