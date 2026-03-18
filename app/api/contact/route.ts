import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    //parse incoming JSON data
    const { name, email, message } = await req.json();

    //basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    //create a reusable transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as SMTPTransport.Options);

    //email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New contact form submission from ${name}`,
      text: message,
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      `,
    };

    //send email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
