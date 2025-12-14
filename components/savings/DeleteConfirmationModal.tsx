"use client";

import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@/components/icons/CloseIcon";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  warningMessage?: string;
  confirmButtonText?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warningMessage,
  confirmButtonText = "Delete",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a2b3d] rounded-lg w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 text-white/70 hover:text-white active:bg-white/20 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <div className="p-6 lg:p-8">
                <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 pr-8">
                  {title}
                </h2>

                <p className="text-white/80 mb-6">{message}</p>

                {warningMessage && (
                  <p className="text-sm text-white/60 mb-6">{warningMessage}</p>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium text-white/80 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    {confirmButtonText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
