export interface JwtPayloadInterface {
  id: string;
}

export interface DecodedJwtPayloadInterface extends JwtPayloadInterface {
  exp: number;
  iat: number;
}
