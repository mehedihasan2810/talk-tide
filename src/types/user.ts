export interface UserInterface {
  id: string;
  avatar: {
    // id: string;
    url: string;
    localPath: string;
  };
  username: string;
  email: string;
  isEmailVerified: boolean;
  loginType: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
