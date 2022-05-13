import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InputInfo.css';
import './Calendar.css';
import Button from 'react-bootstrap/Button';

function InputInfo(props) {
  const [inputData, setData] = useState({
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    colorname: '',
  });

  const color_list = [
    { value: 'none', color: 'Choose' },
    { value: '#BEC5CB', color: '그레이' },
    { value: '#F6D8D8', color: '핑크' },
    { value: '#D0D4B2', color: '그린' },
    { value: '#B3D3D3', color: '블루' },
    { value: '#F3E3AD', color: '옐로우' },
  ];

  const SelectColor = (props) => {
    const onSelect = (e) => {
      setData({
        ...inputData,
        bgcolor: findColorByName(e.target.value),
        colorname: e.target.value,
      });
    };

    const findColorByName = (color) => {
      let selectedColorValue;
      props.colorList.map((c) => {
        if (c.color === color) {
          selectedColorValue = c.value;
        }
      });
      return selectedColorValue;
    };

    return (
      <select
        className='formSelect'
        onChange={onSelect}
        value={inputData.colorname}
      >
        {props.colorList.map((c) => (
          <option
            key={c.value}
            disabled={c.color === '==Color==' ? true : false}
            defaultValue={c.color === '==Color==' ? true : false}
          >
            {c.color}
          </option>
        ))}
      </select>
    );
  };

  const planSaveApi = () => {
    axios
      .post('http://localhost:8081/api/planSave', {
        // id : createEventId(),
        title: inputData.title,
        start_time: props.start,
        end_time: props.end,
        people: inputData.people,
        content: inputData.content,
        bgcolor: inputData.bgcolor,
        floor: props.floorStatus,
      })
      .then(()=>{
        props.onChange();
        setData({...inputData,
          title: '',
          people: '',
          content: '',
          bgcolor: '',
          colorname: ''
        })
      });
  };

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
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
      width: '60%',
      height: '50%',

      zIndex: 10,
    },
  };

  return (
    <div>
      <Modal
        isOpen={props.modal_state} //{modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
        style={modalStyle} //모달창 스타일
        //onRequestClose={false} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
        ariaHideApp={false}
      >
        <form className='info_form'>
          <div>
            <SelectColor colorList={color_list}></SelectColor>
            <input
              type='text'
              placeholder='제목'
              className='input_head_text'
              onChange={(e) =>
                setData({
                  ...inputData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <br />

          <div className='info_body'>
            <h5 className='input_body_text'>참여자</h5>
            <input
              type='text'
              placeholder='참여자'
              className='input_partic2'
              onChange={(e) =>
                setData({
                  ...inputData,
                  people: e.target.value,
                })
              }
            />
          </div>

          <br />

          <br />

          <div>
            <textarea
              rows='5'
              cols='60'
              className='info_content'
              placeholder='회의내용'
              onChange={(e) =>
                setData({
                  ...inputData,
                  content: e.target.value,
                })
              }
            />
          </div>

          <br />

          <div className='formbutton'>
            <Button variant='primary' type='button' onClick={planSaveApi}>
              저장
            </Button>
            <Button variant='secondary' type='button' onClick={props.onChange}>
              취소
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
Modal.setAppElement('#root');
export default InputInfo;
