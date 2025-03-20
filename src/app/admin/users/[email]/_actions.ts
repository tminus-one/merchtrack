'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { verifyPermission } from "@/utils";
import { ResetUserPasswordType, UpdateUserType } from "@/schema/user";
import { createLog } from "@/actions/logs.actions";

type ResetPasswordForUserParams = {
  userId: string;
  params: ResetUserPasswordType;
}

export async function resetPasswordForUser(userId: string, { params: { clerkId, newPassword, signOutOfOtherSessions = false, skipLegalChecks = false } }: ResetPasswordForUserParams): Promise<ActionsReturnType<never>> {
  if (!clerkId) {
    return { success: false, message: "User ID is required." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: "New password is required and must be at least 8 characters long." };
  }

  if (!await verifyPermission({ userId, permissions: { users: { canUpdate: true } } })) {
    return { success: false, message: "Permission denied." };
  }

  try {
    await (await clerkClient()).users.updateUser(clerkId, {
      password: newPassword,
      signOutOfOtherSessions: signOutOfOtherSessions,
      skipLegalChecks: skipLegalChecks
    });
    return { success: true, message: "Password reset successfully." };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

type UpdateUserParams = {
  userId: string;
  targetUserId: string;
  data: UpdateUserType;
}

export async function updateUserDetails({ userId, targetUserId, data }: UpdateUserParams): Promise<ActionsReturnType<never>> {
  if (!await verifyPermission({ userId, permissions: { users: { canUpdate: true } } })) {
    return { success: false, message: "Permission denied." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        college: true,
        courses: true,
        isStaff: true,
        isAdmin: true,
      }
    });

    if (!existingUser) {
      return { success: false, message: "User not found." };
    }

    // Create log of changes
    const changes = Object.entries(data).reduce((acc: string[], [key, value]) => {
      if (existingUser[key as keyof typeof existingUser] !== value) {
        acc.push(`${key}: ${existingUser[key as keyof typeof existingUser]} → ${value}`);
      }
      return acc;
    }, []);

    if (changes.length === 0) {
      return { success: false, message: "No changes detected." };
    }

    // Update user
    await prisma.user.update({
      where: { id: targetUserId },
      data
    });

    // Log the changes
    await createLog({
      userId: targetUserId,
      createdById: userId,
      reason: "User Profile Updated",
      systemText: `User profile updated with changes: ${changes.join(", ")}`,
      userText: "Your profile has been updated successfully."
    });

    return { success: true, message: "User details updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: (error as Error).message };
  }
}

type AssignManagerParams = {
  userId: string;
  managerId: string;
};

export async function assignManager({ userId, managerId }: AssignManagerParams): Promise<ActionsReturnType<never>> {
  const { sessionClaims } = await auth();
  if (!await verifyPermission({ userId: sessionClaims?.metadata?.data?.id as string, permissions: { users: { canUpdate: true } } })) {
    return { success: false, message: "Permission denied." };
  }


  try {
    // Verify both users exist and manager is a staff member
    const [user, manager, currentUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, isStaff: true, managerId: true }
      }),
      prisma.user.findUnique({
        where: { id: managerId },
        select: { firstName: true, lastName: true, isStaff: true }
      }),
      prisma.user.findUnique({
        where: { id: sessionClaims?.metadata?.data?.id },
        select: { id: true, firstName: true, lastName: true, isStaff: true, isAdmin: true }
      })
    ]);

    if (!user) {
      return { success: false, message: "User not found." };
    }

    if (!manager) {
      return { success: false, message: "Manager not found." };
    }

    if (!manager.isStaff) {
      return { success: false, message: "Selected user must be a staff member to be assigned as manager." };
    }

    if (!user.isStaff) {
      return { success: false, message: "Only staff members can be assigned a manager." };
    }

    if (!currentUser?.isAdmin) {
      return { success: false, message: "Only admins can assign a manager." };
    }

    // Update the user's manager
    await prisma.user.update({
      where: { id: userId },
      data: { managerId }
    });

    

    // Create a log entry
    await createLog({
      userId,
      createdById: sessionClaims?.metadata.data.id,
      reason: "Manager Assignment",
      systemText: `${manager.firstName} ${manager.lastName} was assigned as manager for ${user.firstName} ${user.lastName}`,
      userText: `Your manager has been updated to ${manager.firstName} ${manager.lastName}`
    });

    return { success: true, message: "Manager assigned successfully." };
  } catch (error) {
    console.error("Error assigning manager:", error);
    return { success: false, message: (error as Error).message };
  }
}