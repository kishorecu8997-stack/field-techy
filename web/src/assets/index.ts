import securePayments from "./secure-payments.png";
import skillsMatching from "./skills-matching.png";
import workTracking from "./work-tracking.png";
import companyLogo from "./company-logo.png";
import ftLogo from "./ft_logo.svg";
import defaultProfileImage from "./default_profile_img.jpg";
import user from "./user-image/user.png";
import circle_tick from "./circle_tick_icon.svg";


// JSON format export with category-wise organization
export const assetsConfig = {
  logos: {
    ftLogo,
    companyLogo,
    circle_tick,
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
  },
};
