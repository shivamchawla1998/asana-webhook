import axios from "axios";
import { config } from "../config/env.js";
import { WhatsappMessage } from "../types/index.js";

export const sendTemplateMessage = async (message: WhatsappMessage) => {
  const url = `https://graph.facebook.com/v12.0/${config.whatsappPhoneId}/messages`;

  return axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: config.recipientNumber,
      type: "template",
      template: {
        name: message.templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: message.parameters.map((parameter) => {
              return {
                type: "text",
                text: parameter,
              };
            }),
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${config.whatsappToken}`,
      },
    }
  );
};
