import Swal from 'sweetalert2';

const imageDefaultUrl = [
    'https://imgurl.ir/uploads/v692241_account-avatar-profile-user-15-svgrepo-com_1.png',
    'https://s32.picofile.com/file/8482233018/account_avatar_profile_user_4_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233026/account_avatar_profile_user_5_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233034/account_avatar_profile_user_7_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233042/account_avatar_profile_user_8_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233050/account_avatar_profile_user_10_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233068/account_avatar_profile_user_13_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233084/account_avatar_profile_user_14_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233092/account_avatar_profile_user_16_svgrepo_com_1_.png',
    'https://s32.picofile.com/file/8482233100/account_avatar_profile_user_svgrepo_com_5_.png'
];

export const profileClickHandler = async (t, setSelectedImageUrl, theme) => {

    const { value: type } = await Swal.fire({
        title: t("userPanelSwalProfileTitle"),
        input: 'select',
        inputOptions: {

            default: t("userPanelSwalProfileOptionDefault"),
            custom: t("userPanelSwalProfileOptionCustom"),

        },
        showCancelButton: true,
        confirmButtonText: t("userPanelSwalProfileSelectSubmitBtn"),
        cancelButtonText: t("cartSwalCancelBtn"),
        customClass: {
            popup: theme ? 'darkSwal' : 'lightSwal',
            input: theme ? 'darkSwal' : 'lightSwal'
        }
    })

    if (type === 'default') {
        const { isConfirmed, value } = await Swal.fire({
            title: t("userPanelSwalProfileSelectDefaultTitle"),
            html: `<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
            ${imageDefaultUrl.map((url, index) => {
              return `<img src="${url}" style="width: 100px; height: 100px; border: none; border-radius: 50%;" onclick="setImage(${index}, this);"></img>`;
            }).join('')}
          </div>`
          ,
            showCancelButton: true,
            confirmButtonText: t("userPanelSwalProfileSelectSubmitBtn"),
            cancelButtonText: t("cartSwalCancelBtn"),
            customClass: {
                popup: theme ? 'darkSwal' : 'lightSwal',
                input: theme ? 'darkSwal' : 'lightSwal'
            },
            didOpen: () => {

                window.setImage = (index, clickedImage) => {

                    const allImages = document.querySelectorAll('img');
                    allImages.forEach(image => {
                        image.style.border = '2px solid transparent';
                    });

                    clickedImage.style.border = '5px solid #41ff33';

                    setSelectedImageUrl(imageDefaultUrl[index]);
                };
            },
        });

        if (!isConfirmed) {
            setSelectedImageUrl(null);
        };


    } else if (type === 'custom') {

        Swal.fire({
            title: t("userPanelSwalProfileSelectCustomTitle"),
            input: 'url',
            inputPlaceholder: t("userPanelSwalProfileSelectCustomInputPlaceholder"),
            showCancelButton: true,
            confirmButtonText: t("userPanelSwalProfileSelectSubmitBtn"),
            cancelButtonText: t("cartSwalCancelBtn"),
            customClass: {
                popup: theme ? 'darkSwal' : 'lightSwal',
                input: theme ? 'darkSwal' : 'lightSwal'
            }
        }).then((result) => setSelectedImageUrl(result.value));
    }
};