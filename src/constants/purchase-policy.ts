export const PURCHASE_POLICY_CONTENT = {
  title: "Purchase Order Policy",
  description: "Important guidelines and terms for placing orders",
  sections: [
    {
      title: "Order Information Requirements",
      content: "When placing an order, the customer must be attentive and provide the following accurate information:",
      requirements: [
        "Complete Full Name",
        "Email",
        "Phone Number",
        "College Department",
        "Product Name",
        "Number of order"
      ]
    },
    {
      title: "Payment and Processing",
      items: [
        {
          id: "incorrect-info",
          title: "Information Responsibility",
          content: "Gold in Blue is not responsible for any incorrect information inputted by the customer when placing an order."
        },
        {
          id: "down-payment",
          title: "Down Payment Requirement",
          content: "To process the order/s, the customer must at least settle the down payment, which is 50% of the total, by the given deadline. Failure to do so will automatically result in the cancellation of the order/s."
        },
        {
          id: "full-payment",
          title: "Production Payment",
          content: "If down payment has been given, a full payment must be given before the start of production."
        }
      ]
    },
    {
      title: "Order Modifications and Communication",
      items: [
        {
          id: "corrections",
          title: "Production Information Corrections",
          content: "If the customer wants to correct the production information, they must submit an email to the official Gold in Blue email three days before the production. Any other emails after the production will be disregarded."
        },
        {
          id: "payment-method",
          title: "Payment Processing",
          content: "The payment method must be given to the PIXELS Treasurer's available service transactions."
        },
        {
          id: "receipt",
          title: "Receipt Requirements",
          content: "When the customer pays, they must ensure to claim their receipt, digital or hard copy. They will present the official receipt to any of the Salesperson when picking up their order/s."
        }
      ]
    },
    {
      title: "Delivery and Pickup",
      items: [
        {
          id: "pickup-delivery",
          title: "Order Collection",
          content: "The Gold in Blue merchandise can be picked up or delivered. The Salesperson will inform the customer/s the schedule for pick-up and delivery."
        },
        {
          id: "shipping",
          title: "Shipping Fees",
          content: "A shipping fee will be charged to the customer if the product is delivered outside Naga City."
        }
      ]
    },
    {
      title: "Refunds and Returns",
      items: [
        {
          id: "no-refunds",
          title: "No Returns Policy",
          content: "The Gold in Blue does not offer refunds or exchanges for any products or services sold, thus all sales are considered final."
        },
        {
          id: "unclaimed",
          title: "Unclaimed Orders",
          content: "If the customer fails to claim their order within three months, the product will no longer be available for purchase to the customer. Instead, the product will be used for IGP (Income Generating Project) purposes."
        }
      ]
    },
    {
      title: "Special Orders",
      items: [
        {
          id: "custom-orders",
          title: "Custom Orders",
          content: "For jerseys or customized orders, such as the client's team number and surname, they must give the full payment before the production starts."
        }
      ]
    },
    {
      title: "Refund Conditions",
      content: "The Gold in Blue will issue a full refund in the following conditions:",
      conditions: [
        "Discontinued product production",
        "Price increase in the production if the customer wants to cancel their order",
        "Mismanagement in handling the product by the Gold in Blue Team"
      ]
    }
  ]
};