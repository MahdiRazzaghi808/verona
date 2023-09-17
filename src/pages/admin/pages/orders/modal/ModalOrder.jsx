import React, { useState } from "react"
// ant
import { Modal } from "antd"
// language
import i18n from "../../../../../i18n";
import { useTranslation } from 'react-i18next';

// style
import styles from "./modalOrder.module.css"
import { sortProductsByCategory } from "../../../../../helper/filterFoods/filterFoods";

const ModalOrder = ({ open, data }) => {
    const { isModalOpen, setIsModalOpen } = open;
    const { modalData, setModalData } = data;
    const { t } = useTranslation();

    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <Modal
                title={t('pAdminOrdersUserCart')}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <div className='languageBtn cartShowWrapper '>
                    {
                        sortProductsByCategory(modalData).map(item =>
                            <div className={styles.foodWrapper}>
                                <img src={item.image} alt="food" />
                                <p>{item.name[i18n.language]}</p>
                                <span>{item.count}</span>
                            </div>
                        )
                    }
                </div>
            </Modal>
        </>
    )
}

export default ModalOrder
