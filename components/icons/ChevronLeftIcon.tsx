type Props = {
  className?: string;
};

export default function ChevronLeftIcon({
  className = "w-5 h-5 text-gray-400",
}: Props) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.5 15L7.5 10L12.5 5"
      />
    </svg>
  );
}

