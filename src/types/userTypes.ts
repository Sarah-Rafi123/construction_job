export interface User {
    id: string;
    email: string;
    role: string;
    verifyEmail: boolean;
    full_name?: string;
    company_name?: string;
    company_number?: string;
    phone_number?: string;
    trade?: string;
    admin_status?: string;
    description?: string;
    profile_picture: string;
  }
  
  export interface UserState {
    email:  string | null
    token: string | null,
    role: string | null,
    isAuthenticated:boolean | null
    userType:  string | null
    currentUser:  User | null
    }