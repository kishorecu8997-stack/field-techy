import { useAppMarkNotificationAsRead, useAppNotifications } from "@/shared/apiServices/notifications/notificationOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import type { NotificationProps } from "@/shared/types/notification";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiCloseLine } from "react-icons/ri";

/**
 * Renders a notification center with categorized views (All, Jobs, Wallet, Unread).
 * Provides tab-based filtering and search functionality.
 * Selecting a notification opens a detailed modal or popup view.
 */
const NotificationList: React.FC = () => {
    const { showPopup, closePopup } = usePopupStore();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("all");
    const [filter, setFilter] = useState(4);
    const { notifications, isLoading } = useAppNotifications();
    const { mutateAsync: markAsReadAsync } = useAppMarkNotificationAsRead();

    const Titles = [
        { id: 0, type: "all", label: "All Notifications" },
        { id: 1, type: "job_offer", label: "Jobs" },
        { id: 2, type: "payment_released", label: "Wallet & Payments" },
        { id: 3, type: "unread", label: "Unread" },
    ];

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
        const filterArr = data.filter(
            (filter: NotificationProps) => filter.type === type,
        );
        return filterArr;
    }

    const filteredNotifications = useMemo(() => {
        if (!notifications) return [];
        return Notificationfilter(tab, notifications, search);
    }, [tab, search, notifications]);

    const ButtonRender = (notifItem: NotificationProps) => {
        return (
            <div className="flex flex-row mt-2 space-x-4">
                {!notifItem.read && (
                    <Button
                        variant="primary"
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (notifItem.id) {
                                await markAsReadAsync({ body: { id: notifItem.id as number } });
                                closePopup();
                            }
                        }}
                    >
                        Mark as Read
                    </Button>
                )}
            </div>
        );
    };

    const notifiypopup = async (notificationItem: NotificationProps) => {
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
                                    <div className="flex justify-center items-center text-2xl size-10 bg-white rounded-full">
                                        {notificationItem.icon}
                                    </div>
                                    <h1 className="font-bold text-md">{notificationItem.title}</h1>
                                </div>
                            </div>
                            <p className="mx-2 mt-2"> {notificationItem.message}</p>
                            <div className="flex justify-end mt-4">
                                {ButtonRender(notificationItem)}
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
                                key={title.id}
                                onClick={() => {
                                    setTab(title.type);
                                    setSearch("");
                                }}
                                className={`px-5 py-2 text-sm font-semibold cursor-pointer rounded-md ${title.type === tab
                                    ? "bg-teal-800 text-white dark:bg-teal-800 dark:text-white"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    }`}
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
                    {isLoading && (
                        <div className="text-center p-4">Loading notifications...</div>
                    )}
                    {!isLoading && filteredNotifications.length === 0 && (
                        <div className="text-center p-4 text-gray-500">
                            No notifications found.
                        </div>
                    )}
                    {filteredNotifications
                        .slice(0, filter)
                        .map((notif: NotificationProps, index: number) => (
                            <div
                                key={index}
                                onClick={() => notifiypopup(notif)}
                                className={`rounded-md p-3 cursor-pointer border transition-colors ${!notif.read
                                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                                    : "bg-gray-100 border-transparent dark:bg-gray-800 dark:border-gray-700"
                                    }`}
                            >
                                <div className="flex flex-row justify-between relative">
                                    <div className="flex flex-col md:flex-row gap-x-4 w-full">
                                        <div className="flex justify-center items-center text-2xl size-10  bg-white rounded-full mb-3 md:mb-0 shrink-0">
                                            {notif.icon}
                                        </div>
                                        <div className="flex flex-col flex-1 w-full">
                                            <h1 className="font-bold text-md pr-4">
                                                {notif.title}
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-300 text-md font-medium">
                                                {notif.message}
                                            </p>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 gap-y-2">
                                                {ButtonRender(notif)}
                                                <div className="text-xs text-gray-500 font-semibold mb-1">
                                                    {notif.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {filteredNotifications.length > 4 && (
                <div
                    className="flex cursor-pointer mt-2 flex-row items-center justify-center gap-x-5 p-2"
                    onClick={() => {
                        filter > 4 ? setFilter(4) : setFilter(filteredNotifications.length);
                    }}
                >
                    <span className="text-gray-400 hover:text-gray-500 font-semibold transition-colors">
                        {filter > 4 ? "Show Less" : "Load Older Notifications"}
                    </span>
                    {filter > 4 ? (
                        <IoIosArrowUp className="text-xl text-gray-400" />
                    ) : (
                        <IoIosArrowDown className="text-xl text-gray-400" />
                    )}
                </div>
            )}
        </>
    );
};

export default NotificationList;
