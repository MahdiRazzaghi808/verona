import React from 'react'
import styles from "./timeFilter.module.css"
import { useTranslation } from 'react-i18next';

function TimeFilter({ showFilter, setShowFilter, type }) {
    const { t } = useTranslation();


    const filterItem = {

        time: [
            { id: 1, name: t("timeFilterHour"), time: 3600000 },
            { id: 2, name: t("timeFilterDay"), time: 86400000 },
            { id: 3, name: t("timeFilterWeek"), time: 604800000 },
            { id: 4, name: t("timeFilterThisMonth"), time: 2628000000 },
            { id: 5, name: t("timeFilterMoreMonth"), time: 9693406720007 },
        ],

        foods: [
            { id: 1, name: t('foodFilterAll'), time: 'all' },
            { id: 2, name: t('foodFilterHamburger'), time: 'hamburger' },
            { id: 3, name: t('foodFilterPizza'), time: 'pizza' },
            { id: 4, name: t('foodFilterFriesSides'), time: 'friesSides' },
            { id: 5, name: t('foodFilterBeverages'), time: 'beverages' },
        ],
        discount: [
            { id: 1, name: t('discountFilterAll'), time: 'all' },
            { id: 2, name: t('discountFilterActive'), time: 'active' },
            { id: 3, name: t('discountFilterExpired'), time: 'expired' },

        ]

    }






    return (
        <div className={`${styles.wrapper} ${styles['scroll-container']}`}>

            {
                filterItem[type].map(item =>
                    <div className={`${showFilter === item.time && 'pBtn-active'}`} onClick={() => setShowFilter(item.time)} key={item.id}>
                        {item.name}
                    </div>
                )
            }


        </div>
    )
}

export default TimeFilter