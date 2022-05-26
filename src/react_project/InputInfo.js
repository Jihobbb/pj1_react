import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InputInfo.css';
import './Calendar.css';
import Button from 'react-bootstrap/Button';
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
  const [iActive, setActive] = useState(false);

  //컬러 선택하는 리스트 출력 여부
  const active = () => {
    setActive(!iActive);
  };

  // 지우기

  //모달창이 켜지거나 꺼질 떄마다 Inpudata초기화
  useEffect(() => {
    inputDataRefresh();
  }, [props.modal_state]);

  //일정 컬러 목록
  const color_list = [
    { value: '#3788d8', color: '기본' },
    { value: '#BEC5CB', color: '그레이' },
    { value: '#F6D8D8', color: '핑크' },
    { value: '#D0D4B2', color: '그린' },
    { value: '#B3D3D3', color: '블루' },
    { value: '#F3E3AD', color: '옐로우' },
  ];

  //컬러 선택
  const SelectColor = (props) => {
    return (
      <div>
        <ul className='selectul' onClick={active}>
          <span style={{ color: selectedRgb, paddingRight: '15px' }}>●</span>
          {selectedColor}
          <label className='selectArrow'></label>
          {iActive &&
            props.colorList.map((c) => (
              <li
                className='selectli'
                onClick={() => {
                  setSelectedColor(c.color); // 이름을 담은거
                  setSelectedRgb(c.value); // 색상코드 담은거
                  // onSelect();
                }}
                key={c.value}
              >
                <span style={{ color: c.value, paddingRight: '15px' }}>●</span>
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
    setSelectedRgb('#3788d8');
    setActive(false);
  };

  const planSaveApi = () => {
    axios
      .post('http://localhost:8081/api/planSave', {
        // id : createEventId(),
        title: inputData.title,
        writer: inputData.writer,
        start_time: props.start,
        end_time: props.end,
        people: inputData.people,
        content: inputData.content,
        bgcolor: selectedRgb,
        floor: props.floorStatus,
        password: inputData.password,
        category: selectedColor
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
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      zIndex: 99,
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
      height: '80%',
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
              <input
                type='text'
                placeholder='제목 (필수)'
                className='input_head_text'
                required
                onChange={(e) =>
                  setData({
                    ...inputData,
                    title: e.target.value,
                  })
                }
              />
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
