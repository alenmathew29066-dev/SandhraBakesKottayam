# 🎂 Sandhra Bakes – Google Form & Sheet Online Booking Setup Guide

This guide provides step-by-step instructions to configure the **Online Cake Booking / Order Request System** for **Sandhra Bakes – Homemade Cakes, Kottayam**.

---

## 🚀 Option 1: 1-Click Automated Setup (Recommended)
You can automatically create the **complete Google Form (17 fields)**, **private Google Sheet**, and **Order Status tracking system** in less than 60 seconds using Google Apps Script!

### Instructions:
1. Open your browser and go to [script.google.com](https://script.google.com/home/start).
2. Click **"+ New project"**.
3. Delete any default code in the editor and **paste the script below**.
4. Click the **Save** (💾) icon, then click **Run** (`createSandhraBakesFormAndSheet`).
5. Authorize permissions when prompted by Google.
6. Look at the **Execution log** at the bottom: it will print your **Google Form URL** and **Google Sheet URL**!
7. Copy the **Google Form Published URL** and paste it at line 17 of `app.js`:
   ```javascript
   const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";
   ```

### 1-Click Google Apps Script Code:
```javascript
function createSandhraBakesFormAndSheet() {
  // 1. Create the Google Form
  const form = FormApp.create('Sandhra Bakes – Cake Booking & Order Request');
  form.setDescription(
    'Welcome to Sandhra Bakes (Kottayam, Kerala)! Please submit your custom cake celebration details below. ' +
    'Our team will contact you shortly via Phone/WhatsApp to confirm availability, final price (Price range: ₹1,000 – ₹1,200), and delivery/pickup schedule.\n\n' +
    '📍 KALARICKAMACKAL HOUSE, Next to Manjamattam Church, Kottayam\n' +
    '📞 Phone / WhatsApp: 075609 02165'
  );
  form.setAllowResponseEdits(false);
  form.setCollectEmail(false);

  // Field 1: Customer Name
  form.addTextItem().setTitle('1. Customer Name').setRequired(true);

  // Field 2: Phone Number
  const phoneValidation = FormApp.createTextValidation()
    .setHelpText('Please enter a valid 10-digit phone number.')
    .requireRegexMatch('^[0-9+ -]{10,15}$')
    .build();
  form.addTextItem().setTitle('2. Phone Number').setRequired(true).setValidation(phoneValidation);

  // Field 3: WhatsApp Number
  form.addTextItem().setTitle('3. WhatsApp Number (if different)').setRequired(false);

  // Field 4: Email Address
  form.addTextItem().setTitle('4. Email Address').setRequired(false);

  // Field 5: Cake Type
  form.addListItem()
    .setTitle('5. Cake Type')
    .setChoiceValues([
      'Birthday Cake',
      'Chocolate Cake',
      'Fresh Cream Cake',
      'Theme Cake / Custom Designer',
      'Anniversary Cake',
      'Wedding Cake',
      'Almond Honey Cake (Signature)',
      'Rainbow Cake',
      'Choconut Cake',
      'Cupcakes',
      'Other Custom Cake'
    ])
    .setRequired(true);

  // Field 6: Cake Size / Weight
  form.addListItem()
    .setTitle('6. Cake Size / Weight')
    .setChoiceValues([
      '500g (Small intimate celebration)',
      '1.0 kg (Recommended family size)',
      '1.5 kg (Party size)',
      '2.0 kg (Large gathering)',
      '3.0 kg+ / Multi-tier celebration',
      'Custom / Other'
    ])
    .setRequired(true);

  // Field 7: Flavour Preference
  form.addListItem()
    .setTitle('7. Preferred Flavour')
    .setChoiceValues([
      'Rich Chocolate Ganache',
      'Almond Honey Signature',
      'Choconut Crunch',
      'Rainbow Vanilla Layer',
      'Classic Vanilla Bean',
      'Red Velvet with Cream Cheese',
      'Fresh Fruit & Cream',
      'Black Forest',
      'Butterscotch Crunch',
      'Other / Tell us in notes'
    ])
    .setRequired(true);

  // Field 8: Custom Design / Theme Details
  form.addParagraphTextItem()
    .setTitle('8. Custom Design / Theme Details')
    .setHelpText('Describe colors, cartoon/floral toppers, shapes, or design style you envision.')
    .setRequired(false);

  // Field 9: Message / Name on Cake
  form.addTextItem()
    .setTitle('9. Message / Name on Cake')
    .setHelpText("E.g., 'Happy 5th Birthday Ryan!' or 'Happy Anniversary'")
    .setRequired(false);

  // Field 10: Quantity
  form.addTextItem()
    .setTitle('10. Quantity')
    .setHelpText('Default is 1 cake.')
    .setRequired(true);

  // Field 11: Date Required
  form.addDateItem()
    .setTitle('11. Celebration Date Required')
    .setRequired(true);

  // Field 12: Delivery / Pickup Time
  form.addTimeItem()
    .setTitle('12. Preferred Delivery / Pickup Time')
    .setRequired(true);

  // Field 13: Order Type
  form.addMultipleChoiceItem()
    .setTitle('13. Order Type')
    .setChoiceValues([
      'Drive-Through / Pickup (KALARICKAMACKAL HOUSE, Next to Manjamattam Church, Kottayam)',
      'No-Contact Home Delivery in Kottayam'
    ])
    .setRequired(true);

  // Field 14: Delivery Address
  form.addParagraphTextItem()
    .setTitle('14. Delivery Address')
    .setHelpText('Required if Home Delivery was selected above. Include landmark in Kottayam.')
    .setRequired(false);

  // Field 15: Special Instructions
  form.addParagraphTextItem()
    .setTitle('15. Special Instructions & Dietary Notes')
    .setHelpText('Eggless request, less sugar, nut allergy, delivery timing notes, etc.')
    .setRequired(false);

  // Field 16: Estimated Budget
  form.addListItem()
    .setTitle('16. Estimated Budget')
    .setChoiceValues([
      '₹1,000 – ₹1,200 (Standard Range)',
      '₹1,200 – ₹2,000 (Custom / Premium)',
      '₹2,000+ (Multi-tier / Wedding)',
      'Flexible based on design'
    ])
    .setRequired(false);

  // 2. Create the Private Google Sheet
  const sheet = SpreadsheetApp.create('Sandhra Bakes – Customer Cake Orders (Private)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // 3. Setup Order Status in the Sheet
  Utilities.sleep(2000); // Allow sheet link to initialize
  const responseSheet = sheet.getSheets()[0];
  
  // Format header row
  responseSheet.getRange(1, 1, 1, 20).setBackground('#235F43').setFontColor('#FFFFFF').setFontWeight('bold');

  // Print URLs to log
  Logger.log('====================================================');
  Logger.log('🎉 SUCCESS! YOUR BOOKING SYSTEM HAS BEEN CREATED:');
  Logger.log('----------------------------------------------------');
  Logger.log('1. PUBLIC GOOGLE FORM LINK (Paste this into app.js):');
  Logger.log(form.getPublishedUrl());
  Logger.log('----------------------------------------------------');
  Logger.log('2. FORM EDIT LINK (For Sandhra Bakes admin):');
  Logger.log(form.getEditUrl());
  Logger.log('----------------------------------------------------');
  Logger.log('3. PRIVATE GOOGLE SHEET (Your order management dashboard):');
  Logger.log(sheet.getUrl());
  Logger.log('====================================================');
}
```

---

## 🛠️ Option 2: Manual Setup in Google Drive

If you prefer building the form manually without code, follow these steps:

### Step 1: Create the Google Form
1. Go to [forms.new](https://forms.new) in your web browser.
2. Title the form: **Sandhra Bakes – Cake Booking & Order Request**
3. In the description, write:
   > *Thank you for choosing Sandhra Bakes! Please fill out your celebration details below. Our team in Kottayam will contact you promptly via Phone/WhatsApp to confirm availability, final pricing (range: ₹1,000 – ₹1,200), and delivery/pickup schedule.*
   > *📍 KALARICKAMACKAL HOUSE, Next to Manjamattam Church, Kottayam*
   > *📞 Phone: 075609 02165*

### Step 2: Add the 17 Form Fields
Add the following questions in order:

| # | Field Name | Question Type | Options / Validation | Required? |
|---|---|---|---|---|
| **1** | Customer Name | Short answer | — | **Yes** |
| **2** | Phone Number | Short answer | Response validation: Regular expression matching `^[0-9+ -]{10,15}$` | **Yes** |
| **3** | WhatsApp Number | Short answer | Text | No |
| **4** | Email Address | Short answer | Text | No |
| **5** | Cake Type | Dropdown | Birthday Cake, Chocolate Cake, Fresh Cream Cake, Theme Cake, Anniversary Cake, Wedding Cake, Almond Honey Cake, Rainbow Cake, Choconut Cake, Cupcakes, Other | **Yes** |
| **6** | Cake Size / Weight | Dropdown | 500g, 1.0 kg, 1.5 kg, 2.0 kg, 3.0 kg+ / Multi-tier, Custom | **Yes** |
| **7** | Flavour Preference | Dropdown | Rich Chocolate Ganache, Almond Honey Signature, Choconut Crunch, Rainbow Vanilla Layer, Classic Vanilla Bean, Red Velvet, Fresh Fruit & Cream, Black Forest, Butterscotch, Other | **Yes** |
| **8** | Custom Design / Theme Details | Paragraph | Describe themes, colors, cartoon characters, toppers, or aesthetic vision | No |
| **9** | Message / Name on Cake | Short answer | E.g., *"Happy 5th Birthday Rahul!"* | No |
| **10** | Quantity | Short answer | Default `1` | **Yes** |
| **11** | Celebration Date Required | Date | Calendar date picker | **Yes** |
| **12** | Delivery / Pickup Time | Time | Preferred time of day | **Yes** |
| **13** | Order Type | Multiple Choice | • Drive-Through / Pickup (KALARICKAMACKAL HOUSE, Manjamattam)<br>• Home Delivery in Kottayam | **Yes** |
| **14** | Delivery Address | Paragraph | House name, street, landmark in Kottayam (needed if delivery chosen) | No |
| **15** | Special Instructions | Paragraph | Eggless, less sugar, nut allergy, delivery timing requests | No |
| **16** | Estimated Budget | Dropdown | • ₹1,000 – ₹1,200 (Standard Range)<br>• ₹1,200 – ₹2,000 (Custom / Premium)<br>• ₹2,000+ (Multi-tier)<br>• Flexible based on design | No |
| **17** | Reference Image Upload | File upload | Allow customers to upload reference photos from Pinterest or Instagram | No |

---

## 📊 Step 3: Link Responses to a Private Google Sheet

1. At the top of your Google Form, click the **"Responses"** tab.
2. Click the green **"Link to Sheets"** icon (or **"Create Spreadsheet"**).
3. Name the spreadsheet: `Sandhra Bakes – Customer Cake Orders (Private)`.
4. Click **Create**.
5. Your Google Sheet is now live! Every time a customer completes the form on the website, a new row appears in this spreadsheet automatically in real time.

---

## 🏷️ Step 4: Add the "Order Status" Tracking Column

To turn your Google Sheet into a full order management dashboard:

1. In your newly created Google Sheet, find the first empty column on the right (e.g. **Column R** or **S**).
2. Set the header title to: **Order Status**
3. Select the cells in that column (from row 2 down to row 500).
4. Click **Data** in the top menu → **Data validation** → **Add rule**.
5. Under Criteria, select **Dropdown**, and enter the following statuses:
   - 🆕 **New** (Light Blue)
   - 📞 **Contacted** (Yellow)
   - ✅ **Confirmed** (Light Green)
   - 🎂 **Preparing** (Orange)
   - 📦 **Ready** (Purple)
   - 🚚 **Delivered** (Dark Green)
   - ❌ **Cancelled** (Red / Grey)
6. Click **Done**. Now your team can track order status with one click!

> 🔒 **Security Notice:** Ensure your Google Sheet sharing settings are set to **"Restricted"** so that only you and your authorized bakery staff have access. Customers will never see this spreadsheet.

---

## 🔔 Step 5: Enable Instant Email Notifications

Never miss an order enquiry:
1. In Google Forms, go to the **Responses** tab.
2. Click the **three dots (⋮)** in the top-right corner.
3. Check **"Get email notifications for new responses"**.
4. You will now receive an instant email on your phone every time a customer submits a cake request!

---

## 🌐 Step 6: Connect Your Form to the Website

1. In Google Forms, click the purple **"Send"** button at the top right.
2. Select the **Link (🔗)** tab and click **"Copy"**.
   (Your link looks like: `https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform`)
3. Open your project's **`app.js`** file.
4. Replace line 17:
   ```javascript
   // Change this:
   const GOOGLE_FORM_URL = "PASTE_GOOGLE_FORM_LINK_HERE";

   // To your actual copied link:
   const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform";
   ```
5. Save `app.js`.

**All done!** Every **"Order Now"**, **"Book a Cake"**, and **"Order This Cake"** button across the website will now open your Google Form in a new tab!
