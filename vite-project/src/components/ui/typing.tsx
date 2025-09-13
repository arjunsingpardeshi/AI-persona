export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 bg-gray-200 text-gray-700 rounded-2xl px-3 py-2 w-fit">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:400ms]"></span>
    </div>
  );
}