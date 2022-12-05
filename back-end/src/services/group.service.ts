import { getCustomRepository } from "typeorm"
import { apiConstants } from "../constants/apiConstants"
import { GroupStudent } from "../entity/group-student.entity"
import { Group } from "../entity/group.entity"
import { calculateStartDate, generateRandomId, totalStudentCountMatchingGroup } from "../helpers/helper"
import { GroupResult, Groups } from "../interface/group.interface"
import { StudentList } from "../interface/student.interface"
import { GroupRepository } from "../repositories/group.repository"
import { RollRepository } from "../repositories/roll.repository"
import { GroupStudentsStudentRepository } from "../repositories/student.group.repository"
import { StudentRollStateRepository } from "../repositories/student.roll.state.repository"

export async function runGroupFilters() {
    try {
        const grpRepository = getCustomRepository(GroupRepository)
        const rollRepository = getCustomRepository(RollRepository)
        const studentRollStateRepository = getCustomRepository(StudentRollStateRepository)
        const studentsGrpRepository = getCustomRepository(GroupStudentsStudentRepository)
        const res = await grpRepository.getAllGroups()
        if (!res) throw new Error(apiConstants.NO_GROUP_FOUND)
        const arr = res.map((group: Group) => {
            return new Promise(async (resolve, reject) => {
                try {
                    await studentsGrpRepository.deleteStudentsInGroup(group.id)
                    const startDate: string = calculateStartDate(group.number_of_weeks)
                    const rollIds: number[] = await rollRepository.getRollIdsByGroupConfig(group.roll_states, startDate)
                    const result: GroupResult[] = await studentRollStateRepository.getMatchingStudents(rollIds, group.ltmt, group.incidents)
                    const studentCount = totalStudentCountMatchingGroup(result)
                    const entities: Groups[] = result.map((res) => {
                        return { student_id: res.student_id, group_id: group.id, incident_count: res.count }
                    })
                    await studentsGrpRepository.saveAll(entities)
                    await grpRepository.updateStudentCount(group, studentCount)
                    resolve(1)
                } catch (err) {
                    reject(err.message)
                }
            })
        })
        const [result] = await Promise.all(arr)
        return result
    } catch (error) {
        throw new Error(apiConstants.RULE_EXCECUTION_FAILED)
    }
}

export async function getAllStudentsInTheGroup(groupId: number) {
    try {
        const studentGrpRepository = getCustomRepository(GroupStudentsStudentRepository)
        const studentList = await studentGrpRepository.getStudentsInGroup(groupId)
        return studentList.map((student: StudentList) => {
            return { ...student, full_name: `${student.first_name} ${student.last_name}` }
        })
    } catch (error) {
        throw new Error(apiConstants.FETCH_STUDENTS_GROUP_FAILED)
    }
}