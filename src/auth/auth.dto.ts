export interface RegisterDTO {
  names: string;
  lastNames: string;
  username: string;
  avatar: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CompleteGoogleProfileDTO {
  username: string;
}

export interface GoogleAuthDTO {
  idToken: string;
}
