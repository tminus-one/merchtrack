import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Img,
  Button,
} from "@react-email/components";
import { OrderPaymentStatus } from "@prisma/client";
import { 
  COMPANY_INFO, 
  PAYMENT_REMINDER_FAQS, 
  EMAIL_STYLES, 
  formatPrice 
} from "./emailConstants";

interface PaymentReminderEmailProps {
  orderNumber: string;
  customerName: string;
  amount: number;
  paymentStatus: OrderPaymentStatus;
  dueDate?: Date;
}

export const PaymentReminderEmail = ({
  orderNumber,
  customerName,
  amount,
  paymentStatus,
  dueDate,
}: PaymentReminderEmailProps) => {
  const getStatusMessage = () => {
    switch (paymentStatus) {
    case 'PENDING':
      return `We haven't received your payment of ${formatPrice(amount)} for order #${orderNumber} yet.`;
    case 'DOWNPAYMENT':
      return `We've received your downpayment, but the remaining balance of ${formatPrice(amount)} for order #${orderNumber} is still pending.`;
    default:
      return "";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Payment Reminder - Order #{orderNumber}</Preview>
      <Body style={EMAIL_STYLES.main}>
        <Container style={EMAIL_STYLES.container}>
          <Section style={EMAIL_STYLES.header}>
            <div style={EMAIL_STYLES.headerContent}>
              <Img
                src={COMPANY_INFO.logoUrl}
                width={45}
                height={45}
                alt={COMPANY_INFO.name}
                style={EMAIL_STYLES.logo}
              />
              <Text style={EMAIL_STYLES.headerText}>{COMPANY_INFO.name}</Text>
            </div>
          </Section>

          <Section style={EMAIL_STYLES.contentContainer}>
            <Heading style={h1}>
              ⚠️ Payment Reminder - Order #{orderNumber}
            </Heading>
            
            <Text style={greeting}>Hi {customerName},</Text>
            
            <Section style={statusSection}>
              <Text style={statusMessage}>{getStatusMessage()}</Text>
              {dueDate && (
                <Text style={text}>
                  <strong>Due Date:</strong> {dueDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              )}
            </Section>

            <Section style={infoSection}>
              <Text style={text}>
                Please complete your payment to avoid any delays in processing your order. You can make your payment through any of our available payment methods.
              </Text>
              {paymentStatus === 'DOWNPAYMENT' && (
                <Text style={text}>
                  <strong>Note:</strong> Your order is currently on hold until we receive the full payment.
                </Text>
              )}
            </Section>

            <Section style={buttonContainer}>
              <Text style={callToAction}>
                Visit our website to complete your payment or check your order status
              </Text>
              <Button
                href={`${COMPANY_INFO.website}/my-account/orders`}
                style={button}
              >
                Complete Payment
              </Button>
            </Section>

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={faqSection}>
              <Heading style={h2}>Payment Information</Heading>
              {PAYMENT_REMINDER_FAQS.map((faq, index) => (
                <div key={index} style={faqItem}>
                  <Text style={faqQuestion}>{faq.question}</Text>
                  <Text style={faqAnswer}>{faq.answer}</Text>
                </div>
              ))}
            </Section>

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={EMAIL_STYLES.footer}>
              <Text style={EMAIL_STYLES.footerText}>
                Have questions? Visit our{" "}
                <a href={COMPANY_INFO.contactPageUrl} style={EMAIL_STYLES.link}>
                  Contact Page
                </a>
                {" "}or reach out to our support team.
              </Text>
              <Text style={EMAIL_STYLES.footerContact}>
                Email: {COMPANY_INFO.email} | Phone: {COMPANY_INFO.phone}
              </Text>
              <Text style={EMAIL_STYLES.footerAddress}>
                {COMPANY_INFO.address}
              </Text>
              <Text style={EMAIL_STYLES.footerCopyright}>
                © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Specific styles not part of shared styles
const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "16px 0",
  padding: "0",
  textAlign: "center" as const,
};

const greeting = {
  fontSize: "18px",
  lineHeight: "1.4",
  margin: "24px 0",
  color: "#484848",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#484848",
  margin: "24px 0",
};

const statusSection = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#fff5f5",
  borderRadius: "8px",
  border: "1px solid #feb2b2",
};

const statusMessage = {
  fontSize: "16px",
  color: "#e53e3e",
  margin: "0",
  fontWeight: "500",
};

const infoSection = {
  margin: "24px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const callToAction = {
  fontSize: "16px",
  color: EMAIL_STYLES.primaryColor,
  margin: "32px 0",
  textAlign: "center" as const,
  fontWeight: "500",
};

const button = {
  ...EMAIL_STYLES.button,
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const faqSection = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const faqItem = {
  margin: "16px 0",
};

const faqQuestion = {
  fontSize: "16px",
  color: "#1a1a1a",
  fontWeight: "600",
  margin: "0 0 8px",
};

const faqAnswer = {
  fontSize: "14px",
  color: "#484848",
  margin: "0",
  lineHeight: "1.6",
};

export default PaymentReminderEmail;