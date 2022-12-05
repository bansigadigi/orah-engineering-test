export interface CreateGroupInput {
    name: string;
    number_of_weeks: number;
    roll_states: string;
    incidents: number;
    ltmt: string;
    run_at?: Date;
    student_count?: number;
}

export interface UpdateGroupInput {
    id: number;
    name: string;
    number_of_weeks: number;
    roll_states: string;
    incidents: number;
    ltmt: string;
    run_at?: Date;
    student_count?: number;
}

export interface GroupResult {
    student_id: number;
    count: number;
}

export interface Groups {
    student_id: number;
    group_id: number;
    incident_count: number;
}

