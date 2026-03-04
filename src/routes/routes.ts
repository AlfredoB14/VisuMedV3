// routes.ts
export const ROUTES = {
    // Public
    ROOT: "/",
    AUTH: {
      SIGN_IN: "/signin",
      SIGN_UP: "/signup",
    },
  
    // AppLayout pages
    APP: {
      HOME: "/home",
      PROFILE: "/profile",
      CALENDAR: "/calendar",
      PATIENT_REGISTRY: "/patient-registry",
      CHATBOT: "/chatbot",
  
      BLANK: "/blank",
      SEARCH_PATIENT: "/search-patient",
      NEW_REPORT: "/new-report",
  
      FORMS: {
        ELEMENTS: "/form-elements",
      },
  
      TABLES: {
        BASIC: "/basic-tables",
      },
  
      UI: {
        ALERTS: "/alerts",
        AVATARS: "/avatars",
        BADGE: "/badge",
        BUTTONS: "/buttons",
        IMAGES: "/images",
        VIDEOS: "/videos",
      },
  
      CHARTS: {
        LINE: "/line-chart",
        BAR: "/bar-chart",
      },
    },
  
    NOT_FOUND: "*",
  } as const;