# OAuth verification for Case Changer

Google classes `script.container.ui` (the menu-and-sidebar permission) as a sensitive scope, so the app must pass OAuth verification before the Marketplace listing can be approved. Everything below is what the Verification Center asks for.

## Already in place (4 September 2026)

- Homepage: https://workingwithkwan.github.io/case-changer/ (verified in Search Console)
- Privacy policy: https://workingwithkwan.github.io/case-changer/privacy-policy.html
- Terms: https://workingwithkwan.github.io/case-changer/terms-of-service.html
- Authorised domain: workingwithkwan.github.io
- Scopes on the consent screen: documents.currentonly, script.container.ui

## Progress (10 September 2026)

- Done: consent screen pushed to **In production** (Audience page shows "Your app requires verification").
- Done: demo video recorded (2 min 53 s, no audio, browser chrome cropped out) and saved as `assets/casechanger-demo.mp4`. Published on YouTube as Unlisted: https://youtu.be/U-UfWDBC3MM
- Done: Store Listing saved with all four icons, the card banner, the 1280x800 screenshot, pricing (Free of charge), category (Office Applications) and all support links.
- Done: app logo (icon-128.png) added on the Branding page and **Verify branding** started (Google checks the name, logo, home page and policy links automatically, up to 5 minutes). The Verification Center will not accept a data-access request until branding is verified.
- Branding check failed three times with "The website of your home page URL ... is not registered to you". Google checks the authorized domain (site root), and GitHub Pages only allowed a sub-folder property. Fix: new repo `workingwithkwan/workingwithkwan.github.io` (redirect page + the same Google verification file), and https://workingwithkwan.github.io/ verified in Search Console. The automated check still failed, so the appeal route was used.
- Done (10 September 2026, evening): **Submitted for verification.** Scope justification and video link saved on the Data Access page, appeal reason "The finding is incorrect" with an explanation of the Search Console verifications, questionnaire answered (not personal, internal, testing-only or SMTP plugin), both acknowledgements ticked. Verification Center now says "Your branding and data access are currently under review." Google says the Third Party Data Safety Team review takes 2 to 3 business days; watch workingwithkwan@gmail.com and ikhwancardiac@gmail.com for their email.
- Next: after Google approves, Marketplace SDK > Store Listing > **Submit for review**. Submitting the listing before OAuth verification is complete usually gets a "verification incomplete" rejection, so wait for the email first.

## Still needed from Ikhwan

1. Click **Publish app** on the consent screen's Audience page (Cloud console > Google Auth Platform > Audience).
2. Record a short demo video and upload it to YouTube as **Unlisted**. Script below.
3. Open **Verification Center**, click **Prepare for verification**, paste the video link and the justifications below, and submit.

## Demo video script (about 60 to 90 seconds)

Record the whole screen with QuickTime (File > New Screen Recording) at English UI language.

1. Show the Cloud console OAuth consent screen's **Branding** page for a moment so the app name "Case Changer" and project are visible.
2. Open a Google Doc that has a couple of sentences of text.
3. Go to **Extensions > Case Changer > UPPERCASE** with nothing authorised yet. The "Authorization required" dialog appears. Click **Continue**.
4. In the Google sign-in popup, pick the account, and pause on the consent screen so the two permissions are readable. Click **Allow**.
5. Select a sentence and run **Extensions > Case Changer > Title Case**. Show the text changing.
6. Open **Extensions > Case Changer > Open sidebar** and click **Sentence case** so the sidebar is shown in use.
7. End on the document with the changed text.

Say nothing or narrate briefly. No editing needed.

## Scope justifications (paste into the form)

**https://www.googleapis.com/auth/documents.currentonly**
Case Changer reads the text the user has selected in the currently open Google Doc and writes the same text back with its letter case changed (for example UPPERCASE, Title Case, Sentence case). It only touches the document the add-on is running in. No document content is stored or transmitted anywhere.

**https://www.googleapis.com/auth/script.container.ui**
Needed to add the "Case Changer" menu under Extensions and to show the sidebar with one button per case style. This is the only way an Editor add-on can present a menu or sidebar inside Google Docs.

## Application description for the form

Case Changer is a free Google Docs add-on that changes the case of selected text (UPPERCASE, lowercase, Sentence case, Title Case, Capitalize Each Word, iNVERSE cASE, aLtErNaTiNg cAsE) while keeping bold, links, colours and other formatting in place. It processes text inside Google's Apps Script platform and stores nothing.

## After verification is granted

Cloud console > Marketplace SDK > Store Listing > **Submit for review**. Google's Marketplace team reviews public listings, usually within a few days.
