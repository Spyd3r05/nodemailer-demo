import nodemailer from "nodemailer";

export async function POST(req, res) {
  try {
    //parse incoming JSON data
    const { name, email, message } = await req.json();

    //basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //create a reusable transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.RECEPIENT_EMAIL,
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
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
