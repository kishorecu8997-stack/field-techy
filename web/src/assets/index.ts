import securePayments from "./secure-payments.png";
import skillsMatching from "./skills-matching.png";
import workTracking from "./work-tracking.png";
import companyLogo from "./company-logo.png";
import ftLogo from "./ft_logo.svg";
import defaultProfileImage from "./default_profile_img.jpg";
import suitcase from "./suitcase.svg";
import people from "./people.svg";
import location from "./location.svg";
import notification from "./notification_big.svg";
import ftLogoWhite from "./ft_logo_white.svg";
import adminCard from "./admin-card-icon.svg";
import user from "./user-image/user.png";
import circle_tick from "./circle_tick_icon.svg";

// JSON format export with category-wise organization
export const assetsConfig = {
  logos: {
    ftLogo,
    companyLogo,
    circle_tick,
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
    users: {
      user,
    },
    admin: {
      adminCard,
    },
  },
  icons: {
    suitcase,
    people,
    location,
    notification
  },
};
