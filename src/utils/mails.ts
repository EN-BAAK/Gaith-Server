import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.MAIL_MESSAGE_HOST as string,
  port: parseInt(process.env.MAIL_MESSAGE_PORT || "587", 10),
  auth: {
    user: process.env.MAIL_MESSAGE_EMAIL as string,
    pass: process.env.MAIL_MESSAGE_PASS as string,
  },
});

const emailTemplate = (title: string, description: string, code: string, expiryText: string) => `
  <div style="background-color:#FAF7F2;padding:40px 0;font-family:Arial,sans-serif;">
    <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;border: 1px solid #1C1C1C;">
      <div style="background:#1C1C1C;color:#B08D57;padding:30px;text-align:center">
        <h1 style="margin:0;font-size:26px;font-weight:600;letter-spacing:1px;color:#B08D57;">
          AL GAITH
        </h1>
        <p style="margin:5px 0 0 0;font-size:12px;color:#FAF7F2;letter-spacing:2px;">CLOTHES SHOP</p>
      </div>

      <div style="padding:40px 30px;text-align:center;color:#1C1C1C">
        <h2 style="margin-top:0;margin-bottom:16px;font-size:20px;color:#1C1C1C;font-weight:600;">
          ${title}
        </h2>
        <p style="margin-bottom:24px;font-size:15px;line-height:1.6;color:#4A4A4A">
          ${description}
        </p>

        <div style="display:inline-block;background:#FAF7F2;color:#1C1C1C;
          font-size:24px;font-weight:bold;letter-spacing:6px;border:2px solid #B08D57;
          padding:14px 32px;border-radius:8px;margin-bottom:24px;box-shadow:0 2px 6px rgba(176,141,87,0.15)">
          ${code}
        </div>

        <p style="margin:0;font-size:13px;color:#7A7A7A">
          هذا الرمز صالح لمدة <strong>${expiryText}</strong>.
        </p>
      </div>

      <div style="background:#1C1C1C;padding:16px;text-align:center;font-size:12px;color:#B08D57">
        إذا لم تكن أنت من قام بهذا الطلب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
      </div>
    </div>
  </div>
`;

export const resetEmailMessage = (code: string): string => {
  return emailTemplate(
    "طلب إعادة تعيين كلمة المرور",
    "تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك في متجر الغيث. استخدم الرمز أدناه لإتمام العملية:",
    code,
    "15 دقيقة"
  );
};

export const verifyAccountMessage = (code: string): string => {
  return emailTemplate(
    "تأكيد حسابك الجديد",
    "مرحباً بك في متجر الغيث للأزياء! يسعدنا انضمامك إلينا. يرجى استخدام الرمز أدناه لتفعيل حسابك البدء بالتسوق:",
    code,
    "7 أيام"
  );
};

export const sendEmail = async (email: string, subject: string, msg: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Al Gaith Support" <${process.env.MAIL_MESSAGE_EMAIL}>`,
    to: email,
    subject: subject,
    html: msg,
  });
};