export interface InstanceGraphValue {
    percent_saving: number;
    instance_name: string;
}

export interface InstanceGraph {
    percent_total: number;
    values: InstanceGraphValue[];
}


// Test data for InstanceGraph interface validation
/*const testData: InstanceGraph = {
    "percent_total": 61,
    "values": [
      {
        "percent_saving": 13,
        "instance_name": "Vm 10"
      },
      {
        "percent_saving": 18,
        "instance_name": "VM 8"
      },
      {
        "percent_saving": 22,
        "instance_name": "VM 6"
      },
      {
        "percent_saving": 8,
        "instance_name": "VM 3"
      }
    ]
}*/
