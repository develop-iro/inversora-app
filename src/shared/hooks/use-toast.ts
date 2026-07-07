import { toast } from '@/core/overlay/toast';
import { useToastStore } from '@/core/overlay/toast-store';

/**
 * React hook for showing transient toast feedback.
 */
export function useToast() {
  const show = useToastStore((state) => state.show);
  const dismiss = useToastStore((state) => state.dismiss);
  const clear = useToastStore((state) => state.clear);

  return {
    show,
    dismiss,
    clear,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  };
}
