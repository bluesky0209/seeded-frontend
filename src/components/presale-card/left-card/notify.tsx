import { useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

export default function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    (variant: VariantType, message: string) => {
      enqueueSnackbar(<span>{message}</span>, { variant });
    },
    [enqueueSnackbar],
  );
}
