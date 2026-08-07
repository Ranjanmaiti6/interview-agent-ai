import { Bot, User } from "lucide-react";

export default function ChatMessage({ role, text }) {
  const isAI = role === "ai";

  return (
    <div
      className={`flex ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl p-5 flex gap-4 ${
          isAI
            ? "bg-slate-900 text-white"
            : "bg-blue-600 text-white"
        }`}
      >
        <div className="mt-1">
          {isAI ? (
            <Bot size={22} />
          ) : (
            <User size={22} />
          )}
        </div>

        <p className="leading-7 whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}