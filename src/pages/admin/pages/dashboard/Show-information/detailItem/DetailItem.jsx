import React from 'react'
// style
import styles from "./detailItem.module.css"


const DetailItem = ({ data }) => {
    const { title, number, percent, color, icon: Icon } = data;

    return (
        <div className={styles.wrapper}>

            <div className={styles.header}>

                {<Icon style={{color: `${color}`,fontSize:"1.5rem"}} />}

                {/*show positive or negative percent */}
                {percent > 0 ?
                    <div className={styles.positive} >
                        <span>{percent}%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up w-4 h-4 mr-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </div>
                    :
                    <div className={styles.negative} >
                        <span>{Math.abs(percent)}%</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down w-4 h-4 mr-0.5"><polyline points="6 9 12 15 18 9"></polyline></svg>

                    </div>}
            </div>

            <div className={styles.main}>
                <p>{number}</p>
                <p>{title}</p>
            </div>

        </div>
    )
}

export default DetailItem