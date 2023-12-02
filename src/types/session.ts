import { DefaultSession } from "next-auth";

type DefaultSessionUser = NonNullable<DefaultSession["user"]>;

export type SessionUser = DefaultSessionUser & {
  id: string;
  role: string;
};

export type Session = DefaultSession & {
  user?: SessionUser;
};

export interface ServerSession {
  user: SessionUser;
}
