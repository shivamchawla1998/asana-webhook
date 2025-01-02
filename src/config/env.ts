import dotenv from "dotenv";
import { resolve } from 'path';

// Load .env file
const result = dotenv.config({
    path: resolve(process.cwd(), '.env'),
    debug: true
});

if (result.error) {
    throw new Error(`Failed to load .env file: ${result.error.message}`);
}

// Verify config loading
console.log('Environment loaded:', {
    hasAsanaToken: !!process.env.ASANA_ACCESS_TOKEN,
    hasPort: !!process.env.PORT
});

export const config = {
  port: process.env.PORT || 3000,
  asanaToken: process.env.ASANA_ACCESS_TOKEN,
  whatsappToken: process.env.WHATSAPP_API_TOKEN,
  whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
  recipientNumber: process.env.RECIPIENT_NUMBER,
};