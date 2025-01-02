import Asana from "asana";
import { config } from "../config/env.js";
import { error } from "console";
import { TaskResponse } from "../types/index.js";
// import asana from "asana";

if (!config.asanaToken) {
  throw new Error("Asana token is not configured");
}

// @ts-ignore
const client = Asana.ApiClient.instance;
const token = client.authentications["token"];
token.accessToken = config.asanaToken;

// @ts-ignore
const tasksApiInstance = new Asana.TasksApi();
// @ts-ignore
const usersAPIInstance = new Asana.UsersApi();

interface AsanaTaskResponse {
  data: {
    actual_time_minutes?: number;
    approval_status?: string;
    assignee?: { name: string };
    assignee_section?: { name: string };
    assignee_status?: string;
    completed?: boolean;
    completed_at?: string;
    completed_by?: { name: string };
    created_at?: string;
    created_by?: { name: string };
    custom_fields?: Array<CustomField>;
    dependencies?: Array<string>;
    dependents?: Array<string>;
    due_at?: string;
    due_on?: string;
    followers?: Array<{ name: string }>;
    name: string;
    notes?: string;
    projects?: Array<{ name: string }>;
    tags?: Array<{ name: string }>;
    workspace?: { name: string };
    [key: string]: any; // for other fields in the opt_fields
  };
}

interface CustomField {
  name: string;
  type: string;
  enum_value?: { name: string; color?: string; enabled?: boolean };
  text_value?: string;
  number_value?: number;
  date_value?: { date?: string; date_time?: string };
  [key: string]: any; // for other custom field properties
}

// const client = asana.createClient({
//     defaultHeaders: {
//       "Asana-Enable":
//         "new_sections,string_ids,new_user_task_lists,new_project_templates",
//     },
// }).useAccessToken(config.asanaToken);

export const getTaskDetails = async (taskId: string): Promise<TaskResponse> => {
  // const task = await client.tasks.findById(taskId);
  // return task;
  let result: TaskResponse | undefined;

  try {
    const opts = {
      opt_fields:
        "actual_time_minutes,approval_status,assignee,assignee.name,assignee_section,assignee_section.name,assignee_status,completed,completed_at,completed_by,completed_by.name,created_at,created_by,custom_fields,custom_fields.asana_created_field,custom_fields.created_by,custom_fields.created_by.name,custom_fields.currency_code,custom_fields.custom_label,custom_fields.custom_label_position,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.description,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.format,custom_fields.has_notifications_enabled,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.is_global_to_workspace,custom_fields.is_value_read_only,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.people_value,custom_fields.people_value.name,custom_fields.precision,custom_fields.representation_type,custom_fields.resource_subtype,custom_fields.text_value,custom_fields.type,dependencies,dependents,due_at,due_on,external,external.data,followers,followers.name,hearted,hearts,hearts.user,hearts.user.name,html_notes,is_rendered_as_separator,liked,likes,likes.user,likes.user.name,memberships,memberships.project,memberships.project.name,memberships.section,memberships.section.name,modified_at,name,notes,num_hearts,num_likes,num_subtasks,parent,parent.created_by,parent.name,parent.resource_subtype,permalink_url,projects,projects.name,resource_subtype,start_at,start_on,tags,tags.name,workspace,workspace.name",
    };
    result = await tasksApiInstance.getTask(taskId, opts);

    if (!result || !result.data) {
      throw new Error("Invalid response from Asana API");
    }
    console.log("Task details: ", result);
  } catch (e) {
    console.error("Error fetching task details", e);
    throw new Error(`Error fetching task details: ${e}`);
  }
  // tasksApiInstance.getTask(taskId, opts).then((response: Response) => {
  //   console.log("Task details: ", task);
  // }, error);
  if (!result) {
    throw new Error("Failed to fetch task details");
  }
  return result;
};

export const getMe = async (): Promise<TaskResponse> => {
  interface AsanaUser {
    name: string;
    [key: string]: any; // for other user properties that might be present
  }

  let user_gid = "me"; // String | A string identifying a user. This can either be the string \"me\", an email, or the gid of a user.
  let opts = { 
      'opt_fields': "email,name,photo,photo.image_1024x1024,photo.image_128x128,photo.image_21x21,photo.image_27x27,photo.image_36x36,photo.image_60x60,workspaces,workspaces.name"
  };
  interface AsanaUserResponse {
    data: {
      gid: string;
      email: string;
      name: string;
      photo?: {
        image_1024x1024?: string;
        image_128x128?: string;
        image_21x21?: string;
        image_27x27?: string;
        image_36x36?: string;
        image_60x60?: string;
      };
      workspaces?: Array<{ name: string }>;
      [key: string]: any;
    };
  }

  interface AsanaErrorResponse {
    response: {
      body: any;
    };
  }

  try {
    const result = await usersAPIInstance.getUser(user_gid, opts);
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
    return result;
  } catch (error: any) {
    console.error(error.response.body);
    throw new Error(`Error fetching user details: ${error}`);
  }
};
