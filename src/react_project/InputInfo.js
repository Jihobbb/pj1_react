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
    password: '',
  });

  const [selectedColor, setSelectedColor] = useState('선택'); //컬러 이름 만 담은거
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
    { value: '#3788d8', color: 'default' },
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
      title: '',
      people: '',
      content: '',
      bgcolor: '',
      password: null,
    });
    setSelectedColor('선택');
    setSelectedRgb('');
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
        bgcolor: selectedRgb,
        floor: props.floorStatus,
        password: inputData.password,
      })
      .then(() => {
        props.onChange();
        props.refresh();
      })
      .catch((error) => {
        alert('비밀번호를 입력하세요');
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
      width: '45%',
      height: '75%',

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
          <span className='formHead'>일정</span>
          <div className='formClose' onClick={props.onChange}></div>
          <hr />
        <form className='validation-form was-validated'>
          <div className='Sel_input_Box'>
            <label className='titleIcon modalIcon'></label>
            <div className='selectBox'>
              <SelectColor colorList={color_list}></SelectColor>
            </div>
            <div className='inputBox'>
              <input
                type='text'
                placeholder='제목'
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
          <div>
            <input type='text' className='input_head_text' disabled/>
            <input type='text' value={props.start} className='input_head_text' disabled/>-
            <input type='text' value={props.end} className='input_head_text' disabled/>
          </div>
          <br />
          <div className='inputinfo_body'>
            <label className='particIcon modalIcon'></label>
            <div className='inputBox2'>
              <input
                type='text'
                placeholder='작성자'
                className='input_partic'
                required
                onChange={(e) =>
                  setData({
                    ...inputData,
                    people: e.target.value,
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
          <br/>
          <hr></hr>
          <div className='passwordBox'>
          <label className='lockIcon'></label>
            <input
              required
              type='password'
              className='passwordBox'
              placeholder='비밀번호'
              // defaultValue='비밀번호'
              onChange={(e) =>
                setData({
                  ...inputData,
                  password: e.target.value,
                })
              }
            />
            <div className='invalid-feedback'>*작성자를 입력해주세요</div>
            <div className='formbutton'>
              <Button variant='primary' type='button' onClick={planSaveApi}>
                저장
              </Button>
              <Button variant='secondary' type='button' onClick={props.onChange}>
                취소
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
Modal.setAppElement('#root');
export default InputInfo;
