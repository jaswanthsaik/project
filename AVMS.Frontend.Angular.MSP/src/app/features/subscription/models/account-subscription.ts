import { VirtualMachine } from "./virtual-machine";

export class AccountSubscription {
    subscription: number = 0;
    subscription_name: string = '';
    label: string = '';
    label_applied: boolean = false;
    resource_type: number = 0;
    resource_type_name: string = "";
    virtual_machines: VirtualMachine[] = new Array<VirtualMachine>();
}