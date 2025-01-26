export class ColumnChangeLog {
    id: number;
    original_table_id: number;
    column_name: string;
    old_value: string;
    new_value: string;
    change_timestamp: Date;
    time_diff?: string;
}
