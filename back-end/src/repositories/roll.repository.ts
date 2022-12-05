import {EntityRepository, Repository} from "typeorm";
import { Roll } from "../entity/roll.entity";
import { StudentRollState } from "../entity/student-roll-state.entity";

@EntityRepository(Roll)
export class RollRepository extends Repository<Roll> {
    async getRollIdsByGroupConfig(state: string, startDate: string): Promise<number[]> {
        const endDate = new Date().toISOString()
        const rollIds: { roll_id: number }[] = await this.createQueryBuilder("roll")
            .innerJoin(StudentRollState, "s", "s.roll_id = roll.id")
            .select("roll.id")
            .where("s.state = :state", { state: state })
            .andWhere('roll.completed_at >= :start_at', { start_at: startDate })
            .andWhere('roll.completed_at <= :end_at', { end_at: endDate })
            .getRawMany()

        return rollIds.map((roll: { roll_id: number }) => roll.roll_id)
    }
}