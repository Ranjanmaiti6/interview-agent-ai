import {
  Bot,
  User,
  Sparkles,
} from "lucide-react";

export default function ChatMessage({
  role,
  text,
}) {
  const isAI = role === "ai";

  return (
    <div
      className={`
        group flex w-full
        ${isAI ? "justify-start" : "justify-end"}
      `}
    >
      <div
        className={`
          relative flex max-w-[88%] items-start gap-3
          sm:max-w-[78%]
          lg:max-w-[72%]
          ${isAI ? "flex-row" : "flex-row-reverse"}
        `}
      >
        {/* ========================================= */}
        {/* Avatar */}
        {/* ========================================= */}

        <div
          className={`
            relative mt-1
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-xl
            border
            transition-all duration-300
            ${
              isAI
                ? "border-blue-400/15 bg-blue-500/[0.08] text-blue-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/[0.12]"
                : "border-white/[0.10] bg-white/[0.055] text-white/65 group-hover:border-white/[0.16] group-hover:text-white"
            }
          `}
        >
          {isAI ? (
            <>
              <Bot
                size={18}
                strokeWidth={1.5}
              />

              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400
                  shadow-[0_0_10px_rgba(96,165,250,0.8)]
                "
              />
            </>
          ) : (
            <User
              size={18}
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* ========================================= */}
        {/* Message */}
        {/* ========================================= */}

        <div
          className={`
            relative min-w-0
            rounded-2xl
            border
            px-4 py-3.5
            shadow-[0_12px_35px_rgba(0,0,0,0.12)]
            transition-all duration-300
            sm:px-5 sm:py-4
            ${
              isAI
                ? "rounded-tl-md border-white/[0.07] bg-[#0c1118]/90 text-white/85 backdrop-blur-xl group-hover:border-white/[0.11] group-hover:bg-[#0e141c]"
                : "rounded-tr-md border-blue-400/20 bg-blue-600 text-white shadow-[0_12px_35px_rgba(37,99,235,0.16)] group-hover:bg-blue-500"
            }
          `}
        >
          {/* AI label */}

          {isAI && (
            <div className="mb-2.5 flex items-center gap-2">
              <Sparkles
                size={12}
                strokeWidth={1.7}
                className="text-blue-400"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-300/70">
                AI Interviewer
              </span>

              <span className="h-px w-6 bg-white/[0.07]" />
            </div>
          )}

          {/* Message text */}

          <p
            className={`
              whitespace-pre-wrap
              text-sm
              leading-7
              sm:text-[15px]
              ${
                isAI
                  ? "text-white/80"
                  : "text-white/95"
              }
            `}
          >
            {text}
          </p>

          {/* Subtle message accent */}

          {isAI && (
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-5
                h-px
                w-10
                bg-gradient-to-r
                from-blue-400/40
                to-transparent
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />
          )}
        </div>
      </div>
    </div>
  );
}