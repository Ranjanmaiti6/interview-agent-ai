import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CornerDownLeft,
  Mic,
  Sparkles,
} from "lucide-react";

export default function InterviewInput({ onSend }) {
  const [answer, setAnswer] = useState("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef(null);

  const trimmedAnswer = answer.trim();
  const canSend =
    trimmedAnswer.length > 0 && !isSending;

  const handleSubmit = async () => {
    if (!canSend) return;

    try {
      setIsSending(true);

      await Promise.resolve(
        onSend(trimmedAnswer)
      );

      setAnswer("");
    } finally {
      setIsSending(false);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    const nextHeight = Math.min(
      textarea.scrollHeight,
      180
    );

    textarea.style.height = `${nextHeight}px`;
  }, [answer]);

  return (
    <div className="sticky bottom-0 z-30 border-t border-white/[0.07] bg-[#080b10]/90 px-3 py-3 backdrop-blur-2xl sm:px-5 sm:py-4">
      {/* Ambient input glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-24
          bg-gradient-to-t
          from-blue-500/[0.035]
          to-transparent
        "
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Input shell */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-white/[0.09]
            bg-[#0c1118]/95
            shadow-[0_20px_60px_rgba(0,0,0,0.28)]
            transition-all duration-300
            focus-within:border-blue-400/25
            focus-within:shadow-[0_20px_70px_rgba(37,99,235,0.10)]
          "
        >
          {/* Top information row */}
          <div className="flex items-center justify-between border-b border-white/[0.055] px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-2">
              <Sparkles
                size={13}
                strokeWidth={1.6}
                className="text-blue-400/80"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Your response
              </span>
            </div>

            <span
              className={`
                font-mono text-[9px]
                transition-colors duration-300
                ${
                  answer.length > 1800
                    ? "text-amber-400"
                    : "text-white/20"
                }
              `}
            >
              {answer.length} / 2000
            </span>
          </div>

          {/* Text input area */}
          <div className="flex items-end gap-3 px-4 py-3 sm:px-5 sm:py-4">
            <textarea
              ref={textareaRef}
              rows={1}
              maxLength={2000}
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Explain your answer..."
              disabled={isSending}
              className="
                min-h-[48px]
                max-h-[180px]
                flex-1
                resize-none
                overflow-y-auto
                bg-transparent
                py-2
                text-sm
                leading-7
                text-white
                outline-none
                placeholder:text-white/25
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-[15px]
              "
              aria-label="Interview answer"
            />

            {/* Optional voice affordance */}
            <button
              type="button"
              disabled
              className="
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.025]
                text-white/20
                sm:flex
              "
              aria-label="Voice input unavailable"
              title="Voice input"
            >
              <Mic size={17} />
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              className={`
                group
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                transition-all
                duration-300
                ${
                  canSend
                    ? "border-blue-400/25 bg-blue-500 text-white shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)]"
                    : "cursor-not-allowed border-white/[0.06] bg-white/[0.025] text-white/20"
                }
              `}
              aria-label="Send answer"
            >
              {isSending ? (
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />
              ) : (
                <ArrowUp
                  size={18}
                  strokeWidth={2}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-y-0.5
                  "
                />
              )}

              {canSend && (
                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    -translate-x-full
                    bg-white/10
                    skew-x-[-20deg]
                    transition-transform
                    duration-500
                    group-hover:translate-x-full
                  "
                />
              )}
            </button>
          </div>

          {/* Bottom keyboard hint */}
          <div className="flex items-center justify-between border-t border-white/[0.045] px-4 py-2 sm:px-5">
            <p className="text-[9px] text-white/20">
              Be specific and explain your reasoning.
            </p>

            <div className="hidden items-center gap-2 text-[9px] text-white/20 sm:flex">
              <span className="flex items-center gap-1">
                <CornerDownLeft size={10} />
                Send
              </span>

              <span className="text-white/10">
                /
              </span>

              <span>
                Shift + Enter for new line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}