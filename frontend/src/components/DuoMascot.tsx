import React from "react";

interface DuoMascotProps {
  mood?: "happy" | "celebrating" | "shocked" | "thinking" | "waving";
  className?: string;
  size?: number;
}

export const DuoMascot: React.FC<DuoMascotProps> = ({
  mood = "happy",
  className = "",
  size = 100,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Duo Owl Body */}
      <rect x="25" y="20" width="70" height="85" rx="35" fill="#58CC02" />
      <rect x="25" y="20" width="70" height="85" rx="35" stroke="#46A302" strokeWidth="3" />

      {/* Duo Stomach Patch */}
      <ellipse cx="60" cy="75" rx="24" ry="26" fill="#8EE000" />

      {/* Wings */}
      {mood === "celebrating" || mood === "waving" ? (
        <>
          {/* Left wing raised high */}
          <path
            d="M25 45 C15 35, 10 20, 20 15 C30 15, 30 35, 26 48 Z"
            fill="#58CC02"
            stroke="#46A302"
            strokeWidth="3"
          />
          {/* Right wing raised high */}
          <path
            d="M95 45 C105 35, 110 20, 100 15 C90 15, 90 35, 94 48 Z"
            fill="#58CC02"
            stroke="#46A302"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          {/* Standard resting wings */}
          <path
            d="M26 50 C18 55, 16 75, 26 80 C27 70, 27 60, 26 50 Z"
            fill="#46A302"
          />
          <path
            d="M94 50 C102 55, 104 75, 94 80 C93 70, 93 60, 94 50 Z"
            fill="#46A302"
          />
        </>
      )}

      {/* Big Owl Eyes */}
      {mood === "shocked" ? (
        <>
          {/* Shocked/Sad Eyes */}
          <circle cx="45" cy="45" r="14" fill="#FFFFFF" />
          <circle cx="75" cy="45" r="14" fill="#FFFFFF" />
          <circle cx="45" cy="48" r="7" fill="#4B4B4B" />
          <circle cx="75" cy="48" r="7" fill="#4B4B4B" />
          {/* Tear drops */}
          <path d="M42 62 C40 66, 46 66, 44 62 Z" fill="#1CB0F6" />
        </>
      ) : (
        <>
          {/* Happy / Standard Big Cute Eyes */}
          <circle cx="44" cy="44" r="15" fill="#FFFFFF" />
          <circle cx="76" cy="44" r="15" fill="#FFFFFF" />
          <circle cx="46" cy="43" r="8" fill="#4B4B4B" />
          <circle cx="74" cy="43" r="8" fill="#4B4B4B" />
          {/* Eye sparkles */}
          <circle cx="44" cy="40" r="3" fill="#FFFFFF" />
          <circle cx="72" cy="40" r="3" fill="#FFFFFF" />
        </>
      )}

      {/* Orange Beak */}
      <path
        d="M52 50 L68 50 L60 62 Z"
        fill="#FF9600"
        stroke="#E07C00"
        strokeWidth="2"
      />

      {/* Feet */}
      <ellipse cx="46" cy="104" rx="8" ry="4" fill="#FF9600" />
      <ellipse cx="74" cy="104" rx="8" ry="4" fill="#FF9600" />

      {/* Party Hat for celebrating */}
      {mood === "celebrating" && (
        <path
          d="M60 5 L48 24 L72 24 Z"
          fill="#FF4B4B"
          stroke="#CE82FF"
          strokeWidth="3"
        />
      )}
    </svg>
  );
};
