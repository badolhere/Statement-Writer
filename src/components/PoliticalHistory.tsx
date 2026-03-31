import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, History, Info, ChevronRight, Languages } from 'lucide-react';

const politicalParties = [
  {
    name: "Bangladesh Awami League (AL)",
    nameBn: "বাংলাদেশ আওয়ামী লীগ (এএল)",
    history: [
      "Founded in 1949 as East Pakistan Awami Muslim League in Dhaka.",
      "Led the struggle for independence under Sheikh Mujibur Rahman.",
      "Key roles in 1952 Language Movement and 1966 Six-Point Movement.",
      "Formed the first government of Bangladesh (1972-1975).",
      "Assassination of Sheikh Mujib in 1975 led to 20 years out of power.",
      "Returned to power in 1996 and ruled consecutively from 2009 to 2024."
    ],
    historyBn: [
      "১৯৪৯ সালে ঢাকার রোজ গার্ডেনে পূর্ব পাকিস্তান আওয়ামী মুসলিম লীগ হিসেবে প্রতিষ্ঠিত হয়।",
      "শেখ মুজিবুর রহমানের নেতৃত্বে স্বাধীনতা সংগ্রামের নেতৃত্ব দেয়।",
      "১৯৫২ সালের ভাষা আন্দোলন এবং ১৯৬৬ সালের ছয় দফা আন্দোলনে গুরুত্বপূর্ণ ভূমিকা পালন করে।",
      "বাংলাদেশের প্রথম সরকার গঠন করে (১৯৭২-১৯৭৫)।",
      "১৯৭৫ সালে শেখ মুজিবের হত্যাকাণ্ড পরবর্তী ২০ বছর ক্ষমতার বাইরে রাখে।",
      "১৯৯৬ সালে ক্ষমতায় ফিরে আসে এবং ২০০৯ থেকে ২০২৪ পর্যন্ত টানা শাসন করে।"
    ],
    recentEvents: [
      "2024 Uprising: Massive student-led protests led to hundreds of deaths.",
      "Sheikh Hasina resigned and fled to India on August 5, 2024.",
      "2025 Ban: Interim government banned all AL activities under Anti-Terrorism laws.",
      "Election Commission cancelled party registration in 2025."
    ],
    recentEventsBn: [
      "২০২৪ অভ্যুত্থান: বিশাল ছাত্র-নেতৃত্বাধীন আন্দোলনে শত শত মানুষের মৃত্যু হয়।",
      "শেখ হাসিনা পদত্যাগ করেন এবং ৫ আগস্ট ২০২৪ তারিখে ভারতে পালিয়ে যান।",
      "২০২৫ নিষেধাজ্ঞা: অন্তর্বর্তীকালীন সরকার সন্ত্রাসবিরোধী আইনের অধীনে এএল-এর সমস্ত কার্যক্রম নিষিদ্ধ করে।",
      "২০২৫ সালে নির্বাচন কমিশন দলের নিবন্ধন বাতিল করে।"
    ],
    currentStatus: [
      "Officially banned as of 2025-2026.",
      "Cannot participate in elections.",
      "Leadership mostly in exile (India) or facing legal trials in ICT.",
      "Trying to organize supporters from abroad for a potential comeback."
    ],
    currentStatusBn: [
      "২০২৫-২০২৬ অনুযায়ী অফিসিয়ালি নিষিদ্ধ।",
      "নির্বাচনে অংশগ্রহণ করতে পারবে না।",
      "নেতৃত্বের বেশিরভাগই নির্বাসনে (ভারত) অথবা আইসিটি-তে আইনি বিচারের সম্মুখীন।",
      "বিদেশ থেকে সমর্থকদের সংগঠিত করার চেষ্টা করছে।"
    ],
    wings: [
      { name: "Bangladesh Chhatra League (BCL)", nameBn: "বাংলাদেশ ছাত্রলীগ (বিসিএল)", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Banned in 2024, labeled extremist.", noteBn: "২০২৪ সালে নিষিদ্ধ, চরমপন্থী হিসেবে চিহ্নিত।" },
      { name: "Bangladesh Jubo League", nameBn: "বাংলাদেশ যুবলীগ", type: "Youth Wing", typeBn: "যুব সংগঠন" },
      { name: "Bangladesh Krishok League", nameBn: "বাংলাদেশ কৃষক লীগ", type: "Farmers' Wing", typeBn: "কৃষক সংগঠন" },
      { name: "Bangladesh Sramik League", nameBn: "বাংলাদেশ শ্রমিক লীগ", type: "Labor Wing", typeBn: "শ্রমিক সংগঠন" },
      { name: "Bangladesh Sechchhashebok League", nameBn: "বাংলাদেশ স্বেচ্ছাসেবক লীগ", type: "Volunteer Wing", typeBn: "স্বেচ্ছাসেবক সংগঠন" },
      { name: "Bangladesh Mohila Awami League", nameBn: "বাংলাদেশ মহিলা আওয়ামী লীগ", type: "Women's Wing", typeBn: "মহিলা সংগঠন" }
    ],
    color: "bg-green-600",
    isBanned: true
  },
  {
    name: "Bangladesh Nationalist Party (BNP)",
    nameBn: "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)",
    history: [
      "Founded in 1978 by President Ziaur Rahman.",
      "Ideology: Bangladeshi nationalism, conservative / center-right.",
      "Held power 1991-1996 and 2001-2006 under Khaleda Zia.",
      "Spent 2007-2024 as the primary opposition, facing significant legal pressure."
    ],
    historyBn: [
      "১৯৭৮ সালে রাষ্ট্রপতি জিয়াউর রহমান কর্তৃক প্রতিষ্ঠিত।",
      "আদর্শ: বাংলাদেশী জাতীয়তাবাদ, রক্ষণশীল / মধ্য-ডানপন্থী।",
      "খালেদা জিয়ার অধীনে ১৯৯১-১৯৯৬ এবং ২০০১-২০০৬ সালে ক্ষমতায় ছিল।",
      "২০০৭-২০২৪ পর্যন্ত প্রধান বিরোধী দল হিসেবে ছিল এবং ব্যাপক আইনি চাপের সম্মুখীন হয়।"
    ],
    recentEvents: [
      "Major opposition force against Awami League.",
      "Played a big role in 2024 protests.",
      "Leaders released from prison following the 2024 political shift."
    ],
    recentEventsBn: [
      "আওয়ামী লীগের বিরুদ্ধে প্রধান বিরোধী শক্তি।",
      "২০২৪-এর আন্দোলনে বড় ভূমিকা পালন করেছে।",
      "২০২৪-এর রাজনৈতিক পরিবর্তনের পর নেতারা কারাগার থেকে মুক্তি পান।"
    ],
    currentStatus: [
      "🔥 Strong position after AL ban.",
      "Active and major contender for upcoming elections.",
      "Currently reorganizing party structure nationwide.",
      "Demanding quick elections from the interim government."
    ],
    currentStatusBn: [
      "🔥 এএল নিষিদ্ধ হওয়ার পর শক্তিশালী অবস্থানে।",
      "আসন্ন নির্বাচনের জন্য সক্রিয় এবং প্রধান প্রতিদ্বন্দ্বী।",
      "বর্তমানে দেশব্যাপী দলীয় কাঠামো পুনর্গঠন করছে।",
      "অন্তর্বর্তীকালীন সরকারের কাছে দ্রুত নির্বাচনের দাবি জানাচ্ছে।"
    ],
    wings: [
      { name: "Bangladesh Jatiotabadi Chhatra Dal (JCD)", nameBn: "বাংলাদেশ জাতীয়তাবাদী ছাত্রদল (জেসিডি)", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Very active in campuses post-2024.", noteBn: "২০২৪ পরবর্তী ক্যাম্পাসে খুব সক্রিয়।" },
      { name: "Bangladesh Jatiotabadi Jubo Dal", nameBn: "বাংলাদেশ জাতীয়তাবাদী যুবদল", type: "Youth Wing", typeBn: "যুব সংগঠন", note: "Gaining strength as BNP becomes dominant.", noteBn: "বিএনপি প্রভাবশালী হওয়ায় শক্তি অর্জন করছে।" },
      { name: "Bangladesh Jatiotabadi Krishok Dal", nameBn: "বাংলাদেশ জাতীয়তাবাদী কৃষক দল", type: "Farmers' Wing", typeBn: "কৃষক সংগঠন" },
      { name: "Bangladesh Jatiotabadi Sramik Dal", nameBn: "বাংলাদেশ জাতীয়তাবাদী শ্রমিক দল", type: "Labor Wing", typeBn: "শ্রমিক সংগঠন", note: "Strong in transport & garments.", noteBn: "পরিবহন ও পোশাক খাতে শক্তিশালী।" },
      { name: "Bangladesh Jatiotabadi Sechchhashebok Dal", nameBn: "বাংলাদেশ জাতীয়তাবাদী স্বেচ্ছাসেবক দল", type: "Volunteer Wing", typeBn: "স্বেচ্ছাসেবক সংগঠন" },
      { name: "Bangladesh Jatiotabadi Mohila Dal", nameBn: "বাংলাদেশ জাতীয়তাবাদী মহিলা দল", type: "Women's Wing", typeBn: "মহিলা সংগঠন" }
    ],
    color: "bg-blue-600"
  },
  {
    name: "Bangladesh Jamaat-e-Islami",
    nameBn: "বাংলাদেশ জামায়াতে ইসলামী",
    history: [
      "Founded in 1941 (before Bangladesh independence).",
      "Ideology: Islamic political system.",
      "Accused of opposing Bangladesh independence in 1971; many leaders convicted of war crimes.",
      "Registration was cancelled in 2013 by the High Court."
    ],
    historyBn: [
      "১৯৪১ সালে (বাংলাদেশের স্বাধীনতার আগে) প্রতিষ্ঠিত।",
      "আদর্শ: ইসলামী রাজনৈতিক ব্যবস্থা।",
      "১৯৭১ সালে বাংলাদেশের স্বাধীনতার বিরোধিতার অভিযোগ; অনেক নেতা যুদ্ধাপরাধে দণ্ডিত।",
      "২০১৩ সালে হাইকোর্ট কর্তৃক নিবন্ধন বাতিল করা হয়।"
    ],
    recentEvents: [
      "Ban lifted by the interim government in August 2024.",
      "Registration restored/under review in 2025.",
      "Significant mobilization of supporters post-2024 uprising."
    ],
    recentEventsBn: [
      "২০২৪ সালের আগস্টে অন্তর্বর্তীকালীন সরকার নিষেধাজ্ঞা তুলে নেয়।",
      "২০২৫ সালে নিবন্ধন পুনর্বহাল/পর্যালোচনার অধীনে।",
      "২০২৪-এর অভ্যুত্থান পরবর্তী সমর্থকদের ব্যাপক সংহতি।"
    ],
    currentStatus: [
      "⚠️ Growing influence.",
      "Working indirectly in politics with strong grassroots support.",
      "Positioning itself as a major force in the next elections."
    ],
    currentStatusBn: [
      "⚠️ ক্রমবর্ধমান প্রভাব।",
      "তৃণমূলের শক্তিশালী সমর্থন নিয়ে পরোক্ষভাবে রাজনীতিতে কাজ করছে।",
      "পরবর্তী নির্বাচনে নিজেকে একটি প্রধান শক্তি হিসেবে অবস্থান দিচ্ছে।"
    ],
    wings: [
      { name: "Bangladesh Islami Chhatra Shibir", nameBn: "বাংলাদেশ ইসলামী ছাত্রশিবির", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Highly organized, controversial history.", noteBn: "অত্যন্ত সুসংগঠিত, বিতর্কিত ইতিহাস।" },
      { name: "Bangladesh Islami Chhatra Bari", nameBn: "বাংলাদেশ ইসলামী ছাত্রীবরী", type: "Female Student Wing", typeBn: "ছাত্রী সংগঠন", note: "Religious & academic focus.", noteBn: "ধর্মীয় ও শিক্ষামূলক ফোকাস।" }
    ],
    color: "bg-emerald-800"
  },
  {
    name: "National Citizen Party (NCP)",
    nameBn: "ন্যাশনাল সিটিজেন পার্টি (এনসিপি)",
    history: [
      "Born through the July 2024 evolution movement.",
      "Represents the new generation of political activists from the student uprising.",
      "New political platform / reformist group."
    ],
    historyBn: [
      "২০২৪ সালের জুলাই বিপ্লবের মাধ্যমে জন্ম।",
      "ছাত্র অভ্যুত্থান থেকে আসা নতুন প্রজন্মের রাজনৈতিক কর্মীদের প্রতিনিধিত্ব করে।",
      "নতুন রাজনৈতিক প্ল্যাটফর্ম / সংস্কারবাদী গ্রুপ।"
    ],
    recentEvents: [
      "Formally organized in late 2024 to provide a third-way political alternative.",
      "Gaining traction among young voters and urban populations."
    ],
    recentEventsBn: [
      "তৃতীয় রাজনৈতিক বিকল্প প্রদানের জন্য ২০২৪-এর শেষের দিকে আনুষ্ঠানিকভাবে সংগঠিত।",
      "তরুণ ভোটার এবং শহুরে জনসংখ্যার মধ্যে জনপ্রিয়তা পাচ্ছে।"
    ],
    currentStatus: [
      "❓ Uncertain / Emerging.",
      "Active and preparing for its first national election.",
      "Focusing on state reform and transparency."
    ],
    currentStatusBn: [
      "❓ অনিশ্চিত / উদীয়মান।",
      "সক্রিয় এবং প্রথম জাতীয় নির্বাচনের জন্য প্রস্তুতি নিচ্ছে।",
      "রাষ্ট্রীয় সংস্কার এবং স্বচ্ছতার ওপর গুরুত্ব দিচ্ছে।"
    ],
    wings: [
      { name: "NCP Students' Wing", nameBn: "এনসিপি ছাত্র উইং", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Focus on reform politics.", noteBn: "সংস্কার রাজনীতির ওপর গুরুত্ব।" },
      { name: "NCP Youth Front", nameBn: "এনসিপি যুব ফ্রন্ট", type: "Youth Wing", typeBn: "যুব সংগঠন", note: "Still developing structure.", noteBn: "এখনও কাঠামো তৈরি হচ্ছে।" }
    ],
    color: "bg-red-600"
  },
  {
    name: "Jatiya Party (JP)",
    nameBn: "জাতীয় পার্টি (জেপি)",
    history: [
      "Founded in 1986 by President Hussain Muhammad Ershad.",
      "Ideology: Center / opportunistic politics.",
      "Often plays 'kingmaker' role in alliances."
    ],
    historyBn: [
      "১৯৮৬ সালে রাষ্ট্রপতি হুসেইন মুহম্মদ এরশাদ কর্তৃক প্রতিষ্ঠিত।",
      "আদর্শ: মধ্যপন্থী / সুবিধাবাদী রাজনীতি।",
      "জোটের ক্ষেত্রে প্রায়শই 'কিংমেকার' ভূমিকা পালন করে।"
    ],
    recentEvents: [
      "Internal leadership conflicts intensified in 2024-2025.",
      "Faced criticism for its role as the 'official opposition' during the AL era."
    ],
    recentEventsBn: [
      "২০২৪-২০২৫ সালে অভ্যন্তরীণ নেতৃত্ব দ্বন্দ্ব তীব্র হয়।",
      "এএল আমলে 'গৃহপালিত বিরোধী দল' হিসেবে ভূমিকার জন্য সমালোচনার সম্মুখীন।"
    ],
    currentStatus: [
      "📉 Weakened after Ershad's death.",
      "Internal divisions and less influence compared to before.",
      "Participating in reform dialogues with the interim government."
    ],
    currentStatusBn: [
      "📉 এরশাদের মৃত্যুর পর দুর্বল হয়ে পড়েছে।",
      "অভ্যন্তরীণ বিভাজন এবং আগের তুলনায় কম প্রভাব।",
      "অন্তর্বর্তীকালীন সরকারের সাথে সংস্কার সংলাপে অংশগ্রহণ করছে।"
    ],
    wings: [
      { name: "Jatiya Chhatra Samaj", nameBn: "জাতীয় ছাত্র সমাজ", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Weak compared to past.", noteBn: "অতীতের তুলনায় দুর্বল।" },
      { name: "Jatiya Jubo Sanhati", nameBn: "জাতীয় যুব সংহতি", type: "Youth Wing", typeBn: "যুব সংগঠন", note: "Limited influence.", noteBn: "সীমিত প্রভাব।" }
    ],
    color: "bg-orange-600"
  },
  {
    name: "Workers Party of Bangladesh",
    nameBn: "বাংলাদেশের ওয়ার্কার্স পার্টি",
    history: [
      "A communist party founded in 1980.",
      "Focus: Workers' rights and social equality.",
      "Part of the 14-party alliance led by the Awami League for many years."
    ],
    historyBn: [
      "১৯৮০ সালে প্রতিষ্ঠিত একটি কমিউনিস্ট দল।",
      "ফোকাস: শ্রমিকদের অধিকার এবং সামাজিক সমতা।",
      "অনেক বছর ধরে আওয়ামী লীগের নেতৃত্বাধীন ১৪-দলীয় জোটের অংশ ছিল।"
    ],
    recentEvents: [
      "Faced significant backlash in 2024 due to its alliance with the AL.",
      "Lost major political backing after the AL ban."
    ],
    recentEventsBn: [
      "এএল-এর সাথে জোটের কারণে ২০২৪ সালে ব্যাপক জনরোষের সম্মুখীন হয়।",
      "এএল নিষিদ্ধ হওয়ার পর প্রধান রাজনৈতিক সমর্থন হারিয়েছে।"
    ],
    currentStatus: [
      "📉 Influence significantly reduced post-2024.",
      "Trying to distance itself from the previous government's actions."
    ],
    currentStatusBn: [
      "📉 ২০২৪ পরবর্তী প্রভাব উল্লেখযোগ্যভাবে হ্রাস পেয়েছে।",
      "আগের সরকারের কর্মকাণ্ড থেকে নিজেকে দূরে রাখার চেষ্টা করছে।"
    ],
    wings: [
      { name: "Bangladesh Chhatra Moitree", nameBn: "বাংলাদেশ ছাত্র মৈত্রী", type: "Student Wing", typeBn: "ছাত্র সংগঠন", note: "Focus on education rights.", noteBn: "শিক্ষা অধিকারের ওপর গুরুত্ব।" },
      { name: "Bangladesh Jubo Moitree", nameBn: "বাংলাদেশ যুব মৈত্রী", type: "Youth Wing", typeBn: "যুব সংগঠন", note: "Focus on social justice.", noteBn: "সামাজিক ন্যায়বিচারের ওপর গুরুত্ব।" }
    ],
    color: "bg-red-800"
  },
  {
    name: "Liberal Democratic Party (LDP)",
    nameBn: "লিবারেল ডেমোক্রেটিক পার্টি (এলডিপি)",
    history: [
      "Founded by Oli Ahmad (former BNP leader).",
      "Small party, usually aligns with BNP-led alliances."
    ],
    historyBn: [
      "অলি আহমদ (সাবেক বিএনপি নেতা) কর্তৃক প্রতিষ্ঠিত।",
      "ছোট দল, সাধারণত বিএনপি নেতৃত্বাধীন জোটের সাথে থাকে।"
    ],
    recentEvents: [
      "Active in the 2024 movement alongside BNP.",
      "Acts more as a supporting party."
    ],
    recentEventsBn: [
      "বিএনপির পাশাপাশি ২০২৪-এর আন্দোলনে সক্রিয়।",
      "সহায়ক দল হিসেবে বেশি কাজ করে।"
    ],
    currentStatus: [
      "📉 Limited independent power.",
      "Acts as a supporting partner in the current political landscape."
    ],
    currentStatusBn: [
      "📉 সীমিত স্বাধীন ক্ষমতা।",
      "বর্তমান রাজনৈতিক প্রেক্ষাপটে একটি সহায়ক অংশীদার হিসেবে কাজ করে।"
    ],
    wings: [],
    color: "bg-yellow-600"
  }
];

export default function PoliticalHistory({ onBack }: { onBack: () => void }) {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  const t = {
    title: lang === 'en' ? "Political History" : "রাজনৈতিক ইতিহাস",
    subtitle: lang === 'en' ? "Updated 2024-2026 Reference Guide" : "হালনাগাদ ২০২৪-২০২৬ রেফারেন্স গাইড",
    back: lang === 'en' ? "Back to Home" : "হোমে ফিরে যান",
    historyTitle: lang === 'en' ? "Historical Background" : "ঐতিহাসিক পটভূমি",
    eventsTitle: lang === 'en' ? "Recent Events (2024-2026)" : "সাম্প্রতিক ঘটনা (২০২৪-২০২৬)",
    statusTitle: lang === 'en' ? "Current Reality" : "বর্তমান বাস্তবতা",
    wingsTitle: lang === 'en' ? "Associated Wings" : "সহযোগী সংগঠনসমূহ",
    banned: lang === 'en' ? "Officially Banned" : "অফিসিয়ালি নিষিদ্ধ",
    comparisonTitle: lang === 'en' ? "Quick Comparison (2026)" : "দ্রুত তুলনা (২০২৬)",
    party: lang === 'en' ? "Party" : "দল",
    ideology: lang === 'en' ? "Ideology" : "আদর্শ",
    strength: lang === 'en' ? "Strength" : "শক্তি",
    wingsWork: lang === 'en' ? "How Wings Work" : "সহযোগী সংগঠনগুলো কীভাবে কাজ করে",
    streetStrength: lang === 'en' ? "Street Strength" : "রাজপথের শক্তি",
    legalTitle: lang === 'en' ? "Legal Context for Asylum" : "অ্যাসাইলামের জন্য আইনি প্রেক্ষাপট",
    legalContent: lang === 'en' 
      ? "When drafting your statement, use these historical facts to ground your personal experiences. For example, if you were a member of a banned wing like the BCL, explain how the 2025 ban has directly impacted your safety. Specific details about party history and recent political shifts add significant weight to your claim of persecution."
      : "আপনার জবানবন্দি তৈরির সময়, আপনার ব্যক্তিগত অভিজ্ঞতাগুলোকে প্রতিষ্ঠিত করতে এই ঐতিহাসিক তথ্যগুলো ব্যবহার করুন। উদাহরণস্বরূপ, আপনি যদি বিসিএল-এর মতো নিষিদ্ধ সংগঠনের সদস্য হয়ে থাকেন, তবে ২০২৫ সালের নিষেধাজ্ঞা কীভাবে আপনার নিরাপত্তাকে সরাসরি প্রভাবিত করেছে তা ব্যাখ্যা করুন। দলের ইতিহাস এবং সাম্প্রতিক রাজনৈতিক পরিবর্তন সম্পর্কে সুনির্দিষ্ট বিবরণ আপনার নির্যাতনের দাবির ক্ষেত্রে উল্লেখযোগ্য গুরুত্ব যোগ করে।",
    wingsWorkContent: lang === 'en'
      ? "In Bangladesh politics, these wings control campus politics and organize rallies, protests, and elections. They serve as a training ground for future leaders. Many top politicians started in student wings before moving to youth wings and finally the main party."
      : "বাংলাদেশের রাজনীতিতে এই সহযোগী সংগঠনগুলো ক্যাম্পাস রাজনীতি নিয়ন্ত্রণ করে এবং সমাবেশ, প্রতিবাদ ও নির্বাচন আয়োজন করে। এগুলো ভবিষ্যৎ নেতাদের জন্য একটি প্রশিক্ষণ ক্ষেত্র হিসেবে কাজ করে। অনেক শীর্ষ রাজনীতিবিদ মূল দলে আসার আগে ছাত্র সংগঠন এবং পরে যুব সংগঠন থেকে শুরু করেছিলেন।",
    streetStrengthContent: lang === 'en'
      ? "Student wings often hold the real power on the ground, while youth wings provide the \"street strength\" necessary for large-scale political movements. Understanding these wings is often more critical than understanding the main party itself."
      : "ছাত্র সংগঠনগুলো প্রায়শই মাঠ পর্যায়ে প্রকৃত ক্ষমতা ধরে রাখে, যখন যুব সংগঠনগুলো বড় ধরনের রাজনৈতিক আন্দোলনের জন্য প্রয়োজনীয় \"রাজপথের শক্তি\" প্রদান করে। এই সহযোগী সংগঠনগুলোকে বোঝা প্রায়শই মূল দলটিকে বোঝার চেয়ে বেশি গুরুত্বপূর্ণ।"
  };

  return (
    <div className="min-h-screen bg-[#F3F4F9] p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium"
          >
            <ChevronRight className="rotate-180" size={20} /> {t.back}
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
          >
            <Languages size={18} />
            {lang === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200">
            <History className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-8">
          {politicalParties.map((party, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden"
            >
              {party.isBanned && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-200">
                  {t.banned}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-4 h-12 rounded-full ${party.color}`} />
                <h2 className="text-2xl font-bold text-gray-900">{lang === 'en' ? party.name : party.nameBn}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t.historyTitle}</h3>
                    <ul className="space-y-2">
                      {(lang === 'en' ? party.history : party.historyBn).map((h, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-emerald-500 font-bold">•</span> {h}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t.eventsTitle}</h3>
                    <ul className="space-y-2">
                      {(lang === 'en' ? party.recentEvents : party.recentEventsBn).map((e, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-500 font-bold">→</span> {e}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t.statusTitle}</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <ul className="space-y-2">
                        {(lang === 'en' ? party.currentStatus : party.currentStatusBn).map((s, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-red-500">✕</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t.wingsTitle}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {party.wings.map((wing, wIndex) => (
                        <div key={wIndex} className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <p className="font-bold text-gray-800 text-sm">{lang === 'en' ? wing.name : wing.nameBn}</p>
                          <p className="text-xs text-gray-500">
                            {lang === 'en' ? wing.type : wing.typeBn} 
                            {(lang === 'en' ? wing.note : wing.noteBn) && (
                              <span className="text-red-400 font-medium italic"> ({lang === 'en' ? wing.note : wing.noteBn})</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.comparisonTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 font-bold text-gray-400 uppercase text-xs tracking-wider">{t.party}</th>
                  <th className="py-4 px-4 font-bold text-gray-400 uppercase text-xs tracking-wider">{t.ideology}</th>
                  <th className="py-4 px-4 font-bold text-gray-400 uppercase text-xs tracking-wider">{t.strength}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">BNP</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'Nationalist, Conservative' : 'জাতীয়তাবাদী, রক্ষণশীল'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '🔥 Strong' : '🔥 শক্তিশালী'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">Jamaat</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'Islamist' : 'ইসলামপন্থী'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '⚠️ Growing' : '⚠️ ক্রমবর্ধমান'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">NCP</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'New / Emerging' : 'নতুন / উদীয়মান'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '❓ Uncertain' : '❓ অনিশ্চিত'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">Jatiya Party</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'Centrist' : 'মধ্যপন্থী'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '📉 Weak' : '📉 দুর্বল'}</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">Workers Party</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'Socialist' : 'সমাজতান্ত্রিক'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '📉 Weak' : '📉 দুর্বল'}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">LDP</td>
                  <td className="py-4 px-4 text-gray-600">{lang === 'en' ? 'Small Nationalist' : 'ছোট জাতীয়তাবাদী'}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{lang === 'en' ? '📉 Very Weak' : '📉 খুব দুর্বল'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-emerald-500" size={20} /> {t.wingsWork}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t.wingsWorkContent}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="text-blue-500" size={20} /> {t.streetStrength}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t.streetStrengthContent}
            </p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">{t.legalTitle}</h4>
              <p className="text-blue-50 mt-1 leading-relaxed">
                {t.legalContent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
