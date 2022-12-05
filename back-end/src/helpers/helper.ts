import { GroupResult } from "../interface/group.interface";


export function calculateStartDate(noOfWeeks:number): string {
    const d= new Date()
    const dt = d.setDate(d.getDate() - (noOfWeeks*7));
    return new Date(dt).toISOString()
}

export function generateRandomId():number {
    const id = Math.floor(1000 + Math.random() * 9000);
    return id
}

export function totalStudentCountMatchingGroup(payload: GroupResult[]): number {
    const res = payload.reduce((acc: number, cur: GroupResult) => {
        return acc + cur.count
    }, 0)
    return res
}