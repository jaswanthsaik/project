export interface User {
    user: number,
    first_name: string,
    last_name: string,
    password: string,
    email: string,
    company_name: string | undefined,
    country_name: string | undefined,
    country: number,
    timezone_name: string | undefined,
    timezone: number,
    role_index: string,
    role_name: string | undefined,
    teams: string[],

    selected?: boolean;
    isMyUser: boolean;
    avatar: string;
}