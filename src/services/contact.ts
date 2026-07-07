import { contactFormTemplate, sendEmail } from "../utils/mails";

export const handleContactSubmission = async (
  fullName: string,
  phone: string,
  email: string | undefined,
  message: string
) => {
  const html = contactFormTemplate(fullName, phone, email, message);
  const receivedEmail = process.env.PERSONAL_MAIL_SUPPORT as string;

  await sendEmail(receivedEmail, "رسالة لفريق الدعم", html);

  return { success: true };
};