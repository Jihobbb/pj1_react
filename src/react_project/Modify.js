import axios from 'axios';
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InputInfo.css';
import './Calendar.css';
import moment from 'moment';
import Button from 'react-bootstrap/Button';

const Modify = forwardRef((props, ref) => {
  const [updateData, setData] = useState({
    title: '',
    people: '',
    content: '',
    writer: '', //작성자
  });

  //

  //
  const setDefaultData = () => {
    setData({
      title: props.plan.title,
      people: props.plan.people,
      content: props.plan.content,
      writer: props.plan.writer, //작성자
    });
  };

  useEffect(() => {
    setDefaultData();
  }, [props]);

  //DB에 수정 데이터 반영
  const planUpdateApi = () => {
    axios
      .put('http://localhost:8081/api/planUpdate', {
        id: props.plan.id,
        title: updateData.title,
        start_time: props.start,
        end_time: props.end,
        people: updateData.people,
        content: updateData.content,
        bgcolor: props.plan.bgcolor,
        floor: props.plan.floor,
        password: props.plan.password,
        writer: updateData.writer, //작성자
      })
      .then(() => {
        props.onChange();
        props.refresh();
      });
  };

  //삭제 버튼 클릭
  const delete_btn = (e) => {
    if (window.confirm(`삭제 '${props.plan.title}'`)) {
      axios
        .delete(`http://localhost:8081/api/planDelete/${props.plan.id}`)
        .then(function () {
          props.onChange();
          props.refresh();
        })
        .catch(function (error) {
          console.log('delErr', error);
        });
    }
  };

  //모달 창 디자인
  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 10,
      justifyContent: 'center',
      alignItem: 'center',
      width: '100%',
      height: '100%',
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      background: 'white',
      borderRadius: '20px',
      margin: '0 auto',
      width: '35%',
      height: '55%',

      zIndex: 10,
    },
  };

  return (
    <div>
      <Modal
        isOpen={props.modifyModal}
        // isOpen={true}
        //{modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
        // modify_state
        style={modalStyle} //모달창 스타일
        //onRequestClose={false} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
        ariaHideApp={false}
      >
        <form className='info_form'>
          <div className='modifyhead'>
            <label className='titleIcon modalIcon'></label>

            <input
              type='text'
              value={updateData.title}
              className='modify_info_body_text'
              onChange={(e) => {
                setData({
                  ...updateData,
                  title: e.target.value,
                });
              }}
            />
          </div>

          <br />

          <div className='info_body'>
            <label className='particIcon modalIcon'></label>
            {/* <div className='info_body_text'>참여자</div> */}
            <div className='inputBox2'>
              <input
                type='text'
                placeholder='작성자'
                value={updateData.writer}
                className='modinfo_partic'
                onChange={(e) => {
                  setData({
                    ...updateData,
                    writer: e.target.value,
                  });
                }}
              />

              <input
                type='text'
                placeholder='참여자'
                value={updateData.people}
                className='modinfo_partic2'
                onChange={(e) => {
                  setData({
                    ...updateData,
                    people: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className='modify_formDate'>
            <label className='calenadrIcon modalIcon'></label>
            <input
              type='text'
              value={moment(props.start).format('YYYY년 MM월 DD일')}
              className='formDate1 formDate'
              disabled
            />
            <input
              type='text'
              value={moment(props.start).format('A h시 mm분')}
              className='formDate2 formDate'
              disabled
            />
            <span className='dateText'>~</span>
            <input
              type='text'
              value={moment(props.end).format('A h시 mm분')}
              className='formDate3 formDate'
              disabled
            />
          </div>

          <br />

          <br />

          <div className='contentBox'>
            <label className='contentIcon modalIcon'></label>
            <textarea
              rows='5'
              cols='60'
              placeholder='회의내용'
              className='info_content'
              value={updateData.content}
              onChange={(e) => {
                setData({
                  ...updateData,
                  content: e.target.value,
                });
              }}
            />
          </div>

          <br />

          <div className='modify_formbutton'>
            <Button
              type='button'
              variant='primary'
              onClick={() => {
                if (props.pwCheck(props.plan.password)) {
                  planUpdateApi();
                }
              }}
            >
              수정
            </Button>

            <Button
              type='button'
              variant='danger'
              onClick={() => {
                if (props.pwCheck(props.plan.password)) {
                  delete_btn();
                }
              }}
            >
              삭제
            </Button>

            <Button
              type='button'
              variant='outline-secondary'
              onClick={props.onChange}
            >
              취소
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
});
Modal.setAppElement('#root');

export default Modify;
