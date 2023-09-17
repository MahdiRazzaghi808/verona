import React from "react";
// ant
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Checkbox } from 'antd';
// style
import "./FormFormik.css";
import { useSelector } from "react-redux";
import { authDetail } from "../../redux/itemStore/auth";

export default function FormFormik({ form, name, type, label, placeholder, prefix }) {
  const auth = useSelector(authDetail)
  return (
    <>

      {
        (type === 'password') ?

          <div className='inputWrapper'>
            <Form.Item
              label={label}
              hasFeedback
              validateStatus={(!form.errors[name] && form.touched[name]) ? 'success' : (form.errors[name] && form.touched[name]) ? 'error' : ''}
              help={form.errors[name] && form.touched[name] && form.errors[name]}
            >
              <Input.Password
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                name={name}
                prefix={prefix}
                value={(auth.userInfo.rol === 'VIEWER') ? "" : form.values[name]}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder={placeholder}

              />
            </Form.Item>
          </div>

          :

          (type === 'checkBox') ?
            <div className='inputWrapper'>
              <Form.Item
                name="rules"
                valuePropName={form.values[name]}
                help={form.errors[name] && form.touched[name] && form.errors[name]}
                validateStatus={(!form.errors[name] && form.touched[name]) ? 'success' : (form.errors[name] && form.touched[name]) ? 'error' : ''}
              >

                <Checkbox
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}

                >{label}</Checkbox>
              </Form.Item>
            </div>
            :
            <div className='inputWrapper'>
              <Form.Item
                label={label}
                hasFeedback
                validateStatus={(!form.errors[name] && form.touched[name]) ? 'success' : (form.errors[name] && form.touched[name]) ? 'error' : ''}
                help={form.errors[name] && form.touched[name] && form.errors[name]}
              >
                <Input size="large"
                  name={name}
                  type={type}
                  prefix={prefix}
                  placeholder={placeholder}
                  value={form.values[name]}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              </Form.Item>
            </div>

      }

    </>
  );
}
