import Swal from "sweetalert2";
import "./swalHelper.css"; // Import file CSS custom

export const showToast = (icon, title, position = "top-end", showProgress = true, timer = 3000) => {
  Swal.fire({
    toast: true,
    position: position,
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: showProgress,
    customClass: {
      popup: "animated-toast",
    },
    didOpen: (toast) => {
      toast.style.animation =
        "slideIn 0.5s ease-out, fadeOut 0.5s ease-in-out " +
        (timer - 500) +
        "ms forwards";
    },
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

