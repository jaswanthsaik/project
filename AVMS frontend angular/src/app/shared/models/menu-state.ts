
type MenuItem = {
    name: string;
    displayName: string;
    expandable: boolean;
    expanded: boolean;
    navigatable: boolean;
    selected: boolean;
    parent?: string | null;
}

export const menuState: MenuItem[] = [
    { name: 'cloud', displayName: 'Cloud', expandable: true, expanded: false, navigatable: false, selected: false, parent: null },
    { name: 'accounts', displayName: 'Accounts', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },
    { name: 'tenants', displayName: 'Tenants', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },
    { name: 'subscriptions', displayName: 'Subscriptions', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },
    { name: 'instances', displayName: 'Instances', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },

    { name: 'recommendations', displayName: 'Recommendations', expandable: true, expanded: false, navigatable: false, selected: false },

    { name: 'labels', displayName: 'Labels', expandable: true, expanded: false, navigatable: false, selected: false },

    { name: 'schedules', displayName: 'Schedules', expandable: true, expanded: false, navigatable: false, selected: false },

    { name: 'reports', displayName: 'Reports', expandable: true, expanded: false, navigatable: false, selected: false },
    { name: 'summary-savings', displayName: 'Summary Savings', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },
    { name: 'daily-savings', displayName: 'Daily Savings', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },
    { name: 'monthly-savings', displayName: 'Monthly Savings', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },
    { name: 'daily-costs', displayName: 'Daily Costs', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },
    { name: 'top-10', displayName: 'Top 10 Resources', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },
    { name: 'month-to-date', displayName: 'Month to Date', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'reports' },

    { name: 'audit', displayName: 'Audit', expandable: true, expanded: false, navigatable: false, selected: false },

    { name: 'api-actions', displayName: 'API Actions', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },
    { name: 'user-actions', displayName: 'User Actions', expandable: false, expanded: false, navigatable: true, selected: false, parent: 'cloud' },

    { name: 'more', displayName: 'More', expandable: false, expanded: false, navigatable: true, selected: false },

];
