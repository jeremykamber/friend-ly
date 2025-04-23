const nodemailer = require('nodemailer');

// Ensure you have environment variables set for email configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: (process.env.EMAIL_PORT === '465'),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Generates the HTML content for the verification email.
 * @param {string|number} code - The verification code.
 * @param {string} email - The recipient's email address.
 * @returns {string} The HTML string for the email body.
 */
function createVerificationEmailHtml(code, email) {
    const appName = process.env.APP_NAME || 'Friend-ly';
    const currentYear = new Date().getFullYear();

    // Basic inline styles for better email client compatibility
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #333333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #dddddd; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee; }
        .header h1 { margin: 0; color: #007bff; font-size: 24px; }
        .content p { font-size: 16px; margin-bottom: 15px; }
        .code-container { text-align: center; margin: 30px 0; }
        .code { display: inline-block; font-size: 28px; font-weight: bold; text-align: center; padding: 12px 25px; background-color: #e9ecef; border-radius: 6px; letter-spacing: 3px; color: #495057; border: 1px dashed #adb5bd; }
        .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777; }
        .footer p { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${appName} Email Verification</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thanks for signing up with ${appName}! To complete your registration and verify your email address (${email}), please enter the following code into the app:</p>
            <div class="code-container">
                <span class="code">${code}</span>
            </div>
            <p>This code is valid for a limited time. If you enter it and it doesn't work, please request a new one.</p>
            <p>If you didn't request this email, you can safely ignore it. Your account won't be created or verified without completing this step.</p>
            <p>Thanks,<br>The ${appName} Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${currentYear} ${appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Sends an email verification email to the specified address.
 *
 * @param {string|number} code - The verification code to include in the email.
 * @param {string} email - The recipient's email address.
 * @throws Will throw an error if email sending fails.
 */
async function sendEmailVerificationEmail(code, email) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials (EMAIL_USER, EMAIL_PASS) are not configured in environment variables.');
        throw new Error('Email service is not configured.');
    }

    const mailOptions = {
        from: `"${process.env.APP_NAME || 'Friend-ly'} Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your ${process.env.APP_NAME || 'Friend-ly'} Verification Code`,
        html: createVerificationEmailHtml(code, email),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending verification email to ${email}:`, error);
        throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`);
    }
}

module.exports = { sendEmailVerificationEmail };