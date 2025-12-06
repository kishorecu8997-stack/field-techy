import GroupChatPanel from "./GroupChatPanel";

/**
 * GroupChatPage component displays a chat interface for a group.
 * It includes a list of chat participants and a message input.
 *
 * @returns {JSX.Element} The GroupChatPage component.
 */
function GroupChatPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <GroupChatPanel />
    </div>
  );
}

export default GroupChatPage;