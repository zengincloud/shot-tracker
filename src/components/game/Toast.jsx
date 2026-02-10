import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function Toast() {
  const { state, dispatch } = useAppContext();
  const { toast } = state;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 1500);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.message}
    </div>
  );
}
