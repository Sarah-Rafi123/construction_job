"use client";
import socket from "@/lib/socket/connectSocket";
import type React from "react";
import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { Paperclip, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { addMessage, updateConversationInInbox } from "@/store/slices/chatSlice";
import { Message, Chat } from "@/types/chatTypes";

const ChatInputForm = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { activeConversation } = useSelector((state: RootState) => state.chat);
  const user = activeConversation?.participants.find((u) => u._id !== currentUser?.id);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit(
      "sendMessage",
      {
        recipientId: user?._id,
        content: newMessage,
        type: "text",
      },
      ({ data, error }: { data?: { message: Message; conversation: Chat }; error?: string }) => {
        if (!error && data) {
          // console.log("message sent", data);
          dispatch(addMessage(data.message));
          dispatch(updateConversationInInbox(data.conversation));
        } else {
          console.error("Message send failed:", error);
        }
      }
    );

    setNewMessage("");
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        {/* <IconButton color="default" aria-label="attach file">
          <Paperclip size={20} />
        </IconButton> */}
        <TextField
          fullWidth
          placeholder="Reply..."
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        />
        <IconButton color="primary" aria-label="send message" type="submit" disabled={!newMessage.trim()}>
          <Send size={20} />
        </IconButton>
      </form>
    </div>
  );
};

export default ChatInputForm;
