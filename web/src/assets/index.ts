import securePayments from "./secure-payments.png";
import skillsMatching from "./skills-matching.png";
import workTracking from "./work-tracking.png";
import companyLogo from "./company-logo.png";
import ftLogo from "./ft_logo.svg";
import defaultProfileImage from "./default_profile_img.jpg";
import ftLogoWhite from "./ft_logo_white.svg";
import placeholderImage from "./placeholder_img.svg";

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
  },
  placeholder: placeholderImage,
};
