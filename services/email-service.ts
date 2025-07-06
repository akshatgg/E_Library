import nodemailer, { SendMailOptions, Transporter } from 'nodemailer'

export default class EmailService {
  static transporter: Transporter | null = null

  static wrapedSendMail(mailOptions: SendMailOptions): Promise<{
    success: boolean
    error?: Error
    result?: any
  }> {
    return new Promise((resolve, reject) => {
      EmailService.transporter?.sendMail(mailOptions, (error, result) => {
        if (error) {
          console.error(`Email sending error: ${error}`)
          reject({ success: false, error })
        } else {
          resolve({ success: true, result })
        }
      })
    })
  }

  static async initialize() {
    if (EmailService.transporter != null) return

    const user = process.env.OPT_EMAIL
    const pass = process.env.OTP_PASS

    if (!user || !pass) {
      throw new Error('Missing SMTP credentials in environment variables')
    }

    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    })

    try {
      await transporter.verify()
      console.log('✅ SMTP transporter verified')
    } catch (err) {
      console.error('❌ SMTP transporter verification failed:', err)
      throw err
    }

    EmailService.transporter = transporter
  }

  static async sendContactForm({
    name,
    email,
    phone,
    subject,
    category,
    message,
  }: {
    name: string
    email: string
    phone: string
    subject: string
    category: string
    message: string
  }) {
    try {
      await EmailService.initialize()

      const emailContent = `
        A new contact form submission:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Category: ${category}
        Subject: ${subject}

        Message:
        ${message}
      `

      const mailOptions: SendMailOptions = {
        from: `"${name}" <${process.env.OPT_EMAIL}>`, // still use your SMTP email but show user's name
        to: 'support@itaxeasy.com', // support email
        subject: `Contact Form: ${subject}`,
        text: emailContent,
        replyTo: email, // allows support to reply directly to user's email
      }

      const { success, error } = await EmailService.wrapedSendMail(mailOptions)

      if (!success) throw error

      return { success: true, message: 'Email sent to support@itaxeasy.com' }
    } catch (e) {
      console.error('Email sending failed:', e)
      return { success: false, message: 'Could not send email' }
    }
  }
}
