export type JwtPayload = {
  id: number;
};

export class BearerToken {
  token: string;
  id: number;

  constructor(token: string, payload: JwtPayload) {
    this.token = token;
    this.id = payload.id;
  }
}
