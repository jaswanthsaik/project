import { Recommendation } from 'src/app/models/recommendation';

export interface DashboardResume {
    account_number: number;
    instance_number: number;
    resource_number: number;
    percent_saving_money: number;
    total_instance_not_saving_money: number;
    recommendations: Recommendation[];

}
