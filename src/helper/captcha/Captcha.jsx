import React, { useRef, useEffect, useState } from 'react'
import { SyncOutlined, SoundOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { getImgValiCode } from './captchaCreator';
import { Form, Input, } from 'antd';
// style component
import styles from './captcha.module.css'
// /////////////////////////////////////
import { useTranslation } from 'react-i18next';


function Captcha({ form, captchaValue, setCaptchaValue }) {
    const captchaId = useRef();
    const soundRef = useRef();
    const { t } = useTranslation();


    useEffect(() => {
        setCaptchaValue(getImgValiCode(captchaId.current));
    }, [form.isSubmitting])


    const soundHandler = () => {
        let res = `https://one-api.ir/tts/?token=677668:64ae5b9d7c848&action=microsoft&lang=en-CA-LiamNeural&q=${captchaValue}&rate=-5`;
        soundRef.current.src = res;
        soundRef.current.load();
        soundRef.current.play();
    }

    return (

        <div className={styles.wrapper}>
            <div className="">
                <div>
                    <canvas ref={captchaId} className={styles.captchaId}></canvas>
                </div>

                <div className={styles.icons}>

                    <SyncOutlined onClick={() => setCaptchaValue(getImgValiCode(captchaId.current))} style={{ color: '#e1e1e1', fontSize: '1.25rem' }} />

                    <SoundOutlined onClick={soundHandler} style={{ color: '#e1e1e1', fontSize: '1.25rem' }} />


                    <audio ref={soundRef}></audio>
                </div>
            </div>


            <div className={styles.inputWrapper}>
                <Form.Item
                    label=""
                    hasFeedback
                    validateStatus={(!form.errors.captcha && form.touched.captcha) ? 'success' : (form.errors.captcha && form.touched.captcha) ? 'error' : ''}
                    help={form.errors.captcha && form.touched.captcha && form.errors.captcha}
                >
                    <Input
                        type='text'
                        name='captcha'
                        size="large"
                        placeholder={t("captchaPlachoder")}
                        prefix={<SecurityScanOutlined />}
                        value={form.values.captcha}
                        onChange={(e) => {
                            const lowerCaseValue = e.target.value.toLowerCase(); // تبدیل مقدار به حروف کوچک
                            form.setFieldValue('captcha', lowerCaseValue); // تنظیم مقدار به حروف کوچک در فرم
                          }}
                        onBlur={form.handleBlur}
                    />
                </Form.Item>
            </div>
        </div>

    )
}

export default Captcha