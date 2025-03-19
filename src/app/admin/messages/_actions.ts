'use server';

import { Message } from "@prisma/client";
import { render } from "@react-email/components";
import prisma from "@/lib/db";
import { verifyPermission } from "@/utils/permissions";
import { invalidateCache } from "@/lib/redis";
import { sendEmail } from "@/lib/mailgun";
import ReplyEmailTemplate from "@/app/admin/messages/(components)/email-template";
import { CreateMessageType, createMessageSchema } from "@/schema/messages";
import { processActionReturnData } from "@/utils";

type ReplyToMessageParams = {
  userId: string
  messageId: string
  reply: string
}

export const replyToMessage = async ({userId, messageId, reply}: ReplyToMessageParams): Promise<ActionsReturnType<Message>> => {
  const authResult = await verifyPermission({
    userId,
    permissions: {
      dashboard: { canRead: true },
    },
    logDetails: {
      actionDescription: "Reply to message",
      userText: `Attempted to reply to message ID: ${messageId}`
    }
  });

  if (!authResult) {
    return {
      success: false,
      message: "Unauthorized access."
    };
  }

  const messageToUpdate = await prisma.message.update({
    where: {
      id: messageId
    },
    data: {
      isRead: true
    },
  });

  const replyMessage = await prisma.message.create({
    data: {
      subject: `Re: ${messageToUpdate.subject}`,
      message: reply,
      isRead: true,
      isSentByAdmin: true,
      repliesToId: messageToUpdate.id,
      email: messageToUpdate.email,
      sentBy: userId,
    },
    include: {
      user: true
    }
  });

  // Log successful reply
  await prisma.log.create({
    data: {
      reason: "Message Reply Sent",
      systemText: `Admin replied to message ID: ${messageId}`,
      userText: `Reply sent to: ${messageToUpdate.email}`,
      createdBy: {
        connect: { id: userId }
      }
    }
  });

  await invalidateCache(['messages:all', `messages:${messageId}`]);
  await sendEmail({
    to: messageToUpdate.email,
    subject: `Re: ${messageToUpdate.subject}`,
    html: await render(ReplyEmailTemplate({ 
      replyContent: reply,
      customerName: messageToUpdate.email,
      subject: messageToUpdate.subject
    })),
    from: 'MerchTrack Support'
  });

  return {
    success: true,
    data: processActionReturnData(replyMessage) as Message,
    message: "Message replied successfully."
  };
};

type CreateMessageParams = {
  userId: string
  formData: CreateMessageType
}

export const createMessage = async (params: CreateMessageParams): Promise<ActionsReturnType<Message>> => {
  const authResult = await verifyPermission({
    userId: params.userId,
    permissions: {
      messages: { canCreate: true },
    },
    logDetails: {
      actionDescription: "Create new message",
      userText: `Attempted to create new message to: ${params.formData.emails.join(', ')}`,
    }
  });

  if (!authResult) {
    return {
      success: false,
      message: "Unauthorized access."
    };
  }

  try {
    // Use the correct schema for validation
    const result = createMessageSchema.safeParse(params.formData);

    if (!result.success) {
      const errors = result.error.errors.reduce((acc: Record<string, string>, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
  
      return {
        success: false,
        message: "There are errors in the form.",
        errors, 
      };
    }
    
    // Create multiple message records at once using createMany
    await prisma.message.createMany({
      data: result.data.emails.map(email => ({
        message: result.data.message,
        subject: result.data.subject,
        email: email,
        isSentByAdmin: true,
        sentBy: params.userId,
        isRead: true
      }))
    });
    
    // Create log entries for all messages
    await prisma.log.createMany({
      data: result.data.emails.map(email => ({
        reason: "New Message Created",
        systemText: `Admin created new message to: ${email} \nwith subject: ${result.data.subject} \nand message: ${result.data.message}`,
        userText: `Message sent to: ${email}`,
        createdById: params.userId
      }))
    });
    
    // Send emails to all recipients
    sendEmail({
      to: result.data.emails,
      subject: result.data.subject,
      html: await render(ReplyEmailTemplate({
        replyContent: result.data.message,
        customerName: result.data.customerName,
        subject: result.data.subject
      })),
      from: 'MerchTrack Support'
    });


    
    // Invalidate cache
    await invalidateCache(['messages:all']);
    
    return {
      success: true,
      message: `Message sent successfully to ${result.data.emails.length} recipients.`
    };
  } catch (error) {
    console.error("Error sending messages:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
};