interface Tag {
    tag_name: string,
    tag_value: string
}

export class SubscriptionHierarchyApiRequest {
    label: number = 0;
    accounts: number[] = [];
    tags: Tag[] = [];
}
