import { getSession } from "@auth0/nextjs-auth0";

export const getUser = async () => {
  const session = await getSession();
  return {
    id: session?.user?.sub,
    email: session?.user?.email,
    picture: session?.user?.picture,
  };
};
