import prisma from "@/lib/prisma";

type Params = {
    userId: string;
}

type ReturnFormat = {
    isAdmin: boolean;
    isStaff: boolean;
}

export const verifyRole = async ({ userId }: Params): Promise<ReturnFormat> => {
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isAdmin: true,
      isStaff: true,    
    }
  });

  const hasRole = {
    isAdmin: user?.isAdmin ?? false,
    isStaff: user?.isStaff ?? false,
  };  
  
  return hasRole;
};