# Linkedin easy apply bot

A tool designed to save you time when applying to linkedin jobs by applying to the jobs automatically for you

To run this tool follow the following steps

### First step, install the project's dependencies:
```
npm i
```

### Second step, copy the sample configuration file to your environment and fill it with your information
```
cp sample_config.ts config.ts
```
config.ts
```TS
export default {
  // LOGIN DETAILS
  LINKEDIN_EMAIL: "your-linkedin-email",
  LINKEDIN_PASSWORD: "your-linkedin-password",

  // JOB SEARCH PARAMETERS
  KEYWORDS: "your-job-search-keywords",
  LOCATION: "your-job-search-location",
  WORKPLACE: {
    REMOTE: true, // whether-you-want-remote-jobs-or-not(true/false)
    ON_SITE: true, // whether-you-want-on-site-jobs-or-not(true/false)
    HYBRID: true, // whether-you-want-hybrid-jobs-or-not(true/false)
  },
  JOB_TITLE: "a-regex-to-match-with-the-job-title",
  JOB_DESCRIPTION: "a-regex-to-match-with-the-job-description",

  // FORM DATA
  PHONE: "your-phone-number",
  CV_PATH: "path-to-your-cv",
  COVER_LETTER_PATH: "path-to-your-cover-letter",
  HOME_CITY: "where-you-are-based",
  YEARS_OF_EXPERIENCE: { // an-object-with-the-skills-as-keys-and-the-years-of-experience-as-values
    "angular": 5,
    "react.js": 6,
  },
  LANGUAGE_PROFICIENCY: {  // an-object-with-the-languages-as-keys-and-your-proficiency-as-values
    "english": "professional",
    "spanish": "native",
    "french": "professional"
  },
  REQUIRES_VISA_SPONSORSHIP: false, // whether-you-require-visa-sponsorship-or-not(true/false)
  TEXT_FIELDS: { // an-object-with-the-regexes-to-match-input-labels-as-keys-and-the-input-values-as-values (text value)
    "salary": "60k"
  },
  BOOLEANS: { // an-object-with-the-regexes-to-match-input-labels-as-keys-and-the-input-values-as-values (true/false value)
    "bachelhor|bacharelado": true,
    "authorized": true
  },
  MULTIPLE_CHOICE_FIELDS: { // an-object-with-the-regexes-to-match-input-labels-as-keys-and-the-input-values-as-values (option value)
    "pronouns": "They/them"
  },

  // OTHER SETTINGS
  SINGLE_PAGE: false, // whether-you-want-the-applied-job-windows-to-close-after-applying(true/false)
}
```

https://platform.openai.com/api-keys


1. secrets.yaml
This file contains sensitive information. Never share or commit this file to version control.

llm_api_key: [Your OpenAI or Ollama API key or Gemini API key]
Replace with your OpenAI API key for GPT integration
To obtain an API key, follow the tutorial at: https://medium.com/@lorenzozar/how-to-get-your-own-openai-api-key-f4d44e60c327
Note: You need to add credit to your OpenAI account to use the API. You can add credit by visiting the OpenAI billing dashboard.
According to the OpenAI community and our users' reports, right after setting up the OpenAI account and purchasing the required credits, users still have a Free account type. This prevents them from having unlimited access to OpenAI models and allows only 200 requests per day. This might cause runtime errors such as:
Error code: 429 - {'error': {'message': 'You exceeded your current quota, please check your plan and billing details. ...}}
{'error': {'message': 'Rate limit reached for gpt-4o-mini in organization <org> on requests per day (RPD): Limit 200, Used 200, Requested 1.}}
OpenAI will update your account automatically, but it might take some time, ranging from a couple of hours to a few days.
You can find more about your organization limits on the official page.
For obtaining Gemini API key visit Google AI for Devs
2. config.yaml
This file defines your job search parameters and bot behavior. Each section contains options that you can customize:

remote: [true/false]

Set to true to include remote jobs, false to exclude them
experienceLevel:

Set desired experience levels to true, others to false
jobTypes:

Set desired job types to true, others to false
date:

Choose one time range for job postings by setting it to true, others to false
positions:

List job titles you're interested in, one per line
Example:
positions:
  - Software Developer
  - Data Scientist
 
### Third step, run the program

```
npm run apply
```

To run the program without pressing the submit form button (for testing purposes)
```
npm run start
```


# Automated Job Application Script

This script automates the process of applying for jobs on LinkedIn using Puppeteer.

## Main Process (IIFE)

```plaintext
├── **Initialize Browser (Puppeteer)**
│   ├── Launch browser
│   │   ├── Headless: `false` (browser is visible)
│   ├── Create browser context
│   └── Close initial unused tab
├── **Login to LinkedIn**
│   └── `login({`
│       ├── `email: config.LINKEDIN_EMAIL`
│       └── `password: config.LINKEDIN_PASSWORD`
│   └── `})`
├── **askForPauseInput() [Recursive Function]**
│   ├── Prompts user to pause the script
│   ├── Sets `state.paused = true` (pause the script)
│   └── When user resumes:
│       └── Sets `state.paused = false` (unpauses script)
├── **Generate job links (fetchJobLinksUser)**
│   └── `linkGenerator = fetchJobLinksUser({`
│       ├── `page: listingPage`
│       ├── `location: config.LOCATION`
│       ├── `keywords: config.KEYWORDS`
│       ├── `workplace: config.WORKPLACE`
│       ├── `jobTitle: config.JOB_TITLE`
│       └── `jobDescription: config.JOB_DESCRIPTION`
│   └── `})`
├── **Loop through job links (for-await loop)**
│   ├── Check if new page is needed (`SINGLE_PAGE`)
│   │   ├── If true: open new application page
│   │   └── Else: use existing page
│   ├── Try to apply for each job
│   │   └── `apply({`
│   │       ├── `page: applicationPage`
│   │       ├── `link: current job link`
│   │       ├── `formData: {`
│   │       │   ├── `phone: config.PHONE`
│   │       │   ├── `cvPath: config.CV_PATH`
│   │       │   ├── `coverLetterPath: config.COVER_LETTER_PATH`
│   │       │   ├── `yearsOfExperience: config.YEARS_OF_EXPERIENCE`
│   │       │   ├── `languageProficiency: config.LANGUAGE_PROFICIENCY`
│   │       │   └── `multipleChoiceFields: config.MULTIPLE_CHOICE_FIELDS`
│   │       └── `}`
│   │       └── `shouldSubmit: process.argv[2] === "SUBMIT"`
│   │   └── `})`
├── **Error Handling**
│   └── If error: log `Error applying to ${title} at ${companyName}`
└── **Pause Check (state.paused)**
    ├── Loop waiting while `state.paused = true`
    └── Resume when `state.paused = false`
