import { BiLogoLinkedin, BiSolidMessageRounded } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { FaBookmark, FaChevronRight, FaFileAlt, FaPhoneAlt, FaRegBookmark, FaRegCheckCircle, FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { FaFileLines, FaLocationDot } from "react-icons/fa6";
import { IoMdAdd, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoClose, IoCloseSharp, IoHeadsetSharp, IoNotificationsSharp, IoUnlinkSharp, IoWalletOutline } from "react-icons/io5";
import { MdContactSupport, MdEmail, MdLock, MdOutlineImageNotSupported, MdOutlineMailOutline } from "react-icons/md";
import { PiWarningOctagonFill } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";
import { IoHeadsetSharp } from "react-icons/io5";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaHourglass } from "react-icons/fa";
 


/**
 * Collection of commonly used icon components mapped to semantic keys for consistent UI usage.
 */
export const icons = {
  bookmark: FaRegBookmark,
  close: IoCloseSharp,
  bookmarkFilled: FaBookmark,
  closeFilled: IoClose,
  user: FaRegUser,
  mail: MdOutlineMailOutline,
  email: MdEmail,
  linkedin: BiLogoLinkedin,
  location: CiLocationOn,
  unlink: IoUnlinkSharp,
  wallet: IoWalletOutline,
  notes: CgNotes,
  locationDot: FaLocationDot,
  checkCircle: FaRegCheckCircle,
  file: FaFileAlt,
  check: IoMdCheckmarkCircleOutline,
  notifications: IoNotificationsSharp,
  fileLines: FaFileLines,
  signOut: FaSignOutAlt,
  contactSupport: MdContactSupport,
  chevronRight: FaChevronRight,
  lock: MdLock,
  // wallet: IoWallet,
  danger: PiWarningOctagonFill,
  phone: FaPhoneAlt,
  headset: IoHeadsetSharp,
  message: BiSolidMessageRounded,
  noImage: MdOutlineImageNotSupported,
  add: IoMdAdd,
  pending: FaHourglass
};
