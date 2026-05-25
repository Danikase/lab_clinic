import Swal from 'sweetalert2';

// ✅ Configuración base para todas las alertas
const baseConfig = {
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  showCancelButton: false,
  allowOutsideClick: false,
  customClass: {
    confirmButton: 'bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg',
    cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg ml-2',
    popup: 'rounded-xl shadow-2xl',
  },
  buttonsStyling: false,
};

// ✅ Alerta de éxito
export const successAlert = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text,
    timer: 2500,
    timerProgressBar: true,
  });
};

// ✅ Alerta de error
export const errorAlert = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text,
  });
};

// ✅ Alerta de confirmación (Sí/No)
export const confirmAlert = (title, text = '', confirmText = 'Sí, confirmar') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    reverseButtons: true,
  });
};

// ✅ Alerta de información
export const infoAlert = (title, text = '') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text,
  });
};

// ✅ Loading overlay (para procesos largos)
export const showLoading = (title = 'Procesando...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const hideLoading = () => {
  Swal.close();
};