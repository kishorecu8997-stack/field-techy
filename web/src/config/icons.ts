import { BiLogoLinkedin, BiSolidMessageRounded } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import {
  FaBookmark,
  FaChevronRight,
  FaFileAlt,
  FaPhoneAlt,
  FaRegBookmark,
  FaRegCheckCircle,
  FaRegUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaFileLines, FaLocationDot } from "react-icons/fa6";
import {
  IoMdAdd,
  IoMdCheckmarkCircleOutline,
  IoMdCheckmark,
} from "react-icons/io";
import {
  IoClose,
  IoCloseSharp,
  IoHeadsetSharp,
  IoKey,
  IoNotificationsSharp,
  IoUnlinkSharp,
  IoWalletOutline,
} from "react-icons/io5";
import {
  MdContactSupport,
  MdEmail,
  MdLock,
  MdOutlineImageNotSupported,
  MdOutlineMailOutline,
  MdOutlineMobileFriendly,
  MdOutlineSecurity,
  MdHistory,
  MdReportProblem,
} from "react-icons/md";
import { PiWarningOctagonFill } from "react-icons/pi";
import { FaHourglass } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import { RiQrScanLine } from "react-icons/ri";
import { AiOutlinePause } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

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
  pending: FaHourglass,
  security: MdOutlineSecurity,
  history: MdHistory,
  codebackup: IoKey,
  totp: RiQrScanLine,
  checkmark: IoMdCheckmark,
  active: FiZap,
  sessions: MdOutlineMobileFriendly,
  hold: AiOutlinePause,
  flagged: MdReportProblem,
  cancel: MdCancel,
};
