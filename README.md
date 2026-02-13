# ProLead Terra Function Call Documentation
This documentation explains all of function call that Terra uses.

List of function call:
- [`initialize_general_knowledge`](#initialize_general_knowledge)
- [`get_product_info`](#get_product_info)
- [`save_lead_info`](#save_lead_info)
- [`save_lead_schedule`](#save_lead_schedule)
- [`update_lead_status`](#update_lead_status)
- [`ban_lead`](#ban_lead)
- [`check_ban_status`](#check_ban_status)
- [`unban_lead`](#unban_lead)
- [`save_lead_task`](#save_lead_task)

## initialize_general_knowledge

This function will run at the very beginning of the conversation.

The main purpose of this function call is to give Terra with organization, agent, lead, product, and flow data based on the organization. 

### Overview
At the start of every new chat session, the system calls:
``` sh
initialize_general_knowledge
```
This function will:
- Identifies the organization
- Load company and agent configuration
- Ensure the WhatsApp lead exists (create if not)
- Fetches products, templates (Quick AI Messages), lead status, probing questions, questions and answers, and lead flow

This data will be the general knowledge for Terra throughout the conversation.

### Function Entry Point
This function is registered as an OpenAI function and **always be called at the beginning of the conversation.**

### Function definition:
```sh
{
   type: "function",
   name: "initialize_general_knowledge",
   description: "Service that returns general knowledge.",
},
```

### Core Logic
``` sh
initializeGeneralKnowledge
```
This function handles all database operation and database aggregation.

It will give Terra the following information:
- Organization information
- Terra agent configuration
- Template message (Quick AI Messages)
- Product information
- Lead status
- Lead flow
- Question and answer pairs
- Probing questions

It will also
- Create or resolve Lead (`whatsapp_id`)

### Step-by-step Flow
**1. Resolve Organization Context based on the `organization_id`**

Fetches field from `organizations` include:
- Name `organization_name`
- Address `organization_address`
- Phone number `organization_phone_number`
- Description `organization_description`
- Logo `organization_logo`
- Email `organization_email`
- Website `organization_website`
- Social Media `organization_ig`, `organization_x`, `organization_fb`, `organization_linkedin`

**2. Load Terra agent configuration**

Fetches field from `agents` include:
- Agent name `agent_name`
- Personality `agent_personality`
- Additional Prompt `agent_additional_prompt`
- Fixed instructions `agent_fixed_instruction_sales`, `agent_fixed_instruction_terra`

**3. Template messages (Quick AI Messages)**

Fetches field from `template` include:
- Template name `template_name` 
- Template content `template_content`

**4. Resolve or Create Lead**

Fetches field from `leads` include:
- If lead exist → use existing
- If not → create new lead

**5. Fetch products**

Fetches field from `products` include:
- Product ID `id`
- Product Name `product_name`
- Product Desciprtion `product_description`

**NOTE:** It will only fetch product within the active range

**6. Fetch Lead status**

Fetches fields from `lead_status` include:
- Lead status name `lead_status_name`

**7. Fetch Lead flow**

Fetches fields from `lead_flow` include:
- Origin status `lead_status_name AS origin_name`
- Destination Status `lead_status_name AS destination_name`
- Flags `lead_status_flag`

This allow Terra to follow CRM rules when updating the lead status

**8. Question and Answers pairs (QnA Library)**

Fetches fields from `question_and_answer` include:
- Question `question`
- Answer `answer`

**9. Probing Questions**

Fetches fields from `probing_question` include:
- Question `question`
- Mandatory `mandatory`
- Priority `priority`

**Final returned payload**

``` sh
terra_configuration: agent,
company_information: org,
lead_id: leadId,
products: products.rows,
lead_status: leadStatuses.rows,
lead_flow: leadFlows.rows,
templates: templates,
predefined_question_and_answer: questionAnswerPairs.rows,
probing_questions: probingQuestions.rows
```

### Expected response payload
```sh
{
  "terra_configuration": {
    "agent_name": "Ananda",
    "agent_personality": "casual, 24 years-old sales girl, short and direct answer",
    "agent_additional_prompt": "Strictly don't answer any inquiry for common / general property or development questions not related to our company"
  },
  "company_information": {
    "company_name": "PT Ayudha Mandiri Graha Kreasi",
    "company_history": "PT AMGK didirikan pada tahun 2012 oleh 3 orang yang telah berpengalaman puluhan tahun dalam dunia property dan pengembangan kawasan baik untuk residensial, komersial serta industrial. Pada 2022 kami mendapatkan penghargaan The Best Commercial Property Developer in Java dengan project kami Grand Pearl, sebuah kawasan niaga dengan konsep Belanda di daerah Bogor, Jawa Barat. Kini kami hadir untuk memberikan yang terbaik untuk Anda.",
    "company_head_office_address":  "Gedung ARPA, Jalan Jend Sudirman No 145, Bogor, Jawa Barat",
    "company_website": "https://www.amgk.co.id",
    "company_phone": "021-5833 3933",
    "company_social_media": {
      "instagram": "@amgk_property",
      "facebook": "amgk_property",
      "x": "@amgk_property_official"
    }
  },
  "products": [{
    "product_name": "Cluster Grand Amethyst",
    "product_location": "Bogor, Jawa Barat",
    "product_description": "Sebuah hunian dengan fasilitas lengkap di Kota Bogor, Jawa Barat. Hanya 15 menit menuju pintu tol, serta 10 menit menuju pusat kota, club house exclusive, akses transportasi umum yang mudah dan pada tahun 2030 direncakan akan dilewati oleh LRT Jabodetabek. Dengan ukuran bervariasi dari 5x10 sampai dengan 8x20, kami memberikan pilihan terbaik dengan kebutuhan kamu dan keluarga.",
    "product_status": "Launched, finished and active"
  }, {
    "product_name": "Cluster Kaliurang",
    "product_location": "Parung Panjang, Banten",
    "product_description": "Persiapkan diri Anda untuk menyambut sebuah area hunian eksklusif dengan fasilitas terlengkap yang pernah ada di daerah Parung Panjang, dengan lahan kawasan seluas 180 hektar, dan akan dibangun berbagai fasilitas lengkap baik komersil, botanical garden, mall, nature encampment, maupun entertainment area, menjadikan kawasan ini menjadi kawasan terpadu modern yang tetap memadukan suasana alami dan trandisional.",
    "product_status": "Conceptual, start development in 2027, handover start from 2029"
  }],
  "lead": {
    "lead_id": "343",
    "lead_status_id": "40",
    "lead_first_time_chat": false, 
    "lead_name": "Gunawan",
    "lead_location": "Jakarta Barat",
    "lead_notes": "Gunawan tertarik dengan produk Amerite Residence, tetapi masih mencari alternatif lain di daerah Tangerang atau Jakarta Selatan, maks budget Rp 1.5M, cicilan KPR sanggup sekitar Rp 10 juta per bulan."
  },
  "lead_flow": [{
      "lead_flow_id": "24",
      "lead_id_old": "40",
      "lead_id_new": "42",
      "lead_minimum_message": "3",
      "lead_minimum_interest": "50"
    }, {
      "lead_flow_id": "25",
      "lead_id_old": "42",
      "lead_id_new": "43",
      "lead_minimum_message": "5",
      "lead_minimum_interest": "90"
    }
  ]
  "templates": [
    {
      "template_id": 10,
      "template_name": "Welcome Message",
      "template_content": "Terima kasih telah menghubungi Pesona Elok. Ada yang bisa kami bantu?"
    },
    {
      "template_id": 11,
      "template_name": "Promo",
      "template_content": "PROMO FREE Biaya akad dan DP 0%"
    }
  ],
  "predefined_question_and_answer": [
    {
      "question": "Luas cluster berapa hektar",
      "answer": "Luas 8.2 ha"
    },
    {
      "question": "Apakah bisa KPR?",
      "answer": "Ya, kami bekerja sama dengan beberapa bank untuk KPR."
    }
  ],
  "probing_questions": [
    {
      "id": 1,
      "question": "Apakah Anda membeli untuk investasi atau tempat tinggal?",
      "mandatory": true,
      "priority": 3
    },
    {
      "id": 2,
      "question": "Suka berolahraga?",
      "mandatory": false,
      "priority": 5
    }
  ]
}
```
This function will be used by Terra to:
- Answer question accurately
- Use correct quick reply messages
- Ask probing questions
- Behave accordingly to agent personality
- Follow CRM lead flow rules

## get_product_info
This function call is used to retreive **detailed products information** during an active chat conversation.

This function is **invoked dynamically**, only when the user explicitly ask about a specific product.

### Overview
This function will:
- Resolving a product by ID or name
- Determining the product hierarchy level
- Fetching relevant properties based on that level
- Returning media assets (images & videos)

This function ensures Terra gives a detailed and structured product information.

### Function definition
``` sh
{
  type: "function",
  name: "get_product_info",
  description:
    "Service that returns detailed product data. All JSON keys must be concise and identifiable by Terra.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description:
          "Product ID (ONLY use if the user explicitly provides a number ID; otherwise omit this field).",
      },
      name: {
        type: "string",
        description: "Product name, used if ID is not provided.",
      },
      key: {
        type: "string",
        description: "Reserved for identification only.",
      },
    },
    required: [],
  },
}

```
### When this function is called
Terra will trigger `get_product_info` when:
- A Lead asks details about product
- A product name or ID is metioned

Examples:

- "Tolong kasih detail 50/60?"
- "Apa spesifikasi yang 82/98?"

### Core logic
`FetchDetailProducts`

This function handles the database operations to fetch product properties 

### Step-by-Step Flow
**1. Resolve product based on organization ID**

**2. Resolve product (ID or name)**

**3. Determine product level**

Product hierarchy is inferred using `parent_product_id`:

This level directly controls which properties are returned

`Level product: 1 | 2 | 3`

**4. Fetch product level (Level-Aware)**

Only properties mathcing the product's hierarchy level are returned

Each property includes
- Name
- Value
- Description

**5. Fetch Media Assets**

Fetched data from `products` table
- `product_name`
- `product_description`
- `parent_product_id`

From `product_properties` table:
- `property_name`
- `property_value`
- `property_description`

From `product_images` table:
- `image_url`

From `product_videos` table:
- `video_url`

### Expected response payload
```sh
{ "product_detail": {
  "id": 355,
  "product_name": "Amerite Residence",
  "parent_product_id" : "2"
  "product_description": "Luxury unit",
  "properties": [
    {
      "name": "Luas Bangunan",
      "value": "58 m2",
      "description": "Total luas bangunan rumah"
    },
    {
      "name": "Luas Tanah",
      "value": "72 m2",
      "description": "Total luas tanah"
    },
    {
      "name": "Kamar Tidur",
      "value": "3",
      "description": "Jumlah kamar tidur"
    },
    {
      "name": "Kamar Mandi",
      "value": "2",
      "description": "Jumlah kamar mandi"
    }
  ],
  "images": [
    {
      "url": "https://yourdomain.com/uploads/products/58-72-front.jpg",
      "description": "Tampak depan rumah"
    },
    {
      "url": "https://yourdomain.com/uploads/products/58-72-interior.jpg",
      "description": "Interior ruang tamu"
    }
  ],
  "videos": [
    {
      "url": "https://yourdomain.com/uploads/products/58-72-tour.mp4",
      "description": "Video virtual tour unit"
    }
  ]
}}
```

This function will be used by Terra to:
- Respect product hierarchy and structure
- Compare product consistently
- Reference media naturally
- Explain product specification accurately

## save_lead_info
This section explains the `save_lead_info` function call, this call is used to creating or updating Lead data.

This function is triggered when the user provide their detail or stores notes from the conversation.

### Overview
This function will:
- Create new Lead (if not exists)
- Update Lead (if exists)
- Assign status (defaults to Warm or Lead flow id 2)
- Update Lead notes 

### Function definition
```sh
{
  type: "function",
  name: "save_lead_info",
  description: "Service to save lead information into the system.",
  parameters: {
    type: "object",
    properties: {
      lead_id: {
        type: "integer",
        description: "ID of the lead (ONLY use if the user explicitly provides a number ID; otherwise omit this field).",
      },
      lead_name: {
        type: "string",
        description: "Name of the lead.",
      },
      lead_phone: {
        type: "string",
        description: "Phone number of the lead.",
      },
      lead_email: {
        type: "string",
        description: "Email address of the lead.",
      },
      lead_address: {
        type: "string",
        description: "Physical address of the lead.",
      },
      lead_location: {
        type: "string",
        description: "Location coordinates of the lead.",
      },
      lead_notes: {
        type: "string",
        description: "Additional notes about the lead.",
      },
    },
    required: ["lead_name"],
  },
}
```
### When this function is called
Terra will trigger this function when:
- Lead provides their personal information

Example:
- "Nama saya Toni"

### Core logic
`createLead`

This function handles:
- Lead detection
- Insert or update lead
- Notes processing
- History tracking

Fileds stored in `leads` table:


### Step-by-Step Flow

**1. Resolve lead data based on onrganization ID**

**2. Check if Lead already exists**

If Lead already exists:
- Update record
- Append notes with timestamp
- Insert history record

If Lead does not exists:
- Insert new Lead
- Insert history record

### Lead note processing
When updating an existing Lead each new note is:

- Timestamped
- Appended to existing notes
- Never overwritten

This ensures full conversation traceability

### Lead history logging
Every insert or update create a record in `leads_history`

Fields stored:
- `lead_id`
- `lead_name`
- `lead_phone`
- `lead_email`
- `lead_status_id`
- `lead_notes`
- `changed_by` = 'System'
- `changed_at` = NOW()

This ensures audit tracking.

### Expected response payload

```sh
{
  "message": "Lead created successfully.",
  "success": true,
  "lead_id": 45,
  "lead": {
    "lead_id": 45,
    "lead_name": "Budi Santoso",
    "lead_email": "budi@gmail.com",
    "lead_whatsapp_id": "628123456789",
    "lead_whatsapp_name": "Budi",
    "lead_status_id": 2,
    "lead_notes": "(2026-02-11T09:15:21.000Z)Interested in Tipe 58/72"
  }
}
```
This function will be used by Terra to:
- Save Lead information
- Update lead information
- Updates lead notes

## save_lead_schedule
This section explains the `save_lead_schedule` function call, this call is used to creating a visit schedule and assigning it to a sales agent.

### Overview
This function will:
- Schedule creation for a Lead
- Optional product linkage
- Automatic Sales assignmeng (Round Robin)
- Updates the Lead's visit status

### Function definition
```sh
{
  type: "function",
  name: "save_lead_schedule",
  description:
    "Service to save lead schedule information into the system.",
  parameters: {
    type: "object",
    properties: {
      lead_id: {
        type: "integer",
        description: "ID of the lead (ONLY use if explicitly provided).",
      },
      product_id: {
        type: "integer",
        description: "ID of the product (ONLY use if explicitly provided).",
      },
      schedule: {
        type: "string",
        description:
          "Tanggal & waktu dalam format ISO timestamp (contoh: 2025-11-21T09:00:00+07:00)"
      },
      status: {
        type: "string",
        description: "Status of the lead schedule.",
      },
      description: {
        type: "string",
        description: "Description of the lead schedule.",
      },
    },
    required: [],
  },
}

```

### When this function is called
Terra will trigger this function when:
- Lead request a visit
- Lead confirms visit date

Examples:
- "Saya mau visit besok jam 10 ya"
- "Tolong jadwalkan visit hari sabtu jam 2 siang"
- "Jadwalin visit senin minggu depan ya" 

### Core logic
`createLeadSchedule`

This function handles:
- Schedule insertion 
- Sales assignment
- WhatsApp session status update

### Step-by-Step Flow

**1. Fetch Sales data**

**2. Assign Sales using Round Robin**

**3. Insert Lead schedule**

Fileds stored in `lead_schedule`:
- `lead_id`
- `product_id`
- `schedule`
- `status`
- `description`
- `user_id` (sales ID)

**4. Update WhatsApp session flag**

Sets the `request_visit` to `true` 

### Expected response payload
Successful schedule creation:
```sh
{
  "message": "Lead schedule created successfully.",
  "success": true,
  "schedule_id": 88,
  "lead_schedule": {
    "schedule": "2025-11-21T09:00:00+07:00",
    "status": "Scheduled",
    "description": "Site visit requested",
    "lead_id": 45,
    "product_id": 12
  }
}
```

This function will be used by Terra to:
- Save Lead schedule information
- Update `request_visit` to `true`
- Assigns Sales fairly using Round Robin

## update_lead_status
This section explains the `update_lead_status` function call, this call is used for updating a lead's status within the CRM pipeline. This function is used to move leads through structured sales stages in a controlled way.

### Overview

This function will:
- Perform lead status transition
- Notes logging 
- Summary recording

### Function definition

```sh
{
  type: "function",
  name: "update_lead_status",
  description: "Update the status of a lead in the database using provided IDs and an optional summary.",
  strict: true,
  parameters: {
      type: "object",
      properties: {
          lead_id: {
              type: "string",
              description: "Unique identifier for the lead"
          },
          old_status_id: {
              type: "string",
              description: "Unique identifier for the lead's current status"
          },
          new_status_id: {
              type: "string",
              description: "Unique identifier for the lead's new status"
          },
          lead_flow_id: {
              type: "string",
              description: "Unique identifier for the lead flow"
          },
          summary: {
              type: "string",
              description: "Optional summary explaining the reason for changing the lead status (max 200 characters)",
              maxLength: 200
          }
      },
      required: [
          "lead_id",
          "old_status_id",
          "new_status_id",
          "lead_flow_id",
          "summary"
      ],
      additionalProperties: false
  }
},
```
### When this function is called
Terra will trigger this function when:
- An increase or decrease of Lead's interest

Examples:
- "Wow bagus ya yang tipe ini" (interest increase)
- "Kok segitu ya harganya?" (interest decrease)

### Core logic

`updateLeadStatus` This function handles:
- Updates lead status

Fields updated in `leads` table:
- `lead_status_id`
- `lead_notes` (Reason for the status changes)
- `updated_at`

### Final returned payload
```sh
message: 'Lead status updated successfully.',
success: true,
lead_id: updatedLead.rows[0].lead_id,
lead: updatedLead.rows[0]
```

### Expected response payload
```sh
{
  "message": "Lead status updated successfully.",
  "success": true,
  "lead_id": "45",
  "lead": {
    "lead_id": 45,
    "lead_name": "Budi Santoso",
    "lead_email": "budi@gmail.com",
    "lead_whatsapp_id": "628123456789",
    "lead_whatsapp_name": "Budi",
    "lead_status_id": 4,
    "lead_notes": "Previous notes\n(2026-02-12 10:20:31) Status changed to 4. Summary: Completed site visit and interested in booking."
  }
}
```

This function will be used by Terra to:
- Update lead status and note when theres an increase or decrease of interest.

## ban_lead
This section explains the `ban_lead` function call, this call is used to stores ban Lead from contacting via WhatsApp. This data will later be used in `check_ban_status` function call.

### Overview
This function will:
- Stores a Ban information for a Lead with `manner` score below 20

### Function definition
```sh
{
    type: "function",
    name: "ban_lead",
    description:
        "Service to ban a lead from contacting via WhatsApp. Triggered when a lead is reported or needs to be restricted.",
    parameters: {
        type: "object",
        properties: {
            lead_id: {
                type: "integer",
                description: "ID of the lead to be banned.",
            },
            manner_level: {
                type: "integer",
                description: "Manner level of the lead to be banned.",
            },
            ban_notes: {
                type: "string",
                description: "Notes regarding the ban reason.",
            },
            banned_until: {
                type: "string",
                description: "Timestamp until when the lead is banned (ISO format). Default is +7 days from now.",
            },
        },
        required: ["lead_id", "ban_notes"],
    },
},
```

### When this function is called
Terra will trigger this function when:
- `manner` score is below 20

Examples:
- "AI goblok bisa jawab ga sih lu!?" (until the `manner` score is below 20)

### Core logic
`banLead`

This function handles
- Ban information insertion

### Step-by-Step Flow
**1. Insert ban detail data**

Fields stored in `ban` table:
- `lead_id`
- `wa_id`
- `ban_notes`
- `banned_until` (dafault 7 days)

### Final returned payload
```sh
lead_id: parsedArgs.lead_id ?? null,
wa_id: lead_whatsapp_id ?? null,
ban_notes: parsedArgs.ban_notes,
banned_until: parsedArgs.banned_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
```

### Expected response payload
```sh
{
  "lead_id": 456,
  "wa_id": "62812367890",
  "ban_notes": "Lead repeatedly sent inappropriate messages. Manner score dropped to 15.",
  "banned_until": "2026-02-19T10:30:25.000Z",
}
```

This function will be used by Terra to:
- Stores a ban information for a Lead with manner score below 20

**This function will be used later in check_ban_status function call**

## check_ban_status

This section explains the `check_ban_status` function call, this call is used for check wether the Lead is in a banned list or not from the data created by `ban_lead` function call.

### Overview

This function will:
- Check wether the Lead is banned or not from the `ban` table created by `ban_lead` function call.
- Sends a WhatsApp API template message to a banned lead that they have been banned.

### Function definition
```sh
{
    type: "function",
    name: "check_ban_status",
    description:
        "Service to check if a lead is currently banned. Do this check before processing any incoming messages from the lead. When banned, respond with a polite message indicating the ban status. Dont say anything about until date.",
    parameters: {
        type: "object",
        properties: {
            lead_id: {
                type: "integer",
                description: "ID of the lead to check ban status.",
            },
        },
        required: ["lead_id"],
    },
}
```

### When this function is called
Terra will trigger this function when:
- Every message send by Lead

### Core logic
`checkBanStatus`
This function handles:
- Checks wether lead is on the `ban` table.
- Sends a message informing the Lead that they have been banned.

### Step-by-Step Flow
**1. Checks wether the Lead is on the `ban` list or not**

**2. if the lead is on the list, it will run a function**
It will run a function called `banStatusResult`
If the status is `is_banned` it will send a template message to the banned Lead that they have been banned.

### Final returned payload
```sh
is_banned: true, 
banned_until: banRecord.banned_until, 
ban_notes: banRecord.ban_notes
```

### Expected response payload
```sh
{
  "is_banned": true,
  "banned_until": "2026-05-20T10:00:00Z",
  "ban_notes": "Spam behavior detected."
}
```

This function will be used by Terra to:
- Checks wether the Lead is in the ban list before processing any messages from the Lead.

## unban_lead
This section explains the `unban_lead` function call, this call is used to unban a lead, allowing them to contact via WhatsApp again. For testing puropses this function can be triggered by typing 'unban me'

### Overview
This function will:
- Removes Lead from the `ban` list



### Function definition
```sh
    {
        type: "function",
        name: "unban_lead",
        description:
            "Service to unban a lead, allowing them to contact via WhatsApp again. For testing only, unban when lead sends 'unban me' message.",
        parameters: {
            type: "object",
            properties: {
                lead_id: {
                    type: "integer",
                    description: "ID of the lead to be unbanned.",
                },
            },
            required: ["lead_id"],
        },
    },
```

### When this function is called
Terra will trigger this function when:
- Lead sends 'unban me' message (for testing pusposes only)

### Core logic
`unbanLead`function handles:
- Deletes Lead from `ban` table

### Step-by-Step Flow
**1. Deletes lead data from the 'ban' list**

### Final returned payload
```sh
unbanned: deletedCount > 0
```

### Expected response payload
```sh
{
    "unbanned": 1
}
```

This function will be used by Terra to:
- Delete Lead data from the `ban` list
- Performs unbanning when Lead types "unban me" (for testing purposes only)

## save_lead_task
This function call is used to create a list of questions by Lead that can't be answered by Terra.

This function is triggered when Terra can't answer lead question wether the data for the question doesn't exist or Terra is instructed to not answer the question via the Fixed Instruction function.

### Overview

This function will:
- Create list of question that Terra cannot answer and add them into `lead_task` table.

### Function definition
```sh
{
    type: "function",
    name: "save_lead_task",
    description:
        "Service to save a lead task record.",
    parameters: {
        type: "object",
        properties: {
            lead_id: {
                type: "integer",
                description: "ID of the lead.",
            },
            task_notes: {
                type: "string",
                description: "Notes about the task.",
            },
             task_date: {
                type: "string",
                description: "Date and time of the follow-up (ISO format).",
            },
        },
        required: ["lead_id", "task_notes", "task_date"],
    },
}
```

### When this function is called

Terra will trigger this function when:

- Terra can't answer Lead question wether the data for the question doesn't exist or Terra is instructed to not answer the question via the Fixed Instruction function. Lead task question will appear in Lead Task page for the Sales team to answer them manually.

Examples:

Lead: "Bisa kasih info bunga bank BRI nggak" 

Terra: "Maaf saya tidak punya data bank saat ini, saya pastikan dulu ya" (Terra cannot answer this question because the data doesn't exist, therefore `save_lead_task` will be called)


Lead: "Bisa kasih simulasi KPR-nya?" 

Terra: "Maaf kak saya tidak bisa simulasi KPR disini. Saya teruskan pertanyaan ini ke pihak sales lapangan untuk simulasi lengkap " (Terra cannot answer this question because it's instructed in the Fixed Instruction to not answer this question, therefore `save_lead_task` will be called)

### Core logic
`createLeadTask`
This function handles:
- Creating a Lead task

Fields Stored in `lead_task`:
- `lead_id` (Lead ID)
- `task_note` (Lead's question that can't be answered by Terra)
- `task_date` (When this question is asked)

### Final returned payload
```sh
message: 'Lead task created successfully.',
success: true,
task_id: result.rows[0].id,
lead_task: result.rows[0]
```

### Expected response payload
```sh
{
  "message": `Lead task created successfully.`,
  "success": true,
  "task_id": 25,
  "lead_task": {
      "lead_id": 15,
      "task_notes": "Lead menanyakan tentang bunga bank BRI",
      "task_date": "2026-01-15T10:00:00.000Z",
      "created_at": "2026-01-15 15:42:18.123456+00",
      "updated_at": "2026-01-15 15:42:18.123456+00",
  }
}
```

This function will be used by Terra to:
- Pass unaswered Lead questions to Sales by listing it to `lead_task` and have them listed on the Lead Task page. 