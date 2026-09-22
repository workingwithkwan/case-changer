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
- Done (later the same evening): app logo (icon-128.png) saved on the Branding page. Google warned that saving updates the pending verification request; accepted, since the review had only just started.
## Google's reply (11 September 2026, 1:19pm)

Email "[Action Needed] OAuth Verification Request Acknowledgement" from the Third Party Data Safety Team. Two items to fix, then **reply to that email** to continue:

1. Home page and privacy policy must be on a domain we own. A github.io address is a "third-party hosting platform" and is not accepted.
2. The privacy policy must describe data protection mechanisms for sensitive data.

### Fix 1: own domain (done 12 September 2026)

- **case-changer.app** bought at Cloudflare on 11 September 2026 (casechanger.app was taken). DNS at Cloudflare: four A records to GitHub Pages (185.199.108-111.153, DNS only), CNAME www -> workingwithkwan.github.io, TXT google-site-verification for Search Console. `docs/CNAME` added; GitHub Pages custom domain with Enforce HTTPS on. Search Console **Domain** property case-changer.app verified (DNS). Cloud console Branding: home page, privacy and terms URLs switched to case-changer.app and case-changer.app added as a second authorized domain (saved with the 'update your verification request' confirmation). Marketplace Store Listing: ToS, privacy, support and help URLs switched; draft saved. Old github.io URLs redirect to the new domain.
- After purchase: DNS records at the registrar (A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 for the root; CNAME `www` to `workingwithkwan.github.io`), `docs/CNAME` containing `case-changer.app`, GitHub repo Settings > Pages > custom domain + Enforce HTTPS, Search Console **Domain** property verified with the DNS TXT record, then update the home page / privacy / terms URLs and the authorized domain on the Cloud console Branding page, and the same URLs in the Marketplace Store Listing.
- New URLs will be https://case-changer.app/ , https://case-changer.app/privacy-policy.html , https://case-changer.app/terms-of-service.html , https://case-changer.app/support.html

### Fix 2: privacy policy (done 11 September 2026)

Added a "How your data is protected" section: processing inside Google Apps Script only, no storage or retention, HTTPS/TLS in transit, least-privilege scopes, access control, no third parties, open source, revocation, and a security contact. Live on the site.

### Reply sent to Google (12 September 2026, 1:03am, from ikhwancardiac@gmail.com)

Sent as a reply on the acknowledgement thread:

> Hello,
>
> Both items have been addressed for project case-changer-507602 (Case Changer):
>
> 1. The home page and privacy policy are now hosted on a domain we own, case-changer.app, verified in Google Search Console as a Domain property. Home page: https://case-changer.app/ . Privacy policy: https://case-changer.app/privacy-policy.html . The Branding page in the Cloud console has been updated with these URLs and the authorized domain.
> 2. The privacy policy now includes a "How your data is protected" section describing the data protection mechanisms (processing only inside Google Apps Script, no storage or retention, encryption in transit, least-privilege scopes, no third parties).
>
> The updated verification request has been saved in the Cloud console. Please continue the review.
>
> Thank you,
> Ikhwan Ariff

- 12 September 2026: support address set up. support@case-changer.app forwards to casechangersupport@gmail.com via Cloudflare Email Routing (destination verified, rule active, MX/SPF/DKIM records added by Cloudflare). The website, privacy policy, terms, support page and Marketplace listing now show support@case-changer.app. The consent screen's user support email stays ikhwancardiac@gmail.com (Google requires a project owner account there).
## Outcome

- **12 September 2026, 7:31pm: OAuth verification APPROVED** for script.container.ui (email from the Third Party Data Safety Team). Verification Center shows branding and data access both verified. Reminder from Google: any change to the consent screen configuration, or any new scope, needs a new verification request, so leave Branding and Data Access alone unless it is worth a re-review.
- **12 September 2026, ~7:45pm: Marketplace listing SUBMITTED FOR REVIEW.** The Store Listing is locked while in review ("The draft is in review and can't be edited"). If approved it publishes automatically at https://workspace.google.com/marketplace/app/case_changer/422980989821. Google's review emails go to the Developer Email, which is now support@case-changer.app (forwarded to casechangersupport@gmail.com). Submitting the listing before OAuth verification is complete usually gets a "verification incomplete" rejection, so wait for the email first.

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
- **14 September 2026, 8:05pm: Marketplace review started** (email from the GWM Reviews Team to support@case-changer.app). Replied the same evening from casechangersupport@gmail.com: no test credentials needed, nothing to allowlist, demo video link, OAuth approval on 12 September, and how to test.
- **14 September 2026, 11:21pm: Marketplace listing REJECTED** for one reason only: Google product names in the listing need the ™ symbol and a trademark footnote (branding guideline "giving proper attribution"). Fixed 15 September: short description now says "Google Docs™", detailed description uses "Google Docs™" and ends with "Google Docs™ and Google Workspace™ are trademarks of Google LLC." Resubmitted. Rule for the future: every Google product name in the Marketplace listing (short and detailed description) carries ™.
- **16 September 2026, 2:23am: second Marketplace review started** on the resubmission. Replied the same morning from the support inbox with the same information plus a note that this is the resubmission after the trademark fix.

## 15 September 2026: 1.0.1 approved, 1.2 submitted

Marketplace approved the resubmitted 1.0.1 listing (trademark symbols added). Live at https://workspace.google.com/marketplace/app/case_changer/422980989821. The same evening the 1.2 update (Sheets, Slides, acronyms, Title Case languages, whole-file mode, settings) was submitted as a new draft review. Screenshots for Sheets and Slides were captured from the Chrome window only, after an earlier capture that showed the desktop was removed and purged from git history.

## 17 September 2026: 1.2 approved

The public listing now shows the 1.2 text (Docs, Sheets and Slides, acronyms) and all three screenshots; the console's "draft is in review" banner is gone. Approved within two days of the 15 September submission. Next release: 1.3 (see RELEASE_1.3.md checklist).

## 17 September 2026: 1.3 submitted, branding logo changed

Store Listing draft submitted for review with the 1.3 text and the new logo graphics (console: "The draft is in review and can't be edited"). On Google Auth Platform > Branding the app logo was replaced with the new icon-128.png; the console warned that the previously verified branding stays on the consent screen until re-verified, so "Verify branding" was clicked (automated, up to 5 minutes). Lesson: the site's docs/assets copies of the icons must be updated too, otherwise fetch-injection uploads the old files.

## 19 September 2026: 1.3 approved, rename submitted

1.3 approved (email about 6 hours before this entry); the public listing shows snake_case, kebab-case and the language text. Same day: application name changed to "Case Changer for Google Docs™, Sheets™ & Slides™" (48 characters) in Store Listing > App Details > English, draft saved, SUBMITTED FOR REVIEW. The consent-screen app name was changed to the same string first: Save, Verify branding (passed in under two minutes), Publish branding; Verification Center shows branding verified and shown to users. Website updated to nine styles, twelve languages and three new FAQ entries.

## 18 September 2026: GitHub purge confirmed

GitHub Support (ticket 4764788, reply dated 17 September 09:54 UTC) completed the repository cleanup. Verified: the commit page, both raw screenshot URLs and the API lookup for 57725a8 now return 404, while the current history and the website are unaffected. The screenshot incident of 15 September is closed.

## 21 September 2026: rename approved; support mailbox restored

The public Marketplace listing now shows "Case Changer for Google Docs™, Sheets™ & Slides™", so the rename review of 19 September is approved and the listing is unlocked for the 1.4 + 1.5 release. Separately, casechangersupport@gmail.com was disabled by Google on about 18 September and restored on appeal (the owner reported the approval on 21 September). Mail DNS for case-changer.app is unchanged (Cloudflare MX and SPF). Not yet re-checked after the restore: that forwarded mail actually arrives, and that the "Send mail as" alias still works. Any review email sent while the mailbox was disabled may have bounced.

## 21 September 2026: 1.4 + 1.5 submitted

Before deploying, all six files in the Apps Script project were compared with the repository and matched exactly. Version 4 created; App Configuration set to version 4 (saved, confirmed after reload). Store Listing: English description updated (2,421 characters), five languages added through Add a Language (Indonesian, Spanish, Portuguese (Brazil), French, German), each with the same application name and ™ on every Google product name; draft saved and confirmed after reload (12 text areas, 6 name fields, no missing ™); SUBMIT FOR REVIEW confirmed, console shows "The draft is in review and can't be edited". Notes for next time: the Language dropdown in a New Language panel only opens with a real click, not a scripted one; the post-install tip is a single field shared by all languages; Malay is not an available listing language.

## 22 September 2026: 1.4 + 1.5 approved; 1.5.1 submitted

1.4 + 1.5 (Version 4) approved overnight and live; website and README updated to match. 1.5.1 released the same afternoon: Code.gs, Strings.gs, CaseLib.gs and Sidebar.html loaded from commit 9c2d4a3 into the Apps Script project (byte-for-byte match, "Saved to Drive" confirmed); dry-run in a fresh Doc: Sentence case gave Kuala Lumpur, Johor Bahru and New York, the menu shows "How it works", and the sidebar shows the rating line; Version 5 "v1.5.1 language audit and rating prompt" deployed; App Configuration set to version 5 for Docs, Sheets and Slides (confirmed after reload); the five translated listings (Indonesian, Spanish, Portuguese (Brazil), French, German) replaced with the corrected menu names (confirmed after reload, ™ unchanged); SUBMIT FOR REVIEW confirmed, console shows "The draft is in review and can't be edited". Test doc trashed. Notes for next time: a JavaScript `await` inside the Cloud console page hangs the automation, so set fields with plain scripts and click Done, Save Draft and Submit by coordinate; the tab strip's App Configuration tab did not navigate on click, use the direct URL; clicks inside the add-on sidebar frame do not register, so sidebar buttons are tested through the Extensions menu or locally.
