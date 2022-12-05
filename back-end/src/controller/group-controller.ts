import { NextFunction, Request, Response } from "express"
import { getRepository } from "typeorm"
import { apiConstants } from "../constants/apiConstants"
import { Group } from "../entity/group.entity"
import { ErrorMessage } from "../interface/error.interface"
import { CreateGroupInput, GroupResult, UpdateGroupInput } from "../interface/group.interface"
import { StudentList } from "../interface/student.interface"
import { getAllStudentsInTheGroup, runGroupFilters } from "../services/group.service"

export class GroupController {

  private grpRepository = getRepository(Group)

  async allGroups(request: Request, response: Response, next: NextFunction) {
    return this.grpRepository.find()
  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    try {
      const { body: params } = request
      const createGroupInput: CreateGroupInput = {
        name: params.name,
        number_of_weeks: params.numberOfWeeks,
        roll_states: params.rollStates,
        incidents: params.incidents,
        ltmt: params.ltmt,
        student_count: params?.studentCount ? params?.studentCount : 0
      }

      const group = this.grpRepository.create({ ...createGroupInput })
      return await this.grpRepository.save(group)
    } catch (error) {
      const err: ErrorMessage = {
        message: apiConstants.UNSUCCESS,
        error: apiConstants.CREATION_GROUP_FAILED
      }
      return err

    }
  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    try {
      const { body: params } = request

      const updateGroupInput: UpdateGroupInput = {
        id: params.id,
        name: params.name,
        number_of_weeks: params.numberOfWeeks,
        roll_states: params.rollStates,
        incidents: params.incidents,
        ltmt: params.ltmt,
        student_count: params?.studentCount ? params?.studentCount : 0
      }

      const group = this.grpRepository.findOne(params.id)
      if (!group) throw new Error(apiConstants.NO_GROUP_FOUND)
      return await this.grpRepository.save({ ...group, ...updateGroupInput })
    } catch (error) {
      const err: ErrorMessage = {
        message: apiConstants.UNSUCCESS,
        error: error.message
      }
      return err
    }
    // Update a Group
  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1: 
    try {
      const grpToRemove = await this.grpRepository.findOne(request.body.id)
      if (!grpToRemove) throw new Error(apiConstants.NO_GROUP_FOUND)
      return await this.grpRepository.remove(grpToRemove)
    } catch (error) {
      const err: ErrorMessage = {
        message: apiConstants.UNSUCCESS,
        error: error.message
      }
      return err
    }
    // Delete a Group
  }

  async getGroupStudents(request: Request, response: Response, next: NextFunction) {
    try {
      const result: StudentList[] = await getAllStudentsInTheGroup(request?.params?.id)
      return result
    } catch (error) {
      const err: ErrorMessage = {
        message: apiConstants.UNSUCCESS,
        error: error.message
      }
      return err
    }
  }


  async runGroupFilters(request: Request, response: Response, next: NextFunction, connection: any) {
    try {
      const result = await runGroupFilters()
      return {
        message: apiConstants.SUCCESS,
        error: ""
      }
    } catch (error) {
      const err: ErrorMessage = {
        message: apiConstants.UNSUCCESS,
        error: error.message
      }
      return err
    }
  }
}
