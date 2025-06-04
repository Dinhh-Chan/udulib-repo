// User types and interfaces for the application

export interface User {
    user_id: number
    username: string
    email: string
    full_name: string
    role: "admin" | "student" | "teacher"
    status: "active" | "inactive" | "banned"
    university_id?: string
    created_at: string
    updated_at?: string
    last_login?: string
  }
  
  export interface UserCreate {
    username: string
    email: string
    password: string
    full_name: string
    role: "admin" | "student" | "teacher"
    university_id?: string
  }
  
  export interface UserUpdate {
    username?: string
    email?: string
    password?: string  // Optional - chỉ khi muốn đổi password
    full_name?: string
    role?: "admin" | "student" | "teacher"
    status?: "active" | "inactive" | "banned"
    university_id?: string
  }
  
  export interface UserLogin {
    username: string
    password: string
  }
  
  export interface UserLoginResponse {
    access_token: string
    token_type: string
    user: User
  }
  
  export interface UserQuery {
    skip?: number
    limit?: number
    role?: "admin" | "student" | "teacher"
    status?: "active" | "inactive" | "banned"
    search?: string
  }
  
  // For password change specifically
  export interface UserPasswordChange {
    current_password: string
    new_password: string
    confirm_password: string
  }
  
  // For user profile update (limited fields for self-edit)
  export interface UserProfileUpdate {
    full_name?: string
    email?: string
    university_id?: string
  }
  
  // Enum types for better type safety
  export enum UserRole {
    ADMIN = "admin",
    TEACHER = "teacher", 
    STUDENT = "student"
  }
  
  export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned"
  }
  
  // Utility types
  export type UserRoleType = keyof typeof UserRole
  export type UserStatusType = keyof typeof UserStatus
  
  // For form validation
  export interface UserFormData extends Omit<UserCreate, 'password'> {
    password?: string
    confirmPassword?: string
  }
  
  // For display purposes
  export interface UserListItem extends Pick<User, 'user_id' | 'username' | 'email' | 'full_name' | 'role' | 'status' | 'created_at'> {
    // Simplified user data for lists
  }
  
  // For authentication context
  export interface AuthUser extends Pick<User, 'user_id' | 'username' | 'email' | 'full_name' | 'role' | 'status'> {
    // Auth context only needs essential user data
  }