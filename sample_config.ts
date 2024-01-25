export default {
  // LOGIN DETAILS
  LINKEDIN_EMAIL: "",
  LINKEDIN_PASSWORD: "",

  // JOB SEARCH PARAMETERS
  KEYWORDS: "javascript",
  LOCATION: "Portugal",
  WORKPLACE: {
    REMOTE: true, // whether you want remote jobs or not(true/false)
    ON_SITE: true, // whether you want on site jobs or not(true/false)
    HYBRID: true, // whether you want hybrid jobs or not(true/false)
  },
  JOB_TITLE: "(javascript|frontend|front-end|fullstack|full-stack|nodejs|node|js).*(developer|engineer)",
  JOB_DESCRIPTION: "^((?!(primeit))(.|[\n\r]))*$",
  JOB_DESCRIPTION_LANGUAGES: ["portuguese", "english"], // replace value with ["any"] to accept all job description laguages

  // FORM DATA
  PHONE: "912345678",
  CV_PATH: "",
  COVER_LETTER_PATH: "",
  HOME_CITY: "Lisbon, Portugal", // an object with the languages as keys and your proficiency as values
  YEARS_OF_EXPERIENCE: {  // an object with the skills as keys and the years of experience as values
    "angular": 5,
    "react.js": 6,
    ".net": 3,
    "php": 4,
    "spring": 4,
    "java": 4,
    "magento": 5,
    "node": 5,
    "javascript": 5,
    "mongodb": 5,
    "kubernetes": 5,
    "CI/CD": 5,
    "python": 5,
    "drupal": 5,
    "sass": 5,
    "html": 5,
    "google cloud": 5,
    "docker": 5,
    "terraform": 5,
    "css": 4,
    "typescript": 6,
    "webmethods": 5
  },
  LANGUAGE_PROFICIENCY: {
    "english": "professional",
    "spanish": "native",
    "french": "native"
  },
  REQUIRES_VISA_SPONSORSHIP: false, // whether you require visa sponsorship or not(true/false)
  TEXT_FIELDS: { "salary": "60k" }, // an object with the regexes to match input labels as keys and the input values as values (text value)
  BOOLEANS: { // an object with the regexes to match input labels as keys and the input values as values (true/false value)
    "bachelhor|bacharelado": true,
    "authorized": true
  },
  MULTIPLE_CHOICE_FIELDS: { "pronouns": "They/them" }, // an object with the regexes to match input labels as keys and the input values as values (option value)
  // OTHER SETTINGS
  SINGLE_PAGE: false, // whether you want the applied job windows to close after applying(true/false)
}
