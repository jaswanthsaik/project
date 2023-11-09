export interface UserDetails {
    user: number,
    first_name: string,
    last_name: string,
    email: string,
    company: number,
    company_name: string | undefined,
    country: number,
    country_name: string | undefined,
    timezone: number,
    avatar: string
}