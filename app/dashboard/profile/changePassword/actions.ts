"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Result = {
  success: boolean;
  message: string;
};

export async function changeOrSetPassword(
  currentPassword: string,
  newPassword: string
): Promise<Result> {
  try {
    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        message: "New password must be at least 8 characters.",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Not authenticated.",
      };
    }

    // هل لدى المستخدم credential account؟
    const credentialAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      select: {
        id: true,
      },
    });

    // =========================
    // USER ALREADY HAS PASSWORD
    // =========================
    if (credentialAccount) {
      if (!currentPassword) {
        return {
          success: false,
          message: "Current password is required.",
        };
      }

      const result = await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
        headers: await headers(),
      });

      return {
        success: true,
        message: "Password changed successfully.",
      };
    }

    // =========================
    // GOOGLE / OAUTH USER
    // NO PASSWORD YET
    // =========================
    await auth.api.setPassword({
      body: {
        newPassword,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Password created successfully.",
    };
  } catch (error: any) {
    console.error("PASSWORD ERROR:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to change password.",
    };
  }
}
