import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, EMAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: false, 
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.log("❌ Error Sending Email:", error.message);
        // return { success: false, error: error.message };
    }
};
