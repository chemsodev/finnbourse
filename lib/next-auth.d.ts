declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      negotiatorId: string;
      roleid: number;
      followsbusiness: boolean;
      token: string;
      refreshToken: string;
      error: unknown;
      tokenExpires: number;
    };
  }
}
