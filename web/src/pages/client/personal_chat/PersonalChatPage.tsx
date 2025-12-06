import PersonalChatPanel from './PersonalChatPanel';

/**
 * PersonalChatPage component displays a list of chat participants and a message input area.
 *
 * @returns {JSX.Element} The PersonalChatPage component.  
 */
function PersonalChatPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <PersonalChatPanel />
    </div>
  );
}

export default PersonalChatPage;