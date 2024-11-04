import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);

        // Check if the response is ok
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch messages');
        }

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;


//Backup

// import { useEffect, useState } from "react"
// import useConversation from "../zustand/useConversation"
// import toast from "react-hot-toast"

// const useGetMessages = () => {
//   const [loading, setLoading] = useState(false)
//   const {messages, setMessages,selectedConversation} = useConversation()

//   useEffect(() => {
//     const getMessages = async () => {
//         setLoading(true)
//         try {
//             const res = await fetch (`/api/messages/${selectedConversation._id}`);
//             const data = await res.json();
//             if(data.error) throw new Error(data.error)
//             setMessages(data)
//         } catch (error) {
//             toast.error(error.message)
//         } finally{
//             setLoading(false)
//         }
//     }

//     if(selectedConversation?._id) getMessages();

//   }, [selectedConversation?._id, setMessages])

//   return {messages , loading}
// }

// export default useGetMessages;


