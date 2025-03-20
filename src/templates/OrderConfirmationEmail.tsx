import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
  Img,
} from "@react-email/components";
import { 
  COMPANY_INFO, 
  ORDER_FAQS, 
  EMAIL_STYLES, 
  formatPrice 
} from "./emailConstants";
import { ExtendedOrder } from "@/types/orders";

interface OrderConfirmationEmailProps {
  order: ExtendedOrder;
  customerName: string;
}

export const OrderConfirmationEmail = ({
  order,
  customerName,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your {COMPANY_INFO.name} Order Confirmation #{order.id}</Preview>
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
            <Heading style={h1}>🎉 Thank You for Your Order!</Heading>
            
            <Text style={greeting}>Hi {customerName},</Text>
            <Text style={text}>
              Your order has been confirmed and is being processed. Here are your complete order details:
            </Text>

            <Section style={orderInfo}>
              <Row style={infoRow}>
                <Column>
                  <Text style={orderLabel}>Order Reference:</Text>
                  <Text style={orderValue}>#{order.id}</Text>
                </Column>
                <Column>
                  <Text style={orderLabel}>Order Date:</Text>
                  <Text style={orderValue}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Column>
              </Row>
              <Row style={infoRow}>
                <Column>
                  <Text style={orderLabel}>Payment Status:</Text>
                  <Text style={orderValue}>{order.paymentStatus}</Text>
                </Column>
                <Column>
                  <Text style={orderLabel}>Order Status:</Text>
                  <Text style={orderValue}>{order.status}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={orderSummary}>
              <Text style={h2}>Order Summary</Text>
              
              <Section style={itemsContainer}>
                {order.orderItems.map((item) => (
                  <Row key={item.id} style={itemRow}>
                    <Column style={itemImageCol}>
                      {item.variant.product.imageUrl && (
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
              </Section>

              <Hr style={EMAIL_STYLES.divider} />

              <Section style={totalSection}>
                <Row style={subtotalRow}>
                  <Column>
                    <Text style={totalLabel}>Subtotal</Text>
                  </Column>
                  <Column>
                    <Text style={subtotalAmount}>
                      {formatPrice(order.orderItems.reduce(
                        (acc, item) => acc + (Number(item.price) * item.quantity),
                        0
                      ))}
                    </Text>
                  </Column>
                </Row>
                <Row style={totalRow}>
                  <Column>
                    <Text style={totalLabel}>Total Amount</Text>
                  </Column>
                  <Column>
                    <Text style={totalAmount}>{formatPrice(order.totalAmount)}</Text>
                  </Column>
                </Row>
              </Section>
            </Section>
            <Section style={nextSteps}>
              <Text style={h2}>What&apos;s Next?</Text>
              <Text style={text}>
                1. We&apos;ll process your order and update you on its status
                <br />
                2. You&apos;ll receive notifications as your order progresses
                <br />
                3. Track your order anytime through your {COMPANY_INFO.name} account
              </Text>
            </Section>

            <Hr style={EMAIL_STYLES.divider} />

            <Section style={faqSection}>
              <Heading style={h2}>Frequently Asked Questions</Heading>
              {ORDER_FAQS.map((faq, index) => (
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

            <Text style={callToAction}>
              Need to check your order? Login to your {COMPANY_INFO.name} account
            </Text>

            <Text style={EMAIL_STYLES.footer}>
              Questions about your order? Contact our support team at{" "}
              <a href={COMPANY_INFO.contactPageUrl} style={EMAIL_STYLES.link}>
                our contact page
              </a>
              !
            </Text>

            <Hr style={EMAIL_STYLES.divider} />
            
            <Section style={EMAIL_STYLES.footer}>
              <Text style={EMAIL_STYLES.footerText}>
                For any questions or concerns, visit our{" "}
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
  margin: "4px 0",
};

const orderValue = {
  fontSize: "16px",
  color: "#1a1a1a",
  fontWeight: "500",
  margin: "0 0 16px 0",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "600",
  margin: "24px 0 16px",
};

const orderSummary = {
  margin: "32px 0",
};

const itemsContainer = {
  margin: "16px 0",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  overflow: "hidden",
};

const itemRow = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#ffffff",
  transition: "background-color 0.2s ease",
};

const itemImageCol = {
  width: "60px",
};

const itemImage = {
  borderRadius: "4px",
  objectFit: "cover" as const,
};

const itemDetails = {
  flex: 1,
  padding: "0 16px",
};

const itemName = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0 0 4px 0",
};

const itemVariant = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "4px 0",
};

const itemQuantity = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const itemPrice = {
  textAlign: "right" as const,
};

const priceText = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0",
};

const totalSection = {
  margin: "24px 0",
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "8px",
};

const subtotalRow = {
  padding: "8px 16px",
};

const subtotalAmount = {
  fontSize: "16px",
  color: "#1a1a1a",
  textAlign: "right" as const,
};

const totalRow = {
  padding: "16px 0",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  marginTop: "24px",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0",
  paddingLeft: "16px",
};

const totalAmount = {
  fontSize: "18px",
  fontWeight: "600",
  color: EMAIL_STYLES.primaryColor,
  margin: "0",
  textAlign: "right" as const,
  paddingRight: "16px",
};

const nextSteps = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#f0f9ff",
  borderRadius: "8px",
  border: "1px solid #e0f2fe",
};

const callToAction = {
  fontSize: "16px",
  color: EMAIL_STYLES.primaryColor,
  margin: "32px 0",
  textAlign: "center" as const,
  fontWeight: "500",
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

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f0f0f0",
};

export default OrderConfirmationEmail;