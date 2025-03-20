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
} from "@react-email/components";
import { 
  COMPANY_INFO,
  PAYMENT_FAQS, 
  EMAIL_STYLES, 
  formatPrice 
} from "./emailConstants";

interface PaymentStatusEmailProps {
  orderNumber: string;
  customerName: string;
  amount: number;
  status: 'verified' | 'refunded' | 'declined';
  refundReason?: string;
  refundDetails?: {
    remainingBalance?: number;
    refundMethod?: string;
    estimatedProcessingTime?: string;
  };
}

export const PaymentStatusEmail = ({
  orderNumber,
  customerName,
  amount,
  status,
  refundReason,
  refundDetails
}: PaymentStatusEmailProps) => {
  const getStatusMessage = () => {
    switch (status) {
    case 'verified':
      return `Your payment of ${formatPrice(amount)} for order #${orderNumber} has been verified successfully.`;
    case 'refunded':
      return `A refund of ${formatPrice(amount)} for order #${orderNumber} has been processed.`;
    case 'declined':
      return `Your payment of ${formatPrice(amount)} for order #${orderNumber} has been declined.`;
    default:
      return "";
    }
  };

  const getHeaderMessage = () => {
    switch (status) {
    case 'verified':
      return '✅ Payment Verified';
    case 'refunded':
      return '💰 Payment Refunded';
    case 'declined':
      return '❌ Payment Declined';
    default:
      return '';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Payment {status === 'verified' ? 'Verification' : status === 'refunded' ? 'Refund' : 'Declined'} - Order #{orderNumber}</Preview>
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
              {getHeaderMessage()} - Order #{orderNumber}
            </Heading>
            
            <Text style={greeting}>Hi {customerName},</Text>
            
            <Section style={statusSection}>
              <Text style={statusMessage}>{getStatusMessage()}</Text>
              
              {status === 'refunded' && refundReason && (
                <Text style={text}>
                  <strong>Reason for refund:</strong> {refundReason}
                </Text>
              )}
            </Section>

            {status === 'verified' && (
              <Section style={infoSection}>
                <Text style={text}>
                  We&apos;ll start processing your order right away. You&apos;ll receive another email when your order status changes.
                </Text>
              </Section>
            )}

            {status === 'refunded' && (
              <Section style={infoSection}>
                <Text style={text}>
                  The refund has been initiated and should be reflected in your account within 3-5 business days, depending on your payment method.
                </Text>
              </Section>
            )}

            {status === 'refunded' && (
              <Section style={refundSection}>
                <Text style={refundTitle}>Refund Details</Text>
                <Text style={text}>
                  <strong>Amount Refunded:</strong> {formatPrice(amount)}
                </Text>
                {refundReason && (
                  <Text style={text}>
                    <strong>Reason for Refund:</strong> {refundReason}
                  </Text>
                )}
                {refundDetails && (
                  <>
                    {refundDetails.remainingBalance !== undefined && (
                      <Text style={text}>
                        <strong>Remaining Balance:</strong> {formatPrice(refundDetails.remainingBalance)}
                      </Text>
                    )}
                    {refundDetails.refundMethod && (
                      <Text style={text}>
                        <strong>Refund Method:</strong> {refundDetails.refundMethod}
                      </Text>
                    )}
                    {refundDetails.estimatedProcessingTime && (
                      <Text style={text}>
                        <strong>Estimated Processing Time:</strong> {refundDetails.estimatedProcessingTime}
                      </Text>
                    )}
                  </>
                )}
                <Text style={refundNote}>
                  Note: Refund processing times may vary depending on your payment method and financial institution.
                </Text>
              </Section>
            )}

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={faqSection}>
              <Heading style={h2}>Frequently Asked Questions</Heading>
              {PAYMENT_FAQS.map((faq, index) => (
                <div key={index} style={faqItem}>
                  <Text style={faqQuestion}>{faq.question}</Text>
                  <Text style={faqAnswer}>{faq.answer}</Text>
                </div>
              ))}
            </Section>

            <Section style={buttonContainer}>
              <Text style={callToAction}>
                Visit our website to explore more products or check your order status
              </Text>
              <a href={COMPANY_INFO.website} style={button}>
                Visit {COMPANY_INFO.name}
              </a>
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
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const statusMessage = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0",
  fontWeight: "500",
};

const infoSection = {
  margin: "24px 0",
};

const callToAction = {
  fontSize: "16px",
  color: EMAIL_STYLES.primaryColor,
  margin: "32px 0",
  textAlign: "center" as const,
  fontWeight: "500",
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

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  ...EMAIL_STYLES.button,
};

const refundSection = {
  margin: '32px 0',
  padding: '24px',
  backgroundColor: '#fff5f5',
  borderRadius: '8px',
  border: '1px solid #feb2b2',
};

const refundTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#e53e3e',
  marginBottom: '16px',
};

const refundNote = {
  fontSize: '14px',
  color: '#718096',
  fontStyle: 'italic',
  marginTop: '16px',
};

export default PaymentStatusEmail;