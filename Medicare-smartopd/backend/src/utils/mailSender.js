const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendWelcomeEmail = async (email, name, role, autoPassword) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Your ${process.env.APP_NAME || 'MediCare'} Access`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; height: 100%;">
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-bottom: 3px solid #0fb48c;">
            <h1 style="color: #4facfe; margin: 0;">MediCare</h1>
            <p style="color: #666; font-size: 14px;">Seamless Healthcare Management</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Account Credentials</h2>
            <p style="color: #555; font-size: 16px;">Dear <b>${name}</b>,</p>
            <p style="color: #555; line-height: 1.6;">Your account as a <b>${role}</b> has been set up. Login using below details:</p>
            <div style="background-color: #0b1a30; color: #ffffff; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">Email Address</p>
              <p style="margin: 5px 0 20px 0; font-size: 18px; font-weight: bold; color: #4facfe;">${email}</p>
              <p style="margin: 0; font-size: 14px; opacity: 0.8;">Temporary Password</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; font-family: monospace; letter-spacing: 1px;">${autoPassword}</p>
            </div>
            <p style="color: #666; font-size: 14px;">* Change your password upon first login.</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px;">The MediCare Team</div>
        </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

const sendRegistrationEmail = async (email, name) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Welcome to ${process.env.APP_NAME || 'MediCare'}!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e1e8ed; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0fb48c 0%, #0d9d7a 100%); padding: 40px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800;">Welcome!</h1>
            <p style="margin-top: 10px; opacity: 0.9; font-size: 16px;">Registration Successful</p>
          </div>
          <div style="padding: 40px 32px; background: #ffffff;">
            <p style="font-size: 18px; color: #1e293b; margin-bottom: 24px;">Dear <b>${name}</b>,</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
              Thank you for joining <b>MediCare Smart OPD</b>! Your account has been created successfully. 
              You can now book appointments, track your medical history, and access health services from anywhere.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background: #0fb48c; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 180, 140, 0.2);">Login to your Account</a>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5;">If you have any questions or need assistance, please contact our support team at <a href="mailto:support@medicare.com" style="color: #0fb48c; text-decoration: none;">support@medicare.com</a>.</p>
          </div>
          <div style="background: #f8fafc; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #edf2f7;">
            &copy; 2026 MediCare Smart OPD. All rights reserved.
          </div>
        </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log('Registration email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
}

module.exports = { sendWelcomeEmail, sendRegistrationEmail };
