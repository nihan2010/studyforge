import { Modal } from './Modal';

export function ConfirmModal({
  open = true,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-dark-muted mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-dark-muted hover:text-dark-text transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg font-medium transition-opacity ${
            danger
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-dark-accent text-white hover:opacity-90'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
