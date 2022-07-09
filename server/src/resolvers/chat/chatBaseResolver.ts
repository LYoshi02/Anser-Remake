import { Resolver, Root, Subscription } from "type-graphql";

import { NewMessage, NewMessagePayload } from "./types";

export function createChatBaseResolver() {
  @Resolver({ isAbstract: true })
  abstract class ChatBaseResolver {
    @Subscription({
      topics: "NEW_MESSAGE",
      filter: async ({ payload, args, context }) => {
        if (!context || !context.userId) return false;

        const customPayload = payload as NewMessagePayload;
        const contextUserId = context.userId.toString() as string;

        return customPayload.message.users.some((r) => {
          const recipientId = r.toString();
          return recipientId === contextUserId;
        });
      },
    })
    newMessage(
      @Root() { chatId, message, users, group }: NewMessagePayload
    ): NewMessage {
      return {
        chatId,
        message,
        users,
        group,
      };
    }
  }

  return ChatBaseResolver;
}
