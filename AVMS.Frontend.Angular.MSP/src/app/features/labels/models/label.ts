import { ScheduleApiResponse } from "../../accounts/models/schedule-api-response";
import { LabelResource } from "./label-resource";

export class Label {
    label: number = 0;
    name: string = '';
    accountName: string = '';
    providerTag: string = '';
    resourcesNames: string | undefined = '';
    resources: LabelResource[] = new Array<LabelResource>();
    scheduleId: number = 0;
    scheduleDescription: string | undefined = "";
}