export const createAuthorizationHeader = (username?: string, password?: string) => {
  const credentials = btoa(`${username}:${password}`);

  return {
    Authorization: `Basic ${credentials}`,
  };
};
