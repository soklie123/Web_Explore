// components/ExploreButton.tsx
"use client"

import { useRouter } from "next/navigation";

interface ExploreButtonProps {
  text?: string;
  iconClass?: string;
  className?: string; // extra classes if needed
}

export default function ExploreButton({
  text = "Start Exploring",
  iconClass = "pi pi-map-marker",
  className = ""
}: ExploreButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/user/explore"); // navigate to /explore page
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center gap-2
        text-white font-medium
        px-8 py-3 rounded-full
        bg-gradient-to-r from-blue-600 to-teal-500
        hover:from-teal-500 hover:to-blue-600
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      <i className={`${iconClass} text-lg`}></i>
      {text}
    </button>
  );
}
