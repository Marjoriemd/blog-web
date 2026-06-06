interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const styles = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    success: 'bg-green-50 border border-green-200 text-green-700',
  };

  return (
    <div className={`rounded-md px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {message}
    </div>
  );
}
