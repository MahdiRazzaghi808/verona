import Swal from 'sweetalert2';

const imageDefaultUrl = [
    'https://www.uplooder.net/img/image/2/708d65b910014554eadb73f3a52dc6eb/h1.svg',
    'https://www.uplooder.net/img/image/63/926763375b7bec1b174c45395506b4b9/h3.svg',
    'https://www.uplooder.net/img/image/4/18adf4bdc562abef6d787e49f8c0b3a4/h4.svg',
    'https://www.uplooder.net/img/image/7/b36f3e673f5ef415a78d8ea4a8557e0d/h5.svg',
    'https://www.uplooder.net/img/image/86/74bc3f5f471e64394eba215ded2f1c52/h6.svg',
    'https://www.uplooder.net/img/image/12/60e4fd61250304d1e081f6d1dd1a85bb/h7.svg',
    'https://www.uplooder.net/img/image/96/9c5b5254f0c8c5f4b733434f4c54f37c/h8.svg',
    'https://www.uplooder.net/img/image/87/5c2c7ffd469908321127edf56c0c1980/h9.svg',
    'https://www.uplooder.net/img/image/6/e54c5dae18d0ccd2e0e1826d9afde146/h10.svg',
    'https://www.uplooder.net/img/image/29/6d0b93519b43c3ed1d03b63f9a0ce074/h11.svg'
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
            html: `<div style="display: flex; flex-wrap: wrap; gap: 10px;justify-content: center">
        ${imageDefaultUrl.map((url, index) => {
                return `<img src="${url}" alt="Image ${index}" style="max-width: 100px; max-height: 100px; cursor: pointer; border-radius: 50%;border: 5px solid transparent;" onclick="setImage(${index}, this);">`;
            }).join('')}
      </div>`,
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