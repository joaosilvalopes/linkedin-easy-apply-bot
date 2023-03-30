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

### Third step, run the program

```
npm run apply
```

To run the program without pressing the submit form button (for testing purposes)
```
npm run start
```
