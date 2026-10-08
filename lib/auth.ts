import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import { prisma } from "./prisma";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  // =========================================================
  // EMAIL + PASSWORD
  // =========================================================

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

baseURL: {
  allowedHosts: [
    "localhost:3000",
    "*.vercel.app",
  ],
  protocol:
    process.env.NODE_ENV === "development"
      ? "http"
      : "https",
  fallback: "https://qawl-olive.vercel.app",
},
  // =========================================================
  // DATABASE
  // =========================================================

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // =========================================================
  // ADVANCED
  // =========================================================

  advanced: {
    database: {
      joins: true,
    },
  },

  // =========================================================
  // EMAIL OTP
  // =========================================================

  plugins: [
    emailOTP({
      otpLength: 6,

      // 10 minutes
      expiresIn: 600,

      // 5 attempts
      allowedAttempts: 5,

      // Generate a new OTP when requested again
      resendStrategy: "rotate",

      async sendVerificationOTP({
        email,
        otp,
        type,
      }) {
        // We currently use OTP for password reset.
        if (type !== "forget-password") {
          return;
        }

        await sendEmail({
          to: email,

          subject:
            "Your Qawl password reset code",

          text: `
Your Qawl password reset code is:

${otp}

This code expires in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

Qawl
          `.trim(),

          html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />

                <title>
                  Qawl Password Reset
                </title>
              </head>

              <body
                style="
                  margin:0;
                  padding:0;
                  background:#070B1C;
                  font-family:Arial,Tahoma,sans-serif;
                "
              >
                <div
                  style="
                    padding:40px 16px;
                  "
                >

                  <div
                    style="
                      max-width:560px;
                      margin:0 auto;
                      background:#111634;
                      border:1px solid #282E5C;
                      border-radius:20px;
                      overflow:hidden;
                    "
                  >

                    <!-- Header -->

                    <div
                      style="
                        padding:30px;
                        text-align:center;
                        border-bottom:1px solid #282E5C;
                      "
                    >

                      <div
                        style="
                          width:60px;
                          height:60px;
                          margin:0 auto;
                          border-radius:18px;
                          background:#8B5CF6;
                          color:#ffffff;
                          font-size:28px;
                          font-weight:bold;
                          line-height:60px;
                        "
                      >
                        Q
                      </div>

                      <h1
                        style="
                          margin:20px 0 0;
                          color:#ffffff;
                          font-size:25px;
                        "
                      >
                        Reset your password
                      </h1>

                    </div>

                    <!-- Content -->

                    <div
                      style="
                        padding:35px 30px;
                        color:#ffffff;
                      "
                    >

                      <p
                        style="
                          margin:0 0 15px;
                          color:#ffffff;
                          font-size:16px;
                        "
                      >
                        We received a request to reset your
                        Qawl password.
                      </p>

                      <p
                        style="
                          margin:0 0 25px;
                          color:#B8BDD6;
                          font-size:14px;
                          line-height:1.8;
                        "
                      >
                        Enter the following verification code
                        in Qawl:
                      </p>

                      <!-- OTP -->

                      <div
                        style="
                          margin:30px 0;
                          text-align:center;
                        "
                      >

                        <div
                          style="
                            display:inline-block;
                            padding:18px 28px;
                            border:1px solid #6D4AFF;
                            border-radius:14px;
                            background:#080D2E;
                            color:#C084FC;
                            font-size:32px;
                            font-weight:bold;
                            letter-spacing:10px;
                          "
                        >
                          ${otp}
                        </div>

                      </div>

                      <p
                        style="
                          margin:0;
                          text-align:center;
                          color:#8F96B5;
                          font-size:13px;
                        "
                      >
                        This code expires in 10 minutes.
                      </p>

                      <p
                        style="
                          margin:30px 0 0;
                          color:#8F96B5;
                          font-size:13px;
                          line-height:1.8;
                        "
                      >
                        If you did not request a password reset,
                        you can safely ignore this email.
                      </p>

                    </div>

                    <!-- Footer -->

                    <div
                      style="
                        padding:20px;
                        text-align:center;
                        border-top:1px solid #282E5C;
                        color:#727995;
                        font-size:12px;
                      "
                    >
                      © Qawl — All rights reserved
                    </div>

                  </div>

                </div>
              </body>
            </html>
          `,
        });
      },
    }),
  ],

  // =========================================================
  // USER
  // =========================================================

  user: {
    deleteUser: {
      enabled: true,

      // =====================================================
      // DELETE ACCOUNT VERIFICATION
      // =====================================================

      sendDeleteAccountVerification: async ({
        user,
        url,
      }) => {
        await sendEmail({
          to: user.email,

          subject:
            "Confirm account deletion - Qawl",

          text: `
We received a request to permanently delete your Qawl account.

Confirm account deletion:
${url}

This action is permanent and cannot be undone.

If you did not request this, you can safely ignore this email.

Qawl
          `.trim(),

          html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />

                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0"
                />

                <title>
                  Confirm account deletion - Qawl
                </title>
              </head>

              <body
                style="
                  margin:0;
                  padding:0;
                  background:#070B1C;
                  font-family:Arial,Tahoma,sans-serif;
                "
              >

                <div
                  style="
                    padding:40px 16px;
                  "
                >

                  <div
                    style="
                      max-width:560px;
                      margin:0 auto;
                      background:#111634;
                      border:1px solid #282E5C;
                      border-radius:20px;
                      overflow:hidden;
                      color:#ffffff;
                    "
                  >

                    <!-- Header -->

                    <div
                      style="
                        padding:30px;
                        text-align:center;
                        border-bottom:1px solid #282E5C;
                      "
                    >

                      <div
                        style="
                          width:60px;
                          height:60px;
                          margin:0 auto;
                          border-radius:18px;
                          background:#dc2626;
                          color:#ffffff;
                          line-height:60px;
                          font-size:28px;
                          font-weight:bold;
                        "
                      >
                        Q
                      </div>

                      <h1
                        style="
                          margin:18px 0 0;
                          font-size:24px;
                        "
                      >
                        Confirm account deletion
                      </h1>

                    </div>

                    <!-- Content -->

                    <div
                      style="
                        padding:32px 30px;
                      "
                    >

                      <p
                        style="
                          margin:0 0 16px;
                          font-size:16px;
                          color:#ffffff;
                        "
                      >
                        Hello ${user.name || "there"},
                      </p>

                      <p
                        style="
                          margin:0;
                          color:#B8BDD6;
                          line-height:1.8;
                          font-size:14px;
                        "
                      >
                        We received a request to permanently
                        delete your Qawl account.
                      </p>

                      <div
                        style="
                          margin:30px 0;
                          text-align:center;
                        "
                      >

                        <a
                          href="${url}"
                          style="
                            display:inline-block;
                            background:#dc2626;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 26px;
                            border-radius:12px;
                            font-size:14px;
                            font-weight:bold;
                          "
                        >
                          Confirm account deletion
                        </a>

                      </div>

                      <p
                        style="
                          margin:0;
                          color:#8F96B5;
                          font-size:13px;
                          line-height:1.8;
                        "
                      >
                        This action is permanent and cannot
                        be undone.
                      </p>

                      <p
                        style="
                          margin:20px 0 0;
                          color:#8F96B5;
                          font-size:13px;
                          line-height:1.8;
                        "
                      >
                        If you did not request this,
                        you can safely ignore this email.
                      </p>

                    </div>

                    <!-- Footer -->

                    <div
                      style="
                        padding:20px;
                        border-top:1px solid #282E5C;
                        text-align:center;
                        color:#727995;
                        font-size:12px;
                      "
                    >
                      © Qawl — All rights reserved
                    </div>

                  </div>

                </div>
              </body>
            </html>
          `,
        });
      },
    },
  },

  // =========================================================
  // BASE URL
  // =========================================================


  // =========================================================
  // GOOGLE
  // =========================================================

  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID as string,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});