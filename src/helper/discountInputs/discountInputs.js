import Swal from "sweetalert2";
import { addToCart } from "../sweetAlert/seetAlert";

export const handleCreateClick = (t,auth, lan, sendData, theme, text, input1, input2, btn, btn2, title) => {
    Swal.fire({
        title: title,
        html: `
      <div class="swal-vertical">
  <input id="input7" class="swal2-input swal2-input75" type="number" placeholder=${input1} value="" min="1" max='100'  required>
  <input id="input8" class="swal2-input swal2-input75" type="number" placeholder=${input2} value="" min="1" max='100' required>
</div>
    `,
        showCancelButton: true,
        confirmButtonText: btn,
        cancelButtonText: btn2,
        customClass: {
            popup: theme ? 'darkSwal' : 'lightSwal',
            input: theme ? 'darkSwal' : 'lightSwal'
        },
        preConfirm: () => {
            const inputValue1 = parseFloat(document.getElementById('input7').value);
            const inputValue2 = parseFloat(document.getElementById('input8').value);

            if (isNaN(inputValue1) || isNaN(inputValue2) || inputValue1 < 1 || inputValue2 < 1 || inputValue2 > 100) {
                Swal.showValidationMessage(text);
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            if (auth.userInfo.rol === 'VIEWER') {
                addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
            } else {
                sendData(document.getElementById('input7').value, document.getElementById('input8').value);
                document.getElementById('input7').value = ''
                document.getElementById('input8').value = ''
            }
        }
    });
};