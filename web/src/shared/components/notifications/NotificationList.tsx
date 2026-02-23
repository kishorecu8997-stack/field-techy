import { useAppMarkNotificationAsRead, useAppMarkAllNotificationsAsRead, useAppDeleteNotification, useAppNotifications } from "@/shared/apiServices/notifications/notificationOpenApiService";
import { groupNotificationsByDate } from "@/shared/apiServices/notifications/notificationAdapter";
import { Button } from "@/shared/components/commonUI/Buttons";
import { usePopupStore } from "@/shared/store/popupStore";
import type { NotificationProps } from "@/shared/types/notification";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiCloseLine, RiDeleteBin6Line } from "react-icons/ri";

/**
 * Renders a notification center with categorized views (All, Jobs, Wallet, Unread).
 * Provides tab-based filtering, search functionality, and date-based grouping.
 * Selecting a notification opens a detailed modal or popup view.
 */
const NotificationList: React.FC = () => {
    const { showPopup, closePopup } = usePopupStore();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("all");
    const [showAll, setShowAll] = useState(false);
    const { notifications, isLoading } = useAppNotifications();
    const { mutateAsync: markAsReadAsync } = useAppMarkNotificationAsRead();
    const { mutateAsync: markAllAsReadAsync } = useAppMarkAllNotificationsAsRead();
    const { mutateAsync: deleteNotifAsync } = useAppDeleteNotification();

    const INITIAL_LIMIT = 5;

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
            return data.filter((item) =>
                item.title.toLowerCase().includes(name.toLowerCase()),
            );
        }
        if (type === "all") return data;
        if (type === "unread") return data.filter((item) => item.read === false);
        return data.filter((item) => item.type === type);
    }

    const filteredNotifications = useMemo(() => {
        if (!notifications) return [];
        return Notificationfilter(tab, notifications, search);
    }, [tab, search, notifications]);

    // Build grouped structure from the full filtered list, then slice per group for the "collapsed" view
    const grouped = useMemo(
        () => groupNotificationsByDate(filteredNotifications),
        [filteredNotifications],
    );

    // Total count across all groups (used for the load-more toggle)
    const totalCount = filteredNotifications.length;

    // Whether any visible notification is unread (controls Mark All as Read visibility)
    const hasUnread = filteredNotifications.some((n) => !n.read);

    const handleDelete = async (e: React.MouseEvent, notif: NotificationProps) => {
        e.stopPropagation();
        await showPopup({
            title: "Delete Notification",
            body: (
                <div className="px-2 py-1">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete this notification?
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">"{notif.title}"</p>
                </div>
            ),
            actionButtons: [
                {
                    label: "Cancel",
                    value: "cancel",
                    variant: "secondary",
                    action: () => closePopup(),
                },
                {
                    label: "Delete",
                    value: "delete",
                    action: async () => {
                        await deleteNotifAsync({ body: { id: notif.id as number } });
                        closePopup(true)
                    },
                    variant: "danger",
                },
            ],
        });
    };

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
            ),
            actionButtons: [],
        });
    };

    const renderNotifCard = (notif: NotificationProps, index: number) => (
        <div
            key={notif.id ?? index}
            onClick={() => notifiypopup(notif)}
            className={`rounded-md p-3 cursor-pointer border transition-colors relative ${!notif.read
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : "bg-gray-100 border-transparent dark:bg-gray-800 dark:border-gray-700"
                }`}
        >
            {/* Delete icon — top-right */}
            <div
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                title="Delete notification"
                onClick={(e) => handleDelete(e, notif)}
            >
                <RiDeleteBin6Line className="text-lg" />
            </div>

            <div className="flex flex-col md:flex-row gap-x-4 w-full">
                <div className="flex justify-center items-center text-2xl size-10 bg-white rounded-full mb-3 md:mb-0 shrink-0">
                    {notif.icon}
                </div>
                <div className="flex flex-col flex-1 w-full pr-8">
                    <h1 className="font-bold text-md">{notif.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-md font-medium">
                        {notif.message}
                    </p>
                    {!notif.read && (
                        <div className="mt-2">
                            {ButtonRender(notif)}
                        </div>
                    )}
                    {/* Timestamp — bottom-right */}
                    <div className="flex justify-end mt-2">
                        <span className="text-xs text-gray-500 font-semibold">{notif.timestamp}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Date group label ordering
    const groupOrder = ["Today", "Yesterday", "Earlier"];

    return (
        <>
            <div className="flex flex-col h-full space-y-3 px-3 pt-5 py-3 bg-white rounded-lg dark:bg-gray-700">
                <div>
                    <h1 className="text-xl font-bold">Notifications</h1>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        Stay up to date about all activities
                    </p>
                </div>
                {/* Row 1: Filter tabs */}
                <div className="flex flex-wrap gap-2">
                    {Titles.map((title) => (
                        <div
                            key={title.id}
                            onClick={() => {
                                setTab(title.type);
                                setSearch("");
                                setShowAll(false);
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

                {/* Row 2: Mark all as read + Search — stacks on small, side-by-side on sm+ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                    {hasUnread && (
                        <button
                            onClick={async () => await markAllAsReadAsync({})}
                            className="text-sm font-semibold text-teal-800 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-auto"
                        >
                            Mark all as read
                        </button>
                    )}
                    <div className="flex flex-row items-center border border-gray-400 rounded-sm py-1 px-4 w-full sm:w-64">
                        <CiSearch className="text-2xl text-gray-500 shrink-0" />
                        <input
                            value={search}
                            className="outline-none border-none ml-2 w-full bg-transparent"
                            placeholder="Search keyword"
                            name="search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-y-6">
                    {isLoading && (
                        <div className="text-center p-4">Loading notifications...</div>
                    )}
                    {!isLoading && totalCount === 0 && (
                        <div className="text-center p-4 text-gray-500">
                            No notifications found.
                        </div>
                    )}

                    {!isLoading &&
                        totalCount > 0 &&
                        (() => {
                            // When collapsed, we limit the total rendered across all groups to INITIAL_LIMIT
                            let remaining = showAll ? Infinity : INITIAL_LIMIT;

                            return groupOrder.map((dateGroup) => {
                                const notifs = grouped[dateGroup] ?? [];
                                const visible = notifs.slice(0, remaining);
                                remaining = Math.max(0, remaining - visible.length);

                                if (visible.length === 0) return null;

                                return (
                                    <div key={dateGroup} className="flex flex-col gap-y-3">
                                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-400">
                                            {dateGroup}
                                        </h2>
                                        {visible.map((notif, index) =>
                                            renderNotifCard(notif, index),
                                        )}
                                    </div>
                                );
                            });
                        })()}
                </div>
            </div>

            {totalCount > INITIAL_LIMIT && (
                <div
                    className="flex cursor-pointer mt-2 flex-row items-center justify-center gap-x-5 p-2"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    <span className="text-gray-400 hover:text-gray-500 font-semibold transition-colors">
                        {showAll ? "Show Less" : "Load Older Notifications"}
                    </span>
                    {showAll ? (
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
