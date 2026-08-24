import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Language =
  | "en"
  | "hi"
  | "or"
  | "bn"
  | "mr"
  | "te"
  | "ta"
  | "gu"
  | "kn"
  | "pa";

const translations = {
  en: {
    home: "Home",
    report: "Report an Issue",
    howItWorks: "How It Works",
    impact: "Impact",
    contact: "Contact",
    reportIssue: "Report a Civic Issue",
    description:
      "Describe the civic issue you are facing.",
    location: "Location",
    evidence: "Evidence Photo",
    addPhoto: "Add Photo",
    detectLocation: "Detect Location",
    submit: "Submit Complaint",
    locationRequired:
      "Your location is required to submit the complaint.",
    photoRequired: "Photo is required",
    photoAttached: "Photo attached",
    loading: "Loading...",
    submitted: "Submitted",
    inProgress: "In Progress",
    resolved: "Resolved",
    dashboard: "Admin Dashboard",
    complaints: "Complaints",
    search: "Search",
    refresh: "Refresh",
    totalReports: "Total Reports",
    priority: "Priority",
    category: "Category",
    status: "Status",
    issue: "Issue",
    language: "Language",
    selectLanguage: "Select Language",
    noComplaints: "No complaints found.",
    noLocation: "No geographic data available",
    updating: "Updating...",
    submitSuccess: "Complaint submitted successfully.",
    somethingWrong: "Something went wrong.",
    stop: "Stop",
    speak: "Speak",
    listening: "Listening...",
    evidencePhoto: "Evidence Photo",
    uploadClearPhoto: "Upload a clear photo of the issue.",
    locationRequiredForComplaint: "Your location is required for this complaint.",
    detectLocationBeforeSubmit: "Detect your location before submitting.",
    locationDetected: "Location detected",
    accuracy: "Accuracy",
    analyzeSubmitComplaint: "Analyze and Submit Complaint",
    submitFailed: "Submission failed",
    tryAgain: "Try again",
    startOver: "Start over",
  },

  hi: {
    home: "होम",
    report: "समस्या दर्ज करें",
    howItWorks: "यह कैसे काम करता है",
    impact: "प्रभाव",
    contact: "संपर्क",
    reportIssue: "नागरिक समस्या दर्ज करें",
    description:
      "आप जिस नागरिक समस्या का सामना कर रहे हैं उसका विवरण दें।",
    location: "स्थान",
    evidence: "सबूत की फोटो",
    addPhoto: "फोटो जोड़ें",
    detectLocation: "स्थान पता करें",
    submit: "शिकायत दर्ज करें",
    locationRequired:
      "शिकायत दर्ज करने के लिए आपका स्थान आवश्यक है।",
    photoRequired: "फोटो आवश्यक है",
    photoAttached: "फोटो संलग्न है",
    loading: "लोड हो रहा है...",
    submitted: "दर्ज",
    inProgress: "कार्य प्रगति पर",
    resolved: "समाधान हो गया",
    dashboard: "एडमिन डैशबोर्ड",
    complaints: "शिकायतें",
    search: "खोजें",
    refresh: "रीफ्रेश",
    totalReports: "कुल रिपोर्ट",
    priority: "प्राथमिकता",
    category: "श्रेणी",
    status: "स्थिति",
    issue: "समस्या",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    noComplaints: "कोई शिकायत नहीं मिली।",
    noLocation: "भौगोलिक जानकारी उपलब्ध नहीं है",
    updating: "अपडेट हो रहा है...",
    submitSuccess: "शिकायत सफलतापूर्वक दर्ज हो गई।",
    somethingWrong: "कुछ गलत हो गया।",
  },

  or: {
    home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    report: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ",
    howItWorks: "ଏହା କିପରି କାମ କରେ",
    impact: "ପ୍ରଭାବ",
    contact: "ଯୋଗାଯୋଗ",
    reportIssue: "ନାଗରିକ ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ",
    description:
      "ଆପଣ ସମ୍ମୁଖୀନ ହେଉଥିବା ନାଗରିକ ସମସ୍ୟା ବିଷୟରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ।",
    location: "ସ୍ଥାନ",
    evidence: "ପ୍ରମାଣ ଫଟୋ",
    addPhoto: "ଫଟୋ ଯୋଡନ୍ତୁ",
    detectLocation: "ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",
    submit: "ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ",
    locationRequired:
      "ଅଭିଯୋଗ ଦାଖଲ କରିବା ପାଇଁ ଆପଣଙ୍କ ସ୍ଥାନ ଆବଶ୍ୟକ।",
    photoRequired: "ଫଟୋ ଆବଶ୍ୟକ",
    photoAttached: "ଫଟୋ ସଂଯୁକ୍ତ ହୋଇଛି",
    loading: "ଲୋଡ୍ ହେଉଛି...",
    submitted: "ଦାଖଲ ହୋଇଛି",
    inProgress: "କାର୍ଯ୍ୟ ଚାଲିଛି",
    resolved: "ସମାଧାନ ହୋଇଛି",
    dashboard: "ଆଡମିନ୍ ଡ୍ୟାସବୋର୍ଡ",
    complaints: "ଅଭିଯୋଗ",
    search: "ଖୋଜନ୍ତୁ",
    refresh: "ରିଫ୍ରେସ୍",
    totalReports: "ମୋଟ ରିପୋର୍ଟ",
    priority: "ପ୍ରାଥମିକତା",
    category: "ବର୍ଗ",
    status: "ସ୍ଥିତି",
    issue: "ସମସ୍ୟା",
    language: "ଭାଷା",
    selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
    noComplaints: "କୌଣସି ଅଭିଯୋଗ ମିଳିଲା ନାହିଁ।",
    noLocation: "ଭୌଗୋଳିକ ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ",
    updating: "ଅପଡେଟ୍ ହେଉଛି...",
    submitSuccess: "ଅଭିଯୋଗ ସଫଳତାର ସହ ଦାଖଲ ହୋଇଛି।",
    somethingWrong: "କିଛି ଭୁଲ ହୋଇଛି।",
  },

  bn: {
    home: "হোম",
    report: "সমস্যা রিপোর্ট করুন",
    howItWorks: "এটি কীভাবে কাজ করে",
    impact: "প্রভাব",
    contact: "যোগাযোগ",
    reportIssue: "নাগরিক সমস্যা রিপোর্ট করুন",
    description:
      "আপনি যে নাগরিক সমস্যার সম্মুখীন হচ্ছেন তা বর্ণনা করুন।",
    location: "অবস্থান",
    evidence: "প্রমাণের ছবি",
    addPhoto: "ছবি যোগ করুন",
    detectLocation: "অবস্থান শনাক্ত করুন",
    submit: "অভিযোগ জমা দিন",
    locationRequired:
      "অভিযোগ জমা দেওয়ার জন্য আপনার অবস্থান প্রয়োজন।",
    photoRequired: "ছবি প্রয়োজন",
    photoAttached: "ছবি সংযুক্ত হয়েছে",
    loading: "লোড হচ্ছে...",
    submitted: "জমা হয়েছে",
    inProgress: "কাজ চলছে",
    resolved: "সমাধান হয়েছে",
    dashboard: "অ্যাডমিন ড্যাশবোর্ড",
    complaints: "অভিযোগ",
    search: "অনুসন্ধান",
    refresh: "রিফ্রেশ",
    totalReports: "মোট রিপোর্ট",
    priority: "অগ্রাধিকার",
    category: "বিভাগ",
    status: "স্থিতি",
    issue: "সমস্যা",
    language: "ভাষা",
    selectLanguage: "ভাষা নির্বাচন করুন",
    noComplaints: "কোনও অভিযোগ পাওয়া যায়নি।",
    noLocation: "কোনও ভৌগোলিক তথ্য নেই",
    updating: "আপডেট হচ্ছে...",
    submitSuccess: "অভিযোগ সফলভাবে জমা হয়েছে।",
    somethingWrong: "কিছু ভুল হয়েছে।",
  },

  mr: {
    home: "मुख्यपृष्ठ",
    report: "समस्या नोंदवा",
    howItWorks: "हे कसे कार्य करते",
    impact: "परिणाम",
    contact: "संपर्क",
    reportIssue: "नागरी समस्या नोंदवा",
    description:
      "तुम्हाला येत असलेल्या नागरी समस्येचे वर्णन करा.",
    location: "स्थान",
    evidence: "पुराव्याचा फोटो",
    addPhoto: "फोटो जोडा",
    detectLocation: "स्थान शोधा",
    submit: "तक्रार नोंदवा",
    locationRequired:
      "तक्रार नोंदवण्यासाठी तुमचे स्थान आवश्यक आहे.",
    photoRequired: "फोटो आवश्यक आहे",
    photoAttached: "फोटो जोडला आहे",
    loading: "लोड होत आहे...",
    submitted: "नोंदवले",
    inProgress: "काम सुरू आहे",
    resolved: "निराकरण झाले",
    dashboard: "अॅडमिन डॅशबोर्ड",
    complaints: "तक्रारी",
    search: "शोधा",
    refresh: "रिफ्रेश",
    totalReports: "एकूण अहवाल",
    priority: "प्राधान्य",
    category: "श्रेणी",
    status: "स्थिती",
    issue: "समस्या",
    language: "भाषा",
    selectLanguage: "भाषा निवडा",
    noComplaints: "कोणतीही तक्रार आढळली नाही.",
    noLocation: "भौगोलिक माहिती उपलब्ध नाही",
    updating: "अपडेट होत आहे...",
    submitSuccess: "तक्रार यशस्वीरित्या नोंदवली.",
    somethingWrong: "काहीतरी चूक झाली.",
  },

  te: {
    home: "హోమ్",
    report: "సమస్యను నివేదించండి",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    impact: "ప్రభావం",
    contact: "సంప్రదించండి",
    reportIssue: "పౌర సమస్యను నివేదించండి",
    description:
      "మీరు ఎదుర్కొంటున్న పౌర సమస్యను వివరించండి.",
    location: "స్థానం",
    evidence: "ఆధార ఫోటో",
    addPhoto: "ఫోటో జోడించండి",
    detectLocation: "స్థానాన్ని గుర్తించండి",
    submit: "ఫిర్యాదు సమర్పించండి",
    locationRequired:
      "ఫిర్యాదు సమర్పించడానికి మీ స్థానం అవసరం.",
    photoRequired: "ఫోటో అవసరం",
    photoAttached: "ఫోటో జోడించబడింది",
    loading: "లోడ్ అవుతోంది...",
    submitted: "సమర్పించబడింది",
    inProgress: "పని జరుగుతోంది",
    resolved: "పరిష్కరించబడింది",
    dashboard: "అడ్మిన్ డ్యాష్‌బోర్డ్",
    complaints: "ఫిర్యాదులు",
    search: "శోధించండి",
    refresh: "రిఫ్రెష్",
    totalReports: "మొత్తం నివేదికలు",
    priority: "ప్రాధాన్యత",
    category: "వర్గం",
    status: "స్థితి",
    issue: "సమస్య",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    noComplaints: "ఫిర్యాదులు ఏవీ లేవు.",
    noLocation: "భౌగోళిక సమాచారం అందుబాటులో లేదు",
    updating: "నవీకరిస్తోంది...",
    submitSuccess: "ఫిర్యాదు విజయవంతంగా సమర్పించబడింది.",
    somethingWrong: "ఏదో తప్పు జరిగింది.",
  },

  ta: {
    home: "முகப்பு",
    report: "சிக்கலைப் புகாரளிக்கவும்",
    howItWorks: "இது எப்படி செயல்படுகிறது",
    impact: "தாக்கம்",
    contact: "தொடர்பு",
    reportIssue: "குடிமக்கள் பிரச்சினையைப் புகாரளிக்கவும்",
    description:
      "நீங்கள் எதிர்கொள்ளும் குடிமக்கள் பிரச்சினையை விவரிக்கவும்.",
    location: "இடம்",
    evidence: "ஆதாரப் புகைப்படம்",
    addPhoto: "புகைப்படம் சேர்க்கவும்",
    detectLocation: "இடத்தைக் கண்டறியவும்",
    submit: "புகாரைச் சமர்ப்பிக்கவும்",
    locationRequired:
      "புகாரைச் சமர்ப்பிக்க உங்கள் இருப்பிடம் தேவை.",
    photoRequired: "புகைப்படம் தேவை",
    photoAttached: "புகைப்படம் இணைக்கப்பட்டது",
    loading: "ஏற்றப்படுகிறது...",
    submitted: "சமர்ப்பிக்கப்பட்டது",
    inProgress: "செயலில் உள்ளது",
    resolved: "தீர்க்கப்பட்டது",
    dashboard: "நிர்வாக டாஷ்போர்டு",
    complaints: "புகார்கள்",
    search: "தேடல்",
    refresh: "புதுப்பிக்கவும்",
    totalReports: "மொத்த அறிக்கைகள்",
    priority: "முன்னுரிமை",
    category: "வகை",
    status: "நிலை",
    issue: "சிக்கல்",
    language: "மொழி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    noComplaints: "புகார்கள் எதுவும் இல்லை.",
    noLocation: "புவியியல் தகவல் இல்லை",
    updating: "புதுப்பிக்கப்படுகிறது...",
    submitSuccess: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
    somethingWrong: "ஏதோ தவறு ஏற்பட்டது.",
  },

  gu: {
    home: "હોમ",
    report: "સમસ્યાની જાણ કરો",
    howItWorks: "તે કેવી રીતે કાર્ય કરે છે",
    impact: "અસર",
    contact: "સંપર્ક",
    reportIssue: "નાગરિક સમસ્યાની જાણ કરો",
    description:
      "તમે જે નાગરિક સમસ્યાનો સામનો કરી રહ્યા છો તેનું વર્ણન કરો.",
    location: "સ્થાન",
    evidence: "પુરાવાનો ફોટો",
    addPhoto: "ફોટો ઉમેરો",
    detectLocation: "સ્થાન શોધો",
    submit: "ફરિયાદ સબમિટ કરો",
    locationRequired:
      "ફરિયાદ સબમિટ કરવા માટે તમારું સ્થાન જરૂરી છે.",
    photoRequired: "ફોટો જરૂરી છે",
    photoAttached: "ફોટો જોડાયેલ છે",
    loading: "લોડ થઈ રહ્યું છે...",
    submitted: "સબમિટ થયું",
    inProgress: "કામ ચાલુ છે",
    resolved: "ઉકેલાયું",
    dashboard: "એડમિન ડેશબોર્ડ",
    complaints: "ફરિયાદો",
    search: "શોધો",
    refresh: "રિફ્રેશ",
    totalReports: "કુલ અહેવાલો",
    priority: "પ્રાથમિકતા",
    category: "શ્રેણી",
    status: "સ્થિતિ",
    issue: "સમસ્યા",
    language: "ભાષા",
    selectLanguage: "ભાષા પસંદ કરો",
    noComplaints: "કોઈ ફરિયાદ મળી નથી.",
    noLocation: "ભૌગોલિક માહિતી ઉપલબ્ધ નથી",
    updating: "અપડેટ થઈ રહ્યું છે...",
    submitSuccess: "ફરિયાદ સફળતાપૂર્વક સબમિટ થઈ.",
    somethingWrong: "કંઈક ખોટું થયું.",
  },

  kn: {
    home: "ಮುಖಪುಟ",
    report: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    howItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    impact: "ಪರಿಣಾಮ",
    contact: "ಸಂಪರ್ಕ",
    reportIssue: "ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    description:
      "ನೀವು ಎದುರಿಸುತ್ತಿರುವ ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ.",
    location: "ಸ್ಥಳ",
    evidence: "ಸಾಕ್ಷ್ಯದ ಫೋಟೋ",
    addPhoto: "ಫೋಟೋ ಸೇರಿಸಿ",
    detectLocation: "ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ",
    submit: "ದೂರು ಸಲ್ಲಿಸಿ",
    locationRequired:
      "ದೂರು ಸಲ್ಲಿಸಲು ನಿಮ್ಮ ಸ್ಥಳ ಅಗತ್ಯವಿದೆ.",
    photoRequired: "ಫೋಟೋ ಅಗತ್ಯವಿದೆ",
    photoAttached: "ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    submitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    dashboard: "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    complaints: "ದೂರುಗಳು",
    search: "ಹುಡುಕಿ",
    refresh: "ರಿಫ್ರೆಶ್",
    totalReports: "ಒಟ್ಟು ವರದಿಗಳು",
    priority: "ಆದ್ಯತೆ",
    category: "ವರ್ಗ",
    status: "ಸ್ಥಿತಿ",
    issue: "ಸಮಸ್ಯೆ",
    language: "ಭಾಷೆ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    noComplaints: "ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    noLocation: "ಭೌಗೋಳಿಕ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
    updating: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    submitSuccess: "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.",
    somethingWrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ.",
  },

  pa: {
    home: "ਮੁੱਖ ਪੰਨਾ",
    report: "ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
    howItWorks: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    impact: "ਪ੍ਰਭਾਵ",
    contact: "ਸੰਪਰਕ",
    reportIssue: "ਨਾਗਰਿਕ ਸਮੱਸਿਆ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
    description:
      "ਤੁਹਾਨੂੰ ਆ ਰਹੀ ਨਾਗਰਿਕ ਸਮੱਸਿਆ ਦਾ ਵੇਰਵਾ ਦਿਓ।",
    location: "ਟਿਕਾਣਾ",
    evidence: "ਸਬੂਤ ਦੀ ਫੋਟੋ",
    addPhoto: "ਫੋਟੋ ਸ਼ਾਮਲ ਕਰੋ",
    detectLocation: "ਟਿਕਾਣਾ ਪਤਾ ਕਰੋ",
    submit: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    locationRequired:
      "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਲਈ ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
    photoRequired: "ਫੋਟੋ ਲਾਜ਼ਮੀ ਹੈ",
    photoAttached: "ਫੋਟੋ ਜੋੜੀ ਗਈ ਹੈ",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    submitted: "ਦਰਜ ਕੀਤਾ ਗਿਆ",
    inProgress: "ਕੰਮ ਜਾਰੀ ਹੈ",
    resolved: "ਹੱਲ ਕੀਤਾ ਗਿਆ",
    dashboard: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ",
    complaints: "ਸ਼ਿਕਾਇਤਾਂ",
    search: "ਖੋਜੋ",
    refresh: "ਰੀਫ੍ਰੈਸ਼",
    totalReports: "ਕੁੱਲ ਰਿਪੋਰਟਾਂ",
    priority: "ਤਰਜੀਹ",
    category: "ਸ਼੍ਰੇਣੀ",
    status: "ਸਥਿਤੀ",
    issue: "ਸਮੱਸਿਆ",
    language: "ਭਾਸ਼ਾ",
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    noComplaints: "ਕੋਈ ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ।",
    noLocation: "ਭੂਗੋਲਿਕ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ",
    updating: "ਅੱਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...",
    submitSuccess: "ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤੀ ਗਈ।",
    somethingWrong: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ।",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext =
  createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const savedLanguage =
    localStorage.getItem("civic-ai-language") as Language | null;

  const [language, setLanguageState] =
    useState<Language>(savedLanguage || "en");

  function setLanguage(language: Language) {
    setLanguageState(language);
    localStorage.setItem(
      "civic-ai-language",
      language
    );

    document.documentElement.lang = language;
  }

  function t(key: TranslationKey) {
    const localeTranslations = translations[language] as Partial<
      Record<TranslationKey, string>
    >;

    return localeTranslations[key] ?? translations.en[key];
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}