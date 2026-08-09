export type Lang = "en" | "ne";

export interface Copy {
  brand: string;
  navList: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroFeatureOne: string;
  heroFeatureTwo: string;

  requestEyebrow: string;
  requestTitle: string;
  requestDescription: string;
  benefitLocation: string;
  benefitContact: string;

  tabFind: string;
  tabList: string;

  fieldListingType: string;
  optBuy: string;
  optRent: string;
  optSell: string;
  optRentOut: string;

  fieldPropertyType: string;
  optSelectPropertyType: string;
  optHouse: string;
  optLand: string;
  optApartment: string;
  optCommercial: string;

  fieldLocation: string;
  placeholderLocation: string;

  fieldPrice: string;
  placeholderPrice: string;

  fieldBedrooms: string;
  optNotSpecified: string;
  opt1Bed: string;
  opt2Bed: string;
  opt3Bed: string;
  opt4Bed: string;

  fieldArea: string;
  placeholderArea: string;

  fieldDescription: string;
  placeholderDescription: string;

  fieldName: string;
  placeholderName: string;

  fieldNumber: string;
  placeholderNumber: string;

  submit: string;
  submitting: string;
  statusSuccess: string;
  statusError: string;
  statusValidation: string;

  listingsEyebrow: string;
  listingsTitle: string;
  listingCountOne: string;
  listingCountMany: (n: number) => string;
  listingCountLoading: string;
  listingCountUnavailable: string;
  emptyState: string;

  cardBudget: string;
  cardArea: string;
  cardBedrooms: string;
  cardContact: string;

  footerText: string;
  footerNote: string;
}

export const translations: Record<Lang, Copy> = {
  en: {
    brand: "GharBari",
    navList: "List a property",
    heroKicker: "Real estate, made neighborly",
    heroTitle: "Find the place that feels like home.",
    heroDescription:
      "Share what you're looking for—or tell people about a property you have available. A simple way to connect buyers, renters, and owners.",
    heroFeatureOne: "Buy & rent requests",
    heroFeatureTwo: "House & land listings",

    requestEyebrow: "Start here",
    requestTitle: "Tell us what you need.",
    requestDescription:
      "Whether you're searching for a family home, rental, or a plot of land, share the details that matter most.",
    benefitLocation:
      "Add your preferred location so the right people can find your request.",
    benefitContact:
      "Include a phone number so interested buyers, renters, or owners can reach you directly.",

    tabFind: "Find a property",
    tabList: "List a property",

    fieldListingType: "I want to",
    optBuy: "Buy a property",
    optRent: "Rent a property",
    optSell: "Sell a property",
    optRentOut: "Rent out a property",

    fieldPropertyType: "Property type",
    optSelectPropertyType: "Select property type",
    optHouse: "House",
    optLand: "Land",
    optApartment: "Apartment",
    optCommercial: "Commercial space",

    fieldLocation: "Location",
    placeholderLocation: "e.g. Lalitpur, Kathmandu",

    fieldPrice: "Budget / asking price",
    placeholderPrice: "e.g. NPR 2–3 crore",

    fieldBedrooms: "Bedrooms",
    optNotSpecified: "Not specified",
    opt1Bed: "1 bedroom",
    opt2Bed: "2 bedrooms",
    opt3Bed: "3 bedrooms",
    opt4Bed: "4+ bedrooms",

    fieldArea: "Area",
    placeholderArea: "e.g. 1,200 sq ft / 5 aana",

    fieldDescription: "Property details",
    placeholderDescription:
      "Share important details, preferred neighborhood, road access, facilities, and more.",

    fieldName: "Your name",
    placeholderName: "Your full name",

    fieldNumber: "Contact number",
    placeholderNumber: "Your phone number",

    submit: "Share request",
    submitting: "Sharing…",
    statusSuccess: "Your property request has been shared successfully.",
    statusError: "We couldn't save your request. Please check your details and try again.",
    statusValidation: "Please fill in every required field.",

    listingsEyebrow: "Community board",
    listingsTitle: "Recently shared requests",
    listingCountOne: "1 listing shared",
    listingCountMany: (n: number) => `${n} listings shared`,
    listingCountLoading: "Loading listings…",
    listingCountUnavailable: "Listings unavailable",
    emptyState:
      "No requests have been shared yet. Be the first to tell the community what you're looking for or what property you have available.",

    cardBudget: "Budget / price",
    cardArea: "Area",
    cardBedrooms: "Bedrooms",
    cardContact: "Contact",

    footerText: "GharBari · A simpler way to connect around property.",
    footerNote: "Please verify property details before making decisions.",
  },
  ne: {
    brand: "घरबारी",
    navList: "सम्पत्ति सूचीकरण गर्नुहोस्",
    heroKicker: "घर जग्गा, अझ सजिलो",
    heroTitle: "आफ्नो मनपर्ने घर फेला पार्नुहोस्।",
    heroDescription:
      "तपाईंलाई के चाहिन्छ भन्नुहोस्—वा उपलब्ध सम्पत्तिको बारेमा जानकारी दिनुहोस्। खरिददार, भाडावाला र मालिकहरूलाई जोड्ने सजिलो तरिका।",
    heroFeatureOne: "किन्ने र भाडामा लिने अनुरोध",
    heroFeatureTwo: "घर र जग्गा सूची",

    requestEyebrow: "यहाँबाट सुरु गर्नुहोस्",
    requestTitle: "तपाईंलाई के चाहिन्छ भन्नुहोस्।",
    requestDescription:
      "पारिवारिक घर, भाडाको घर, वा जग्गा खोज्दै हुनुहुन्छ भने, महत्त्वपूर्ण विवरणहरू साझा गर्नुहोस्।",
    benefitLocation:
      "तपाईंको मनपर्ने स्थान थप्नुहोस् ताकि सही व्यक्तिले तपाईंको अनुरोध भेट्टाउन सकून्।",
    benefitContact:
      "फोन नम्बर राख्नुहोस् ताकि इच्छुक खरिददार, भाडावाला वा मालिकले सिधै सम्पर्क गर्न सकून्।",

    tabFind: "सम्पत्ति खोज्नुहोस्",
    tabList: "सम्पत्ति सूचीकरण",

    fieldListingType: "म चाहन्छु",
    optBuy: "सम्पत्ति किन्ने",
    optRent: "सम्पत्ति भाडामा लिने",
    optSell: "सम्पत्ति बेच्ने",
    optRentOut: "सम्पत्ति भाडामा दिने",

    fieldPropertyType: "सम्पत्तिको प्रकार",
    optSelectPropertyType: "सम्पत्तिको प्रकार छान्नुहोस्",
    optHouse: "घर",
    optLand: "जग्गा",
    optApartment: "अपार्टमेन्ट",
    optCommercial: "व्यावसायिक स्थान",

    fieldLocation: "स्थान",
    placeholderLocation: "उदाहरण: ललितपुर, काठमाडौं",

    fieldPrice: "बजेट / माग गरेको मूल्य",
    placeholderPrice: "उदाहरण: रु. २–३ करोड",

    fieldBedrooms: "कोठा संख्या",
    optNotSpecified: "उल्लेख नगरिएको",
    opt1Bed: "१ कोठा",
    opt2Bed: "२ कोठा",
    opt3Bed: "३ कोठा",
    opt4Bed: "४+ कोठा",

    fieldArea: "क्षेत्रफल",
    placeholderArea: "उदाहरण: १,२०० वर्ग फिट / ५ आना",

    fieldDescription: "सम्पत्तिको विवरण",
    placeholderDescription:
      "महत्त्वपूर्ण विवरण, मनपर्ने क्षेत्र, बाटो पहुँच, सुविधाहरू आदि साझा गर्नुहोस्।",

    fieldName: "तपाईंको नाम",
    placeholderName: "पूरा नाम",

    fieldNumber: "सम्पर्क नम्बर",
    placeholderNumber: "फोन नम्बर",

    submit: "अनुरोध पठाउनुहोस्",
    submitting: "पठाउँदै…",
    statusSuccess: "तपाईंको सम्पत्ति अनुरोध सफलतापूर्वक साझा गरियो।",
    statusError: "अनुरोध सुरक्षित गर्न सकिएन। कृपया विवरण जाँचेर पुनः प्रयास गर्नुहोस्।",
    statusValidation: "कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।",

    listingsEyebrow: "सामुदायिक बोर्ड",
    listingsTitle: "भर्खरै साझा गरिएका अनुरोधहरू",
    listingCountOne: "१ सूची साझा गरियो",
    listingCountMany: (n: number) => `${n} सूचीहरू साझा गरियो`,
    listingCountLoading: "सूचीहरू लोड हुँदैछ…",
    listingCountUnavailable: "सूचीहरू उपलब्ध छैनन्",
    emptyState:
      "अहिलेसम्म कुनै अनुरोध साझा गरिएको छैन। तपाईं के खोज्दै हुनुहुन्छ वा कुन सम्पत्ति उपलब्ध छ भनी सामुदायलाई सबैभन्दा पहिले बताउनुहोस्।",

    cardBudget: "बजेट / मूल्य",
    cardArea: "क्षेत्रफल",
    cardBedrooms: "कोठा",
    cardContact: "सम्पर्क",

    footerText: "घरबारी · सम्पत्तिको वरिपरि जोडिने सजिलो तरिका।",
    footerNote: "निर्णय गर्नुअघि कृपया सम्पत्तिको विवरण पुष्टि गर्नुहोस्।",
  },
};

export type TranslationKey = keyof Copy;
