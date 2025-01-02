export interface AsanaWebhookEvent {
  resource: {
    gid: string;
    resource_type: string;
    name: string;
    status: string;
  };
  action: string;
  type: string;
}

export interface WhatsappMessage {
  templateName: string;
  parameters: string[];
}

export interface TaskResponse {
  data: {
    gid: string;
    name: string;
    completed: boolean;
    assignee: {
      gid: string;
      name: string;
    };
    // Add other fields as needed
  };
}
