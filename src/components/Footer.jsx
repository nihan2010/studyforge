export function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-border py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-muted">
        <span>© 2026 nihannajeeb</span>
        <span className="flex items-center gap-1">
          Made with Kerala with love
          <span className="text-red-500" aria-hidden>
            <HeartIcon />
          </span>
        </span>
        <a
          href="https://nihannajeeb.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-dark-text transition-colors"
        >
          nihannajeeb.in
        </a>
      </div>
    </footer>
  );
}

function HeartIcon() {
  return (
    <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
