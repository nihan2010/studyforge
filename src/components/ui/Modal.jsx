export function Modal({ open, onClose, title, children, className = '' }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-dark-card border border-dark-border rounded-lg w-full max-w-sm animate-slide-up ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-semibold text-dark-text px-6 pt-6 pb-2">
            {title}
          </h2>
        )}
        <div className={title ? 'px-6 pb-6' : 'p-6'}>{children}</div>
      </div>
    </div>
  );
}
