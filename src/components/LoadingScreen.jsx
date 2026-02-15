export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-dark-border border-t-dark-accent rounded-full animate-spin" />
        <p className="text-sm text-dark-muted">Loading...</p>
      </div>
    </div>
  );
}
