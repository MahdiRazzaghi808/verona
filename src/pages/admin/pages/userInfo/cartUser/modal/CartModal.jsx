import React from 'react';
// router
import { useOutletContext } from "react-router-dom";
// ant
import { Modal, List, Avatar } from "antd"
// axios
import { fetchFrom } from '../../../../../../services/axios';
// redux
import { useSelector } from 'react-redux';
import { dollarDetail } from '../../../../../../redux/itemStore/dollar';
import { authDetail } from '../../../../../../redux/itemStore/auth';
// helper
import { cartSidebar } from "../../../../../../helper/price/priceShow"
import { addToCart } from '../../../../../../helper/sweetAlert/seetAlert';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../../i18n';
import { themeDetail } from '../../../../../../redux/itemStore/theme';

function CartModal({ data, open, cartData, token }) {
    const { isModalOpen, setIsModalOpen } = open
    const { modalData, setModalData } = data
    const { cart, setCart } = cartData;

    const { lan } = useOutletContext();
    const dollar = useSelector(dollarDetail)
    const auth = useSelector(authDetail);
    const theme = useSelector(themeDetail);
    const { t } = useTranslation()


    const arr = cart.map(v => v.foodId);
    const filteredArr = modalData.filter(item => !arr.includes(item.id));



    const closeModal = () => {
        setIsModalOpen(false);
    }


    const addHandler = async (id) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        } else {
            const res = await fetchFrom({ method: 'put', url: `carts/update?token=${token}&foodId=${id}&changeAmount=1` });
            !res.error && setCart(res.data)
            !res.error && addToCart(t("foodToastTitle"), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        }

    }

    const modalContent = filteredArr ? (
        <div>

            <List
                itemLayout="horizontal"
                dataSource={filteredArr}
                renderItem={item => (
                    <List.Item className='listItem' onClick={() => addHandler(item.id)}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.image} />}
                            title={item.name[lan]}
                            description={cartSidebar(dollar, item.price, lan)}
                        />
                    </List.Item>
                )}
            />
        </div>
    ) : null;


    return (
        <Modal
            title="Add New Food"
            open={isModalOpen}
            onCancel={closeModal}
            footer={[
            ]}
        >
            {modalContent}

        </Modal>
    )
}

export default CartModal