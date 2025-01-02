import { Request, Response } from "express";
import { getTaskDetails } from "../services/asanaService.js";
import { sendTemplateMessage } from "../services/whatsappService.js";
import { AsanaWebhookEvent } from "../types/index.js";
import Asana from 'asana';

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const events: AsanaWebhookEvent[] = req.body.events;

        for (const event of events) {
            console.log(event.type)
            if (event.type === "task") {
                const task = await getTaskDetails(event.resource.gid);
                console.log(task);

                if (task) {
                    const message = {
                        templateName: "task_update",
                        parameters: [task.data.name, String(task.data.completed)],
                    };

                    await sendTemplateMessage(message);
                }
            }
        }
        res.status(200).send("Webhook Processed");
    } catch (error) {
        console.error('Webhook error: ', error);
        res.status(500).send("Internal Server Error");
    }
};