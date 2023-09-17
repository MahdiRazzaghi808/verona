import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


export const loginAlert = (title, text, login, close) => Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonText: login,
    showCancelButton: true,
    cancelButtonText: close,
    cancelButtonColor: '#d33',
    customClass: {
        popup: 'darkSwal',
    }
})
//////////////////////////////////////////////////////////////////////////////////////

export const swalAlert = (icon, title, text, login, close, theme, callback) => Swal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonText: login,
    showCancelButton: !!close,
    cancelButtonText: close,
    customClass: {
        popup: theme ? 'darkSwal' : 'lightSwal',
    }
}).then((result) => callback(result));
//////////////////////////////////////////////////////////////////////////////////////
export const addToCart = (title, rtl, isDarkTheme) => (
    toast.success(title, {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        rtl: rtl,
        progress: undefined,

        theme: isDarkTheme ? "dark" : "light",

    })

)
//////////////////////////////////////////////////////////////////////////////////////

export const iziAlert = (status, title) => (
    toast[status](title, {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })

)

// iziAlert("success","add to cart this product")
