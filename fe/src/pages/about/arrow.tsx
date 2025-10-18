export default function Arrow() {
  return (
    <div className="hidden md:flex justify-center">
      <div className="h-0.5 w-8 bg-border self-center relative">
        <span className="absolute -right-1 -top-1 rotate-45 block h-2 w-2 border-r border-t border-border" />
      </div>
    </div>
  );
}
