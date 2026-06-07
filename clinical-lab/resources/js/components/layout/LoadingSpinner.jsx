export default function LoadingSpinner({ message = "Cargando datos..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-3"></div>
      <p className="text-blue-900 font-medium text-sm">{message}</p>
    </div>
  );
}