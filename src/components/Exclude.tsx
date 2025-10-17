interface ExcludeProps {
  className?: string;
}

export default function Exclude({ className = "" }: ExcludeProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
        <span className="text-white font-bold text-sm italic">m</span>
      </div>
      <span className="text-xl font-bold text-black">MagIo.</span>
    </div>
  );
}