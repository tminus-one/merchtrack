# MerchTrack Email Templates Documentation

<div align="center">
  <h1>📧 Email Templates</h1>
  <p>Reusable email templates for transactional communication</p>
</div>

## Overview

The `src/templates` directory contains React-based email templates used throughout the MerchTrack application for transactional communication. These templates leverage the `@react-email/components` library to create consistent, responsive, and well-designed emails for various user interactions.

## Templates

### 📦 Order-Related Templates

#### `OrderConfirmationEmail.tsx`

Sent to customers immediately after an order is placed, confirming the details of their purchase.

```typescript
import { OrderConfirmationEmail } from '@/templates/OrderConfirmationEmail';
import { render } from '@react-email/components';

// In your server action
const emailHtml = render(
  <OrderConfirmationEmail
    orderNumber="ORD-12345"
    customerName="Jane Smith"
    items={orderItems}
    total={120.00}
    estimatedDelivery="April 10, 2025"
  />
);

// Send email using your email service
await sendEmail({
  to: customer.email,
  subject: "Your Order Confirmation",
  html: emailHtml
});
```

#### `OrderStatusEmail.tsx`

Notifies customers about changes to their order status (processing, shipped, delivered, etc.).

```typescript
import { OrderStatusEmail } from '@/templates/OrderStatusEmail';

// In your order status update server action
const emailHtml = render(
  <OrderStatusEmail
    orderNumber="ORD-12345"
    customerName="Jane Smith"
    newStatus="SHIPPED"
    estimatedDelivery="April 10, 2025"
    trackingNumber="TRK123456789"
    surveyLink={surveyUrl} // Optional, included for delivered orders
  />
);
```

### 💰 Payment-Related Templates

#### `PaymentStatusEmail.tsx`

Informs customers about payment status changes (received, processed, refunded, etc.).

```typescript
import { PaymentStatusEmail } from '@/templates/PaymentStatusEmail';

// In your payment processing server action
const emailHtml = render(
  <PaymentStatusEmail
    orderNumber="ORD-12345"
    customerName="Jane Smith"
    paymentStatus="PAID"
    amount={120.00}
    paymentMethod="Credit Card"
    paymentDate="April 3, 2025"
  />
);
```

#### `PaymentReminderEmail.tsx`

Reminds customers about pending payments for their orders.

```typescript
import { PaymentReminderEmail } from '@/templates/PaymentReminderEmail';

// In your payment reminder scheduler
const emailHtml = render(
  <PaymentReminderEmail
    orderNumber="ORD-12345"
    customerName="Jane Smith"
    dueAmount={120.00}
    dueDate="April 10, 2025"
    paymentLink="https://merchtrack.tech/pay/ORD-12345"
  />
);
```

### 🔧 Template Constants

#### `emailConstants.ts`

Contains shared values used across email templates such as brand colors, logos, footer text, etc.

```typescript
import { BRAND_COLOR, LOGO_URL, FOOTER_TEXT } from '@/templates/emailConstants';

// In your custom email template
const MyTemplate = () => (
  <Container>
    <Img src={LOGO_URL} alt="MerchTrack Logo" />
    <Section style={{ backgroundColor: BRAND_COLOR }}>
      {/* Email content */}
    </Section>
    <Text style={{ fontSize: '12px', color: '#666' }}>{FOOTER_TEXT}</Text>
  </Container>
);
```

## Implementation Details

### Base Structure

All email templates follow a consistent structure:

```tsx
import React from 'react';
import { 
  Body, Container, Head, Html, Img, Link, Preview, Section, Text 
} from '@react-email/components';
import { BRAND_COLOR, LOGO_URL, FOOTER_TEXT } from './emailConstants';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  // Other props...
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderNumber,
  customerName,
  // Other props...
}) => {
  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been confirmed</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Section>
            <Img src={LOGO_URL} alt="MerchTrack Logo" width={120} height={40} />
          </Section>
          
          <Section>
            <Text>Hello {customerName},</Text>
            <Text>Thank you for your order! Here's a summary:</Text>
            
            {/* Order details */}
            
            <Text>
              If you have any questions, please 
              <Link href="https://merchtrack.tech/contact">contact us</Link>.
            </Text>
          </Section>
          
          <Section>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              {FOOTER_TEXT}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
```

### Responsiveness

Email templates are designed to be responsive across various email clients:

- Use percentage-based widths for main containers
- Implement mobile-first design approaches
- Test across major email clients (Gmail, Outlook, Apple Mail)
- Use inline CSS for maximum compatibility

### Branding Consistency

Templates maintain consistent branding through shared constants:

```typescript
// emailConstants.ts
export const BRAND_COLOR = '#4f46e5';
export const SECONDARY_COLOR = '#818cf8';
export const LOGO_URL = 'https://merchtrack.tech/img/logo.png';
export const FOOTER_TEXT = '© 2025 MerchTrack. All rights reserved.';
export const CONTACT_EMAIL = 'support@merchtrack.tech';
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/merchtrack',
  facebook: 'https://facebook.com/merchtrack',
  instagram: 'https://instagram.com/merchtrack'
};
```

## Best Practices

### Rendering Email HTML

To render the React email components to HTML strings for sending:

```typescript
import { render } from '@react-email/components';
import { OrderConfirmationEmail } from '@/templates/OrderConfirmationEmail';

// Render the React component to HTML
const emailHtml = render(
  <OrderConfirmationEmail {...emailProps} />
);

// Send the email using your email service
await sendEmail({
  to: recipient,
  subject: "Your Order Confirmation",
  html: emailHtml
});
```

### Dynamic Content

Handle dynamic content safely to avoid rendering errors:

```typescript
// Good practice - handle null/undefined values
<Text>
  {orderItems?.length > 0 ? (
    `You ordered ${orderItems.length} items.`
  ) : (
    'Your order has been processed.'
  )}
</Text>

// Format data properly for emails
<Text>Order date: {new Date(orderDate).toLocaleDateString()}</Text>
```

### Testing Email Templates

Preview email templates during development:

```bash
bun install -D email-preview

# Add to your package.json scripts
# "email:dev": "email-preview"
```

Then run:

```bash
bun run email:dev
```

This will start a local server (usually at http://localhost:3030) where you can view your email templates with different props.

## Integration with Email Service

Templates are meant to be used with the email service defined in `src/lib/email-service.ts`:

```typescript
// email-service.ts
import { render } from '@react-email/components';
import { OrderConfirmationEmail } from '@/templates/OrderConfirmationEmail';
import { sendEmail } from '@/lib/mailgun';

export async function sendOrderConfirmationEmail({
  orderNumber,
  customerEmail,
  customerName,
  items,
  total,
  estimatedDelivery
}) {
  const emailHtml = render(
    <OrderConfirmationEmail
      orderNumber={orderNumber}
      customerName={customerName}
      items={items}
      total={total}
      estimatedDelivery={estimatedDelivery}
    />
  );

  return await sendEmail({
    to: customerEmail,
    subject: `Order Confirmation: ${orderNumber}`,
    html: emailHtml,
    from: 'MerchTrack Orders <orders@merchtrack.tech>'
  });
}
```