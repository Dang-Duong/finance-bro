type Props = {
  className?: string;
};

export default function CloseIcon({
  className = "w-5 h-5 text-gray-400",
}: Props) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 6L6 18M6 6L18 18"
      />
    </svg>
  );
}

