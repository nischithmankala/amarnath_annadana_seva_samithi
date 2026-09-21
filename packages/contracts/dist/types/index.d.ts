export declare enum Role {
    PUBLIC = "PUBLIC",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export interface UserSession {
    userId: string;
    role: Role;
    scopes?: string[];
}
