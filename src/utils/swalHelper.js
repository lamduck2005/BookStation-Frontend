import Swal from "sweetalert2";
import "./swalHelper.css"; // Import file CSS custom

export const showToast = (icon, title, position = "top-end", showProgress = true, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: position,
    icon,
    title,
    showConfirmButton: false,
    showCloseButton: true,
    timer,
    timerProgressBar: showProgress,
    customClass: {
      popup: "animated-toast",
    },
    didOpen: (toast) => {
      toast.style.animation = "slideIn 0.5s ease-out"; // chỉ chạy vào
    },
    willClose: (toast) => {
      toast.style.animation = "fadeOut 0.5s ease-in-out"; // cho ra ngoài
    }
  });
};

export const showQuickConfirm = (
  title,
  text,
  icon = "question",
  confirmButtonText = "Đồng ý",
  cancelButtonText = "Hủy",
  confirmButtonClass = "btn-primary",
  cancelButtonClass = "btn-secondary"
) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    customClass: {
      confirmButton: "btn " + confirmButtonClass ,
      cancelButton: "btn " + cancelButtonClass + " me-3",
    },
    buttonsStyling: false, // Bắt buộc để dùng class custom
  });
};

export const showAlert = (
  title,
  text,
  icon = "info",
  confirmButtonText = "OK",
  confirmButtonClass = "btn-success"
) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    customClass: {
      confirmButton: "btn " + confirmButtonClass,
    },
    buttonsStyling: false, // Bắt buộc để dùng class custom
  });
};

