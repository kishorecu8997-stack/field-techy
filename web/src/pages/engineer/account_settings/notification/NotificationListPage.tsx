import { mockNotifications } from "@/dummy_data/notificationData";
import { Button } from "@/shared/components/commonUI/Buttons";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineInsertInvitation } from "react-icons/md";
import { MdWorkHistory } from "react-icons/md";
import { BsFillPencilFill } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import { RiBankFill, RiCloseLine } from "react-icons/ri";
import { PiNotepadLight } from "react-icons/pi";
import { BsFillMenuAppFill } from "react-icons/bs";
import { BsPostcard } from "react-icons/bs";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { usePopupStore } from "@/shared/store/popupStore";
import type { NotificationProps } from "../types";
import { absoluteUrls } from "@/config/urls";
import { useNavigate } from "react-router-dom";

/**
 * Renders a notification center with categorized views (All, Jobs, Wallet, Unread).
 * Provides tab-based filtering and search functionality.
 * Selecting a notification opens a detailed modal or popup view.
 */
const NotificationListPage = () => {
  const navigate = useNavigate();
  const { showPopup, closePopup } = usePopupStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [filter, setFilter] = useState(4);
  const [notification, setNotification] = useState<NotificationProps[]>([]);
  const Titles = [
    { id: 0, type: "all", label: "All Notifications" },
    { id: 1, type: "job_offer", label: "Jobs" },
    { id: 2, type: "payment_released", label: "Wallet & Payments" },
    { id: 3, type: "unread", label: "Unread" },
  ];

  useEffect(() => {
    setNotification(Notificationfilter(tab, mockNotifications, search));
  }, [tab, search]);

  const ButtonRender = (type: string) => {
    const btnname = (type: string) => {
      switch (type) {
        case "job_offer":
          return "View Job";
        case "invitation":
          return "View Invitation";
        case "revision":
          return "View Revision";
        case "payment_released":
          return "Go to Wallet";
        case "proposal_received":
          return "View Proposal";
        case "application_viewed":
          return "View Application";
        case "view":
          return "View";
        case "withdrawal":
          return "Go to Wallet";
        default:
          return null;
      }
    };
    const pathname = (type: string) => {
      switch (type) {
        case "job_offer":
          return absoluteUrls.engineer.home.my_jobs;
        case "invitation":
          return absoluteUrls.engineer.home.my_jobs;
        case "revision":
          return absoluteUrls.engineer.home.my_jobs;
        case "payment_released":
          return absoluteUrls.engineer.home.my_jobs;
        case "proposal_received":
          return absoluteUrls.engineer.home.my_jobs;
        case "application_viewed":
          return absoluteUrls.engineer.home.my_jobs;
        case "view":
          return absoluteUrls.engineer.home.my_jobs;
        case "withdrawal":
          return absoluteUrls.engineer.home.explore_jobs;
        default:
          return null;
      }
    };

    const handleclick = () => {
      const targetpath =
        pathname(type) ?? absoluteUrls.engineer.home.notifications;
      (navigate(targetpath), scrollTo(0, 0), closePopup());
    };

    return (
      <div className="flex flex-row mt-2 space-x-4">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleclick();
          }}
          className=" bg-teal-800"
        >
          {btnname(type)}
        </Button>
        <Button variant="primary">Mark as Read</Button>
      </div>
    );
  };

  const IconRender = (type: string) => {
    switch (type) {
      case "job_offer":
        return <MdWorkHistory />;
      case "invitation":
        return <MdOutlineInsertInvitation />;
      case "revision":
        return <BsFillPencilFill />;
      case "payment_released":
        return <TbMoneybag />;
      case "proposal_received":
        return <PiNotepadLight />;
      case "application_viewed":
        return <BsFillMenuAppFill />;
      case "view":
        return <BsPostcard />;
      case "withdrawal":
        return <RiBankFill />;
      default:
        return null;
    }
  };

  function Notificationfilter(
    type: string,
    data: NotificationProps[],
    name: string,
  ) {
    if (name.length > 0) {
      const searchfilter = data.filter((filter: NotificationProps) =>
        filter.title.toLowerCase().includes(name.toLowerCase()),
      );
      return searchfilter;
    }
    if (type === "all") {
      return data;
    } else if (type === "unread") {
      const unread = data.filter(
        (filter: NotificationProps) => filter.read === false,
      );
      return unread;
    }
    const filter = data.filter(
      (filter: NotificationProps) => filter.type === type,
    );
    return filter;
  }

  const notifiypopup = async (notifications: NotificationProps) => {
    await showPopup({
      title: "",
      body: (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col px-3 py-2 ">
              <div className="flex justify-end text-3xl cursor-pointer">
                <RiCloseLine onClick={closePopup} />
              </div>
              <div className="flex flex-row justify-between items-center gap-x-3">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center text-2xl size-10 text-white bg-teal-800 rounded-full">
                    {IconRender(`${notifications.type}`)}
                  </div>
                  <h1 className="font-bold text-md">{notifications.title}</h1>
                </div>
              </div>
              <p className="mx-2 mt-2"> {notifications.message}</p>
              <div className="flex justify-end mt-4">
                {ButtonRender(notifications.type)}
              </div>
            </div>
          </div>
        </>
      ),
      actionButtons: [],
    });
  };

  return (
    <>
      <div className="flex flex-col h-full space-y-3 px-3 pt-5 py-3 bg-white rounded-lg dark:bg-gray-700">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          <p className="font-semibold text-gray-600 dark:text-gray-300">
            Stay up to date about all activities
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="flex flex-wrap space-x-4">
            {Titles.map((title) => (
              <div
                onClick={() => {
                  setTab(title.type);
                  setSearch("");
                }}
                className={`px-5 py-2 text-sm font-semibold cursor-pointer
    rounded-md dark:bg-gray-800  ${
      title.type === tab
        ? "bg-teal-800 text-white dark:bg-teal-800 dark:text-white"
        : ""
    } `}
              >
                {title.label}
              </div>
            ))}
          </div>
          <div className="flex items-center flex-row gap-x-5 dark:bg-gray-800">
            <div className="hidden lg:font-semibold text-teal-800">
              Mark all as read
            </div>
            <div className="flex flex-row border w-full border-gray-500 rounded-sm mt-4 lg:mt-0 py-1 px-4">
              <CiSearch className="text-2xl text-gray-500" />
              <input
                value={search}
                className="outline-none border-none ml-2"
                placeholder="Search keyword"
                name="search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          {notification
            .slice(0, filter)
            .map((notifications: NotificationProps) => (
              <div
                onClick={() => notifiypopup(notifications)}
                className="bg-gray-100 rounded-md p-3 cursor-pointer dark:bg-gray-800"
              >
                <div className="flex flex-row justify-between dark:bg-gray-800">
                  <div className="flex flex-col md:flex-row gap-x-4">
                    <div className="flex justify-center items-center text-2xl size-10 text-white bg-teal-800 rounded-full mb-3 md:mb-0">
                      {IconRender(`${notifications.type}`)}
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-bold text-md">
                        {notifications.title}
                      </h1>
                      <p className="text-gray-400 text-md font-medium">
                        {notifications.message}
                      </p>
                      {ButtonRender(notifications.type)}
                    </div>
                  </div>
                  <div className="justify-self-end text-sm text-gray-500">
                    {notifications.timestamp}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div
        className="flex cursor-pointer mt-2 flex-row items-center justify-center gap-x-5"
        onClick={() => {
          (filter > 4 ? setFilter(4) : setFilter(mockNotifications.length),
            scrollTo(0, 0));
        }}
      >
        <span className="text-gray-400 font-semibold">
          Load Older Notifications
        </span>
        <IoIosArrowDown className="text-xl" />
      </div>
    </>
  );
};

export default NotificationListPage;
