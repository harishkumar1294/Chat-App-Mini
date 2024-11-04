const sendMessage = async (message) => {
    setLoading(true);
    console.log("Message Content:", message);
    console.log("Selected Conversation:", selectedConversation);

    if (!selectedConversation || !selectedConversation._id) {
        toast.error("No conversation selected.");
        setLoading(false);
        return;
    }
    if (!message) {
        toast.error("Message content is empty.");
        setLoading(false);
        return;
    }

    try {
        const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages([...messages, data]);
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};


//Backup

// import { useState } from "react"
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
  
//     const [loading, setLoading] = useState(false);
//     const {messages, setMessages, selectedConversation} = useConversation();

//     const sendMessage = async (message) => {
//         setLoading(true)
//         try {
//             const res = await fetch(`/api/messages/send/${selectedConversation._id}` ,{
//                 method: 'POST',
//                 headers:{
//                     'Content-Type' : 'application/json'
//                 },
//                 body: JSON.stringify({message})
//             })
//             const data = await res.json()
//             if(data.error) throw new Error(data.error)

//             setMessages([...messages,data])
//         } catch (error) {
//             toast.error(error.message);
//         } finally{
//             setLoading(false)
//         }
//     }

//     return {sendMessage, loading}
// }

// export default useSendMessage


