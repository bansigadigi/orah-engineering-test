import { group } from "console";
import {EntityRepository, Repository} from "typeorm";
import { Group } from "../entity/group.entity";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
    getAllGroups():Promise<Group[]> {
        return this.find()
    }

   async updateStudentCount(group: Group, studentCount: number) {
        const runAt = new Date().toISOString()
        const res = await this.save({...group,student_count:studentCount,run_at:runAt})
        return res
    }
}