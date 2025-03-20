import { OrderStatus } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Row,
  Column,
} from "@react-email/components";
import { 
  COMPANY_INFO, 
  DELIVERY_FAQS, 
  EMAIL_STYLES, 
  formatPrice 
} from "./emailConstants";
import { ExtendedOrder } from "@/types/orders";

interface OrderStatusEmailProps {
  orderNumber: string;
  customerName: string;
  newStatus: OrderStatus;
  surveyLink?: string;
  order: ExtendedOrder;
  reason?: string;
}

export const OrderStatusEmail = ({
  orderNumber,
  customerName,
  newStatus,
  surveyLink,
  order,
  reason
}: OrderStatusEmailProps) => {
  const getStatusMessage = () => {
    switch (newStatus) {
    case OrderStatus.PENDING:
      return "Your order is being processed. We'll notify you once it's ready.";
    case OrderStatus.PROCESSING:
      return "We're now processing your order and preparing your items.";
    case OrderStatus.READY:
      return "Your order is now ready for pickup/delivery!";
    case OrderStatus.DELIVERED:
      return "Your order has been completed! We'd love to hear your feedback.";
    case OrderStatus.CANCELLED:
      return "Your order has been cancelled. If you have any questions, please contact us.";
    default:
      return "";
    }
  };

  const getStatusEmoji = () => {
    switch (newStatus) {
    case OrderStatus.PROCESSING:
      return "⚙️";
    case OrderStatus.READY:
      return "📦";
    case OrderStatus.DELIVERED:
      return "✨";
    default:
      return "";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Order Status Update - #{orderNumber}</Preview>
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
              {getStatusEmoji()} Order Status Update
            </Heading>
            
            <Text style={greeting}>Hi {customerName},</Text>

            <Section style={statusSection}>
              <Text style={statusBadge}>
                {newStatus.toUpperCase()}
              </Text>
              <Text style={statusMessage}>{getStatusMessage()}</Text>
            </Section>

            {reason && (
              <Section style={reasonSection}>
                <Text style={reasonTitle}>Additional Information:</Text>
                <Text style={reasonText}>{reason}</Text>
              </Section>
            )}

            <Section style={orderInfo}>
              <Row style={infoRow}>
                <Column>
                  <Text style={orderLabel}>Order Reference:</Text>
                  <Text style={orderValue}>#{orderNumber}</Text>
                </Column>
                <Column>
                  <Text style={orderLabel}>Order Date:</Text>
                  <Text style={orderValue}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Column>
              </Row>
              {order.estimatedDelivery && (
                <Row style={infoRow}>
                  <Column>
                    <Text style={orderLabel}>Estimated Delivery:</Text>
                    <Text style={orderValue}>
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {newStatus === OrderStatus.DELIVERED && surveyLink && (
              <Section style={surveySection}>
                <Text style={surveyText}>Your feedback helps us improve! 🌟</Text>
                <Button style={button} href={surveyLink}>
                  Share Your Experience
                </Button>
              </Section>
            )}

            <Section style={itemsContainer}>
              <Text style={h2}>Order Items</Text>
              {order.orderItems.map((item) => (
                <Row key={item.id} style={itemRow}>
                  <Column style={itemImageCol}>
                    {item.variant.product.imageUrl[0] && (
                      <Img
                        src={item.variant.product.imageUrl[0]}
                        width={60}
                        height={60}
                        alt={item.variant.product.title}
                        style={itemImage}
                      />
                    )}
                  </Column>
                  <Column style={itemDetails}>
                    <Text style={itemName}>{item.variant.product.title}</Text>
                    <Text style={itemVariant}>
                      Variant: {item.variant.variantName}
                    </Text>
                    <Text style={itemQuantity}>
                      Quantity: {item.quantity} × {formatPrice(Number(item.price))}
                    </Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={priceText}>
                      {formatPrice(Number(item.price) * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}
              
              <Section style={totalSection}>
                <Row style={subtotalRow}>
                  <Column>
                    <Text style={totalLabel}>Total Amount</Text>
                  </Column>
                  <Column>
                    <Text style={totalAmount}>
                      {formatPrice(Number(order.totalAmount))}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={faqSection}>
              <Heading style={h2}>Frequently Asked Questions</Heading>
              {DELIVERY_FAQS.map((faq, index) => (
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
                Have questions about your order? Visit our{" "}
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

const statusSection = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  textAlign: "center" as const,
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 12px",
  backgroundColor: EMAIL_STYLES.primaryColor,
  color: "#ffffff",
  borderRadius: "16px",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "16px",
};

const statusMessage = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0",
  fontWeight: "500",
};

const surveySection = {
  margin: "32px 0",
  textAlign: "center" as const,
  backgroundColor: "#fdf9e7",
  padding: "24px",
  borderRadius: "8px",
};

const surveyText = {
  fontSize: "16px",
  color: "#1a1a1a",
  marginBottom: "16px",
};

const button = {
  ...EMAIL_STYLES.button,
};

const callToAction = {
  fontSize: "16px",
  color: EMAIL_STYLES.primaryColor,
  margin: "32px 0",
  textAlign: "center" as const,
  fontWeight: "500",
};

const itemImageCol = {
  width: "60px",
};

const itemImage = {
  borderRadius: "4px",
  objectFit: "cover" as const,
};

const itemVariant = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0",
};

const infoRow = {
  marginBottom: "16px",
};

const itemsContainer = {
  margin: "32px 0",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
};

const itemRow = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
};

const itemDetails = {
  flex: "1",
  padding: "0 16px",
};

const itemName = {
  fontSize: "16px",
  color: "#1a1a1a",
  fontWeight: "500",
  margin: "0 0 4px",
};

const itemQuantity = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0 0",
};

const orderInfo = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const orderLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 4px",
};

const orderValue = {
  fontSize: "16px",
  color: "#1a1a1a",
  fontWeight: "500",
  margin: "0",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px",
  padding: "0",
};

const itemPrice = {
  textAlign: "right" as const,
  width: "100px",
};

const priceText = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0",
  fontWeight: "500",
};

const totalSection = {
  margin: "24px 0 0",
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const subtotalRow = {
  padding: "8px 16px",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0",
};

const totalAmount = {
  fontSize: "18px",
  fontWeight: "600",
  color: EMAIL_STYLES.primaryColor,
  margin: "0",
  textAlign: "right" as const,
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

const reasonSection = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const reasonTitle = {
  fontSize: '16px',
  color: '#1a1a1a',
  fontWeight: '600',
  margin: '0 0 8px',
};

const reasonText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

export default OrderStatusEmail;