import React, { useEffect, useState } from 'react'
// style
import styles from "./comments.module.css"
// ant
import { Input, Divider } from 'antd';
const { TextArea } = Input;
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// redux
import { useSelector } from 'react-redux';
import { authDetail } from '../../../redux/itemStore/auth';
// alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// axios
import { fetchFrom } from '../../../services/axios';
// language
import { useTranslation } from 'react-i18next';
// helper
import { setTime } from '../../../helper/setTime/setTime';

function Comments() {
  // state
  const [createComment, setCreateComment] = useState('')
  const [allComments, setAllComments] = useState([]);
  const [showComment, setShowComments] = useState(false);
  // redux
  const auth = useSelector(authDetail);
  // hooks
  const { t } = useTranslation();


  useEffect(() => {
    getData();

  }, [])

  const getData = async () => {
    const res = await fetchFrom({ method: 'get', url: `/comments?token=${localStorage.getItem('token')}` });
    const sortedComments = res.data.sort((a, b) => b.id - a.id);
    setAllComments(sortedComments)

  }

  const onChange = (event) => {
    setCreateComment(event.target.value);
  };

  const senData = async () => {
    if (createComment && createComment.length > 20) {
      const sendData = {
        body: createComment,
        token: auth.userInfo.token,
        show: false,
        time: setTime(),
        language: ""
      }
      const res = await fetchFrom({ method: 'post', url: '/comments', requestConfig: { ...sendData } });
      if (!res.error) {

        setCreateComment('');
        getData();

        toast.success(t("userPanelCommentsSuccessAlert"), {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    } else {
      toast.error(t("userPanelCommentsErrorAlert"), {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }


  return (
    <div className={styles.comments}>
      <h2>{t("userPanelCommentsTitle")}</h2>

      <div className={styles.createComment}>
        <TextArea
          showCount
          maxLength={220}
          style={{ height: 120, resize: 'none' }}
          onChange={onChange}
          value={createComment}
          placeholder={t("userPanelCommentsInputPlaceholder")}
        />

        <button className='btn' onClick={senData}>{t("userPanelCommentsSendBtn")}</button>
      </div>





      <div className={styles.allComments}>

        <Divider className={styles.div}>{t("userPanelCommentsYour")} </Divider>

        {
          allComments.length ?
            <>
              <button className='btn' onClick={() => setShowComments(prev => !prev)}>
                {showComment ? <UpOutlined /> : <DownOutlined />}

              </button>

              <div className={`${styles.commentsWrapper} ${showComment ? `${styles.showComment}` : ''}`}>
                {allComments.map(comment => <div key={comment.id} className={`${styles.commentItem} pre1`}>{comment.body}</div>)}
              </div>

            </>

           :
            <h3>
              {t("userPanelCommentsNoCommentsAlert")}
            </h3>
        }

      </div>


    </div >
  )
}

export default Comments