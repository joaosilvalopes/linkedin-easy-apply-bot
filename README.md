# Linkedin easy apply bot

A tool designed to save you time when applying to linkedin jobs by applying to the jobs automatically for you

To run this tool follow the following steps

### First step, install the project's dependencies:
```
npm i
```

### Second step, copy the sample configuration file to your environment and fill it with your information
```
cp sample.env .env
```
.env
```
# LOGIN DETAILS
LINKEDIN_EMAIL=<your-linkedin-email>
LINKEDIN_PASSWORD=<your-linkedin-password>
# JOB SEARCH PARAMETERS
KEYWORDS=<your-job-search-keywords>
LOCATION=<your-job-search-location>
REMOTE=<whether-you-want-remote-or-on-site-jobs(true/false)>
EASY_APPLY=true
JOB_TITLE=<a-regex-to-match-with-the-job-title>
JOB_DESCRIPTION=<a-regex-to-match-with-the-job-description>
# LINKEDIN FORM DATA
PHONE=<your-phone-number>
CV_PATH=<path-to-your-cv>
COVER_LETTER_PATH=<path-to-your-cover-letter>
HOME_CITY=<where-you-are-based>
YEARS_OF_EXPERIENCE=<an-object-with-the-skills-as-keys-and-the-years-of-experience-as-values>
LANGUAGE_PROFICIENCY=<an-object-with-the-languages-as-keys-and-your-proficiency-as-values>
REQUIRES_VISA_SPONSORSHIP=<whether-you-require-visa-sponsorship-or-not(true/false)>
# As linkedin's easy apply forms may have custom fields created by the employer 
# in order to account for those you can insert custom values for text/booleans in these json objects
# format: { key(a regex to match with the input label): value(The value of the input true/false/a string) }
TEXT_FIELDS=<an-object-with-the-regexes-as-keys-and-the-input-values-as-values>
BOOLEANS=<an-object-with-the-regexes-as-keys-and-the-input-values-as-values>
MULTIPLE_CHOICE_FIELDS=<an-object-with-the-regexes-as-keys-and-the-input-values-as-values>
# OTHER SETTINGS
SINGLE_PAGE = <whether-you-want-the-applied-job-windows-to-close-after-applying(true/false)>
```

### Third step, run the program

```
npm run apply
```

To run the program without pressing the submit form button (for testing purposes)
```
npm run start
```
