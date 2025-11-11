import location from "./location.svg";
import notification from "./notification_big.svg";
import securePayments from "./secure-payments.png";
import skillsMatching from "./skills-matching.png";
import workTracking from "./work-tracking.png";
import companyLogo from "./company-logo.png";
import ftLogo from "./ft_logo.svg";
import defaultProfileImage from "./default_profile_img.jpg";
import attachment from "./attachment_01.png";
import ftLogoWhite from "./ft_logo_white.svg";
import adminCard from "./admin-card-icon.svg";

// JSON format export with category-wise organization
export const assetsConfig = {
  logos: {
    ftLogo,
    companyLogo,
    ftLogoWhite,
  },
  images: {
    profile: {
      defaultProfileImage,
    },
    left_panel_image: {
      securePayments,
      skillsMatching,
      workTracking,
    },
    dashboard: {
      attachment,
    },
  },
  icons: {
    location,
    notification,
    admin: {
      adminCard,
    },
  },
};

