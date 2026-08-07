import { useState } from "react";
import { Send } from "lucide-react";

export default function InterviewInput({ onSend }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;

    onSend(answer);
    setAnswer("");
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto flex gap-4">

        <textarea
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 bg-slate-800 text-white rounded-xl p-4 resize-none outline-none"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl flex items-center justify-center"
        >
          <Send className="text-white" />
        </button>

      </div>
    </div>
  );
}