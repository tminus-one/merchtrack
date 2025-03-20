/**
 * Shared constants for email templates
 */

export const COMPANY_INFO = {
  name: "MerchTrack",
  website: "https://merchtrack.tech",
  logoUrl: "https://merchtrack.tech/img/logo-white.png",
  email: "support@merchtrack.tech",
  phone: "+63 (993)616-7562",
  address: "MerchTrack Inc. | Ateneo de Naga University, Bagumbayan Sur, Naga City",
  contactPageUrl: "https://merchtrack.tech/contacts",
};

export const PRIMARY_COLOR = "#2C59DB";

export const PAYMENT_FAQS = [
  {
    question: "How long does payment verification take?",
    answer: "Payment verification usually takes 1-2 business days depending on your payment method.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept GCash, Maya, and bank transfers. Details will be shown on the checkout page.",
  },
  {
    question: "How can I track my order?",
    answer: "You can track your order by logging into your MerchTrack account and visiting the Orders section.",
  },
];

export const ORDER_FAQS = [
  {
    question: "When will my order be processed?",
    answer: "Orders are typically processed in batches. Your order will only be processed once payment is confirmed.",
  },
  {
    question: "How can I track my order?",
    answer: "You can track your order status by logging into your MerchTrack account and visiting the Orders section.",
  },
  {
    question: "Can I modify my order?",
    answer: "Order modifications can be made within 1 hour of placing the order. Please open a ticket for assistance .",
  },
];

export const DELIVERY_FAQS = [
  {
    question: "How long does order processing take?",
    answer: "Orders are typically processed in batches. Your order will only be processed once payment is confirmed.",
  },
  {
    question: "When will my order be delivered?",
    answer: "Your order will be delivered on scheduled dates. You will receive an email notification once your order is ready. You may also refer to the official MerchTrack social media pages for updates.",
  },
  {
    question: "How can I track my delivery?",
    answer: "You can track your order status by logging into your MerchTrack account and visiting the Orders section.",
  },
];

export const PAYMENT_REMINDER_FAQS = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept GCash, Maya, and bank transfers.",
  },
  {
    question: "How long will my payment be processed?",
    answer: "Payment verification usually takes 1-2 business days depending on your payment method.",
  },
  {
    question: "What happens if I don't pay on time?",
    answer: "Orders with pending payments may be cancelled after a certain period. Please contact us if you need an extension.",
  },
];

// Shared styles for email templates
export const EMAIL_STYLES = {
  primaryColor: PRIMARY_COLOR,
  main: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    marginBottom: "64px",
    borderRadius: "12px",
    overflow: "hidden",
    maxWidth: "600px",
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    padding: "24px",
    textAlign: "center" as const,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    margin: "0 auto",
    width: "fit-content",
  },
  headerText: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    margin: "0",
    lineHeight: "45px",
  },
  logo: {
    margin: "0",
    display: "block",
  },
  contentContainer: {
    padding: "40px 48px",
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    padding: "12px 24px",
    textDecoration: "none",
    display: "inline-block",
    margin: "16px 0",
    border: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.2s ease",
  },
  link: {
    color: PRIMARY_COLOR,
    textDecoration: "none",
    fontWeight: "500",
  },
  divider: {
    borderTop: "1px solid #e2e8f0",
    margin: "32px 0",
  },
  footer: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "24px 0",
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 12px",
    textAlign: "center" as const,
  },
  footerContact: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "8px 0",
    textAlign: "center" as const,
  },
  footerAddress: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "8px 0",
    textAlign: "center" as const,
  },
  footerCopyright: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: "16px 0 0",
    textAlign: "center" as const,
  },
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP'
  }).format(price);
};