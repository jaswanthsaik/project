export interface Filters {
  company: number,
  filter: number,
  filter_name: string,
  filter_description: string,
  report: string,
  criteria: {
    name: string,
    company: number,
    account: number,
    tenant: number,
    subscription: number,
    resourcegroup: number,
    provider: number,
    instances: number
  }
}
