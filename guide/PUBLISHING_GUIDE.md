# Case Changer: from code to the Google Workspace Marketplace

This guide has two parts.

- **Part A (10 minutes)** gets the add-on working in your own Google Docs today. No review, no waiting.
- **Part B (about an hour of clicking, then a few days of Google review)** publishes it on the Marketplace so anyone can install it.

Do Part A first. Part B builds on the same Apps Script project.

Everything below assumes you are signed in to Google as ikhwancardiac@gmail.com. Because that is a personal Gmail account (not a Workspace domain), the Marketplace only lets you publish **publicly**, and public listings are reviewed by Google.

---

## Part A: run it in your own Docs today

### A1. Create the Apps Script project

1. Open https://script.google.com and click **New project**.
2. Click the name "Untitled project" at the top left and rename it to **Case Changer**.
3. Click the gear icon (**Project Settings**) on the left. Tick **Show "appsscript.json" manifest file in editor**. Go back to the **Editor** (the `< >` icon).

### A2. Paste in the four files

The files are in the `src` folder next to this guide. For each one, open it on your Mac, select all, copy, then paste into the browser.

1. **Code.gs**: the editor already has a file called `Code.gs`. Delete everything in it and paste the contents of `src/Code.gs`.
2. **CaseLib.gs**: click the **+** next to "Files", choose **Script**, name it `CaseLib` (the `.gs` is added for you). Paste the contents of `src/CaseLib.gs`.
3. **Sidebar.html**: click **+** again, choose **HTML**, name it `Sidebar`. Delete the placeholder and paste the contents of `src/Sidebar.html`.
4. **appsscript.json**: click the file in the list, delete everything, paste the contents of `src/appsscript.json`.

Press **Cmd+S** to save all files.

### A3. Install it for yourself as a test deployment

1. Click **Deploy** (top right) then **Test deployments**.
2. Click the gear next to "Select type" and choose **Editor Add-on**.
3. Click **Create new test**. Leave "Config" as **Installed and enabled**. You can leave the test document empty.
4. Click **Save test**, then select the test and click **Install**. Click **Done**.

### A4. Try it

1. Open any Google Doc (or make a new one at https://docs.new).
2. Highlight some text.
3. Go to **Extensions > Case Changer > UPPERCASE**.
4. The first time, Google asks you to authorise the add-on. Choose your account and click **Allow**. It only asks for access to the document it is running in.
5. Run the menu item again after authorising. The text changes case and keeps its formatting.

**Extensions > Case Changer > Open sidebar** gives you buttons instead of the menu.

If the Extensions menu does not show Case Changer, reload the Doc page once.

That is the whole add-on working. Everything after this point is only for publishing it publicly.

---

## Part B: publish on the Google Workspace Marketplace

### What you need before you start

- The Apps Script project from Part A.
- Three public web pages: a **privacy policy**, **terms of service** and a **support page**. Ready-to-use text is in this folder (`PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`, `SUPPORT.md`). Step B1 hosts them for free.
- Graphics from the `assets` folder: icon 32x32, icon 128x128, card banner 220x140. Already made.
- At least **one screenshot at 1280x800 pixels** of the add-on working inside a Doc. See step B7.

### B1. Host the policy pages on Google Sites (free)

1. Go to https://sites.google.com/new and click the **+** (blank site).
2. Name the site **Case Changer**. Set the home page title to "Case Changer".
3. On the home page, paste the short description from `LISTING.md` and a line saying who you are.
4. Use **Pages** (right panel) to add three pages: **Privacy Policy**, **Terms of Service**, **Support**. Paste the matching text from the `docs` folder into each. Replace `Ikhwan Ariff` with your name.
5. Click **Publish** (top right). Choose a web address such as `case-changer`. Click **Publish**.
6. Your URLs will look like:
   - Home: `https://sites.google.com/view/case-changer`
   - Privacy: `https://sites.google.com/view/case-changer/privacy-policy`
   - Terms: `https://sites.google.com/view/case-changer/terms-of-service`
   - Support: `https://sites.google.com/view/case-changer/support`

   Open each one in a private browser window to confirm they load without signing in.

### B2. Create a Google Cloud project

Apps Script normally uses a hidden "default" Cloud project. Publishing requires a real one.

1. Go to https://console.cloud.google.com/projectcreate.
2. Project name: **Case Changer**. Leave organisation as "No organisation". Click **Create**.
3. Once created, click the project name at the top and note the **Project number** (a 12-digit number on the dashboard, or under the project selector).

### B3. Set up the OAuth consent screen (the permission pop-up users see)

1. In the Cloud console, go to **APIs & Services > OAuth consent screen** (this may be labelled **Google Auth Platform**).
2. Click **Get started**.
   - App name: **Case Changer**
   - User support email: your Gmail address
   - Audience: **External**
   - Contact information: your Gmail address
   - Agree to the User Data Policy and click **Create**.
3. Go to **Branding**. Fill in:
   - Application home page: your Google Sites home URL
   - Privacy policy link: your privacy policy URL
   - Terms of service link: your terms URL
   - Authorised domains: `sites.google.com`
   - **Do not upload a logo.** Uploading a logo triggers a separate "brand verification" review. You can add it later.
4. Go to **Data Access > Add or remove scopes**. Tick these two (search for them, or paste in the "manually add scopes" box):
   - `https://www.googleapis.com/auth/documents.currentonly`
   - `https://www.googleapis.com/auth/script.container.ui`

   Click **Update** then **Save**. Note: the console lists `script.container.ui` under **sensitive** scopes, so a public listing must pass Google's OAuth verification (Verification Center) before the Marketplace review will approve it. Verification needs a homepage on a domain you can verify in Search Console, the privacy and terms pages on that domain, and a short demo video.
5. Go to **Audience** and click **Publish app**. Confirm. The status must read **In production**. A listing whose consent screen is still "Testing" is rejected by the Marketplace review.

### B4. Link Apps Script to the Cloud project

1. Back in your Apps Script project, click the gear (**Project Settings**).
2. Under **Google Cloud Platform (GCP) Project**, click **Change project**.
3. Paste the **Project number** from B2 and click **Set project**.
4. While you are here, copy the **Script ID** (near the top of Project Settings). You need it in B6.

### B5. Create a versioned deployment

1. Click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Add-on**.
3. Description: `v1.0.0 initial release`. Click **Deploy**.
4. Note the **version number** shown (it is 1 for the first deployment). Click **Done**.

Every future code change needs a new deployment (which creates version 2, 3, ...) and the version number updated in B6.

### B6. Enable and configure the Marketplace SDK

1. In the Cloud console, go to **APIs & Services > Library**, search **Google Workspace Marketplace SDK**, open it and click **Enable**.
2. Click **Manage**, then the **App Configuration** tab.
   - App visibility: **Public**. This choice is permanent, and Public is the only option for a Gmail account.
   - Installation settings: **Individual + Admin install**.
   - App integration: tick **Editor add-on**, then tick **Docs add-on**. Paste the **Script ID** from B4 and the **version number** from B5.
   - OAuth scopes: add the same two scopes as in B3, one per line.
   - Developer name: your name. Developer website: your Google Sites home URL. Developer email: your Gmail.
   - Trader status: choose **Non-trader** if this is a free personal project (this is an EU consumer-law declaration).
   - Click **Save**.

### B7. Take the screenshot

The listing needs at least one screenshot at **1280x800 pixels**, full bleed (no borders or padding).

1. Open a Doc that has a few lines of text, some of it bold or coloured.
2. Open **Extensions > Case Changer > Open sidebar** so the sidebar is visible.
3. Select a sentence so the reader can see what is about to change.
4. Capture the browser window. On a Mac press **Cmd+Shift+4**, then **Space**, then click the browser window. Open the PNG in Preview and use **Tools > Adjust Size** to make it exactly 1280 x 800 (untick "Scale proportionally" if needed, or crop first with **Tools > Crop**).
5. Optional second screenshot: the **Extensions > Case Changer** menu open.

Save them in the `assets` folder as `screenshot-1.png` and `screenshot-2.png`.

### B8. Fill in the Store Listing

Still in the Marketplace SDK, open the **Store Listing** tab. Copy the wording from `LISTING.md`.

- Language: English
- Application name: **Case Changer** (names may not contain "Google" or "Docs")
- Short description: from `LISTING.md`
- Detailed description: from `LISTING.md`
- Category: **Productivity** (or Utilities)
- Graphic assets: upload `assets/icon-32.png`, `assets/icon-128.png`, `assets/card-banner-220x140.png`, and your screenshot(s)
- Terms of service URL, Privacy policy URL, Support URL: your three Google Sites pages
- Pricing: **Free**
- Regions: leave all selected
- Click **Save**, then **Publish**.

### B9. Wait for review

Google emails you when the review finishes, usually within several days. If they ask for changes, the email lists them. The most common causes for a rejection are a consent screen still in "Testing", a policy link that does not open, or a screenshot that is the wrong size. Once approved, the add-on appears at `https://workspace.google.com/marketplace` and anyone can install it from **Extensions > Add-ons > Get add-ons** inside Docs.

---

## Updating the add-on later

1. Paste the changed file(s) into the Apps Script editor and save.
2. **Deploy > New deployment > Add-on** with a description like `v1.1.0`. Note the new version number.
3. Cloud console > Marketplace SDK > **App Configuration**: update the version number, save, and publish again. Public updates go through a short re-review.

## Optional: let this Mac push code directly

Instead of copy-pasting files, Google's `clasp` command-line tool can upload the `src` folder straight into the Apps Script project. It needs Node.js installed and a one-time sign-in from you. Ask for it when you want it and it can be set up in a few minutes.
