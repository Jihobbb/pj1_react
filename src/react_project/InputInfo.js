import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InputInfo.css';
import './Calendar.css';
import 'moment/locale/ko';
import moment from 'moment';

function InputInfo(props) {
  const [inputData, setData] = useState({
    title: '',
    writer: '',
    people: '',
    content: '',
    bgcolor: '',
    password: '',
  });

  const [selectedColor, setSelectedColor] = useState('선택'); //컬러 이름만 담은거
  const [selectedRgb, setSelectedRgb] = useState('#3788d8'); //  컬러 코드
  const [selectedTextColor, setSelectedTextColor] = useState('#3788d81a');
  const [iActive, setActive] = useState(false);
  const [text, setText] = useState('');

  // change.current.style.backgroundColor = 'red';
  //컬러 선택하는 리스트 출력 여부
  const active = () => {
    setActive(!iActive);
    console.log('컬러 리스트 선택');
  };

  // 지우기
  const displayText = (e) => {
    setText(e.target.value);
    setData({
      ...inputData,
      title: e.target.value,
    });
    //
  };
  // 제목 텍스트 제거
  const onReset = (e) => {
    setText('');
  };
  //모달창이 켜지거나 꺼질 떄마다 Inpudata초기화
  useEffect(() => {
    inputDataRefresh();
    console.log('모달on');
  }, [props.modal_state]);

  //일정 컬러 목록
  const color_list = [
    { bg_color: '#eaeff7', text_color: '#3788d8', color: '기본' },
    { bg_color: '#fde9e9', text_color: '#e92c2c', color: '빨강' },
    { bg_color: '#fff5ea', text_color: '#ff9f2d', color: '노랑' },
    { bg_color: '#e5f8ea', text_color: '#00ba34', color: '초록' },
    { bg_color: '#eeeeee', text_color: '#585757', color: '블랙' },
  ];

  //컬러 선택
  const SelectColor = (props) => {
    return (
      <div>
        <ul className='selectul' onClick={active}>
          <span style={{ color: selectedTextColor, paddingRight: '15px' }}>
            ●
          </span>
          {selectedColor}
          <label className='selectArrow'></label>
          {iActive &&
            props.colorList.map((c) => (
              <li
                className='selectli'
                onClick={() => {
                  setSelectedColor(c.color); // 이름을 담은거
                  setSelectedRgb(c.bg_color); // 색상코드 담은거
                  setSelectedTextColor(c.text_color);
                }}
                key={c.color}
              >
                <span style={{ color: c.text_color, paddingRight: '15px' }}>
                  ●
                </span>
                {c.color}
              </li>
            ))}
        </ul>
      </div>
    );
  };

  //Inputdata를 초기화 시켜서 다음작업에 영향이 가지 않도록 함
  const inputDataRefresh = () => {
    setData({
      ...inputData,
      title: null,
      people: '',
      content: '',
      bgcolor: '',
      password: null,
      writer: null,
    });
    setSelectedColor('선택');
    setSelectedRgb('#eaeff7');
    setSelectedTextColor('#3788d8');
    setActive(false);
  };

  const planSaveApi = () => {
    axios
      .post('http://localhost:8081/api/planSave', {
        title: inputData.title === '' ? null : inputData.title,
        writer: inputData.writer === '' ? null : inputData.writer,
        start_time: props.start,
        end_time: props.end,
        people: inputData.people,
        content: inputData.content,
        textcolor: selectedTextColor,
        bgcolor: selectedRgb,
        floor: props.floorStatus,
        password: inputData.password === '' ? null : inputData.password,
        category: selectedColor,
      })
      .then(() => {
        props.onChange();
        props.refresh();
      })
      .catch((error) => {
        document
          .querySelector('.validation-form')
          .classList.add('was-validated');
      });
  };

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: -30,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      zIndex: 99,
      justifyContent: 'center',
      alignItem: 'center',
      width: '100%',
      height: '90%',
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      background: 'white',
      borderRadius: '20px',
      margin: '0 auto',
      width: '40%',
      height: '100%',
      zIndex: 10,
    },
  };

  return (
    <div>
      <Modal
        // className='scroolBar'
        isOpen={props.modal_state} //{modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
        style={modalStyle} //모달창 스타일
        //onRequestClose={false} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
        ariaHideApp={false}
      >
        <form className='validation-form'>
          <span className='formHead'>일정</span>
          <div className='formClose' onClick={props.onChange}></div>
          <hr className='formHeadHr' />
          <div className='Sel_input_Box'>
            <label className='titleIcon modalIcon'></label>
            <div className='selectBox'>
              <SelectColor colorList={color_list}></SelectColor>
            </div>
            <div className='inputBox'>
              <div>
                <input
                  type='text'
                  placeholder='제목 (필수)'
                  className='input_head_text'
                  required
                  onChange={displayText}
                  value={text}
                />
                <button className='titledelButton' onClick={onReset}></button>
              </div>

              <div className='invalid-feedback'>*제목을 입력해 주세요</div>
            </div>
          </div>
          {/* 날짜 */}
          <div className='formDateBox'>
            <label className='calenadrIcon modalIcon'></label>
            <input
              type='text'
              value={moment(props.start).format('YYYY년 MM월 DD일')}
              className='formDate1 formDate'
              disabled
            />
            <input
              type='text'
              value={moment(props.start).format('A h:mm')}
              className='formDate2 formDate'
              disabled
            />
            <span className='dateText'>~</span>
            <input
              type='text'
              value={moment(props.end).format('A h:mm')}
              className='formDate3 formDate'
              disabled
            />
          </div>
          <br />
          <div className='inputinfo_body'>
            <label className='particIcon modalIcon'></label>
            <div className='inputBox'>
              <input
                type='text'
                placeholder='작성자 (필수)'
                className='input_partic'
                required
                onChange={(e) =>
                  setData({
                    ...inputData,
                    writer: e.target.value,
                  })
                }
              />
              <div className='invalid-feedback'>*작성자를 입력해주세요</div>
              <input
                type='text'
                placeholder='참여자'
                className='input_partic'
                onChange={(e) =>
                  setData({
                    ...inputData,
                    people: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className='floorBox'>
            <label className='locationIcon modalIcon'></label>
            <div className='floorBox_input'>
              <input
                type='text'
                style={{
                  backgroundColor: 'white',
                  borderColor: `${
                    props.floorStatus === '2' ? '#00c3cf' : '#efefef'
                  }`,
                  color: `${props.floorStatus === '2' ? '#00c3cf' : 'none'}`,
                }}
                className='floorInputPlace floorInput1'
                value='2층'
                disabled
              />
              <input
                type='text'
                style={{
                  backgroundColor: 'white',
                  borderColor: `${
                    props.floorStatus === '3' ? '#00c3cf' : '#efefef'
                  }`,
                  color: `${props.floorStatus === '3' ? '#00c3cf' : 'none'}`,
                }}
                className='floorInputPlace floorInput2'
                value='3층'
                disabled
              />
            </div>
          </div>

          <br />
          <br />
          <div className='contentBox'>
            <label className='contentIcon modalIcon'></label>
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
          <hr className='formHeadHr' />
          <div className='passwordBox'>
            <label className='lockIcon modalIcon'></label>
            <div className='pwBox'>
              <input
                required
                type='password'
                className='passwordInput'
                placeholder='비밀번호 (필수)'
                onChange={(e) =>
                  setData({
                    ...inputData,
                    password: e.target.value,
                  })
                }
              />
              <div className='invalid-feedback psfeed'>
                *비밀번호 입력해주세요
              </div>
            </div>
          </div>
          <div className='formbutton'>
            <button className='saveButton' type='button' onClick={planSaveApi}>
              저장
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
Modal.setAppElement('#root');
export default InputInfo;
