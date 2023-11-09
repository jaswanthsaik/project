import { GrapReferenceValue } from './graph-reference-value';

export interface AccountGraph {
    account_id: number;
    account_name: string;
    total_tenant: number;
    total_subscription: number;
    total_instance: number;
    total_saving: number;
    total_recommendations: number;
    percent_saving: number;
    reference_values: GrapReferenceValue[];
}

// Test data for the above AccountGraph
/*const testAccountGraph: AccountGraph = {
    "account_id": 1,
    "account_name": "Account Accenture",
    "reference_values": [
      {
        "percent_saving": 22,
        "time_elapsed": "Jan"
      },
      {
        "percent_saving": 23,
        "time_elapsed": "Feb"
      },
      {
        "percent_saving": 20,
        "time_elapsed": "Mar"
      },
      {
        "percent_saving": 25,
        "time_elapsed": "Apr"
      },
      {
        "percent_saving": 28,
        "time_elapsed": "May"
      },
      {
        "percent_saving": 32,
        "time_elapsed": "Jun"
      },
      {
        "percent_saving": 36,
        "time_elapsed": "Jul"
      },
      {
        "percent_saving": 25,
        "time_elapsed": "Aug"
      },
      {
        "percent_saving": 20,
        "time_elapsed": "Sep"
      },
      {
        "percent_saving": 20,
        "time_elapsed": "Oct"
      },
      {
        "percent_saving": 21,
        "time_elapsed": "Nov"
      },
      {
        "percent_saving": 25,
        "time_elapsed": "Dec"
      }
    ]
  }*/
