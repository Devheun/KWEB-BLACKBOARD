export interface SignInParams {
    username: string;
    password: string;
}

export interface SignUpParams {
    username: string;
    password : string;
    name : string;
    studentNumber : number | null;
    isProfessor : boolean;
}