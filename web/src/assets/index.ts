import location from "./location.svg";
import notification from "./notification_big.svg";
import securePayments from "./secure-payments.png";
import skillsMatching from "./skills-matching.png";
import workTracking from "./work-tracking.png";
import companyLogo from "./company-logo.png";
import ftLogo from "./ft_logo.svg";
import defaultProfileImage from "./default_profile_img.jpg";
import attachment from "./attachment_01.png";
import suitcase from "./suitcase.svg";
import people from "./people.svg";
import ftLogoWhite from "./ft_logo_white.svg";
import placeholderImage from "./placeholder_img.svg";
import adminCard from "./admin-card-icon.svg";
import user from "./user-image/user.png";
import circle_tick from "./circle_tick_icon.svg";
import ft_landing from "./ft-landing/ft_landing_banner.png";
import job_assignment from "./ft-landing/job_assignment.png";
import delivery_time from "./ft-landing/delivery_time.png";
import real_time_visibility from "./ft-landing/visibility.png";
import for_engineers from "./ft-landing/for_engineer.png";
import for_corporates from "./ft-landing/for_corporates.png";
import for_home_customers from "./ft-landing/for_home_end_customers.png";
import engineer from "./ft-landing/engineer.svg";
import corporates from "./ft-landing/corporate.svg";
import home_customers from "./ft-landing/home_end.svg";
import work_flow from "./ft-landing/work_flow.png";

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
    dashboard: {
      attachment,
    },
    admin: {
      adminCard,
    },
  },
  placeholder: placeholderImage,
  icons: {
    suitcase,
    people,
    location,
    notification,
  },
  admin: {
    adminCard,
  },
  landing: {
    ft_landing_banner: ft_landing,
    job_platform: {
      job_assignment: job_assignment,
      delivery_time: delivery_time,
      real_time_visibility: real_time_visibility,
      for_engineers: for_engineers,
      for_corporates: for_corporates,
      for_home_customers: for_home_customers,
      work_flow: work_flow,
    },
    icons: {
      engineer,
      corporates,
      home_customers,
    },
  },
};
