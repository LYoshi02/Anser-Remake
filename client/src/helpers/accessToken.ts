let accessToken = "";

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(newToken: string) {
  accessToken = newToken;
}

export const refreshTokenUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/refresh-token`;
