import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './InputInfo.css';
import './Calendar';
import { createEventId } from './event-utils';
// import Form from 'react-bootstrap/Form';

function InputInfo(props) {
  const [text, setText] = useState('');
  const [part, setPart] = useState('');
  const [content, setContent] = useState('');
  const [select_color, setSelect_color] = useState();
  const [floor, setFloor] = useState('2');

  // const [modal_check, setModal_check] = useState(false);

  const color_list = [
    { value: 'null', color: 'Choose Color' },
    { value: 'red', color: 'Red' },
    { value: 'blue', color: 'Blue' },
    { value: 'green', color: 'Green' },
    { value: 'yellow', color: 'Yellow' },
    { value: 'orange', color: 'Orange' },
  ];

  const SelectColor = (props) => {
    const onSelect = (event) => {
      setSelect_color(event.target.value);
    };
    return (
      <select onChange={onSelect} value={select_color}>
        {props.option.map((c) => (
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

  function RadioBtn() {
    return (
      <div>
        <input
          type='radio'
          value='2'
          checked={floor === '2'}
          onChange={(event) => setFloor(event.target.value)}
        />
        <label form='2'>2층</label>

        <input
          type='radio'
          value='3'
          checked={floor === '3'}
          onChange={(event) => setFloor(event.target.value)}
        />
        <label form='3'>3층</label>
      </div>
    );
  }

  const onClick = (event) => {
    // event.preventDefault();

    axios
      .post('http://localhost:8081/api/planSave', {
        // id : createEventId(),
        title: text,
        start_time: props.startStr,
        end_time: props.endStr,
        people: part,
        content: content,
        bgcolor: select_color,
        floor: floor,
      })
      .then((res) => console.log(res));

    let info = {
      text: text,
      part: part,
      content: content,
      color: select_color,
      floor: floor,
      start: props.startStr,
      end: props.endStr,
    };

    // axios
    // .post("http://localhost:3000/rkskek",info)
    // .then((res) => console.log(res))

    console.log(info);

    // props.onChange();
  };

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.45)',
      zIndex: 10,
      justifyContent: 'center',
      alignItem: 'center',
    },
    content: {
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      background: '#ffffe7',
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
        <form>
          <div>
            <SelectColor option={color_list}></SelectColor>
            <input
              type='text'
              placeholder='제목'
              className='info_head_text'
              onChange={(event) => setText(event.target.value)}
              value={text}
            />
          </div>

          <br />

          <div className='info_body'>
            <h4 className='info_body_text'>참여자</h4>
            <input
              type='text'
              placeholder='참여자'
              className='info_partic'
              onChange={(event) => setPart(event.target.value)}
            />
          </div>

          <br />

          <div>
            <input type='text' defaultValue={props.startStr}></input>
            <br></br>≀<br></br>
            {/* <h6>≀</h6> */}
            <input type='text' defaultValue={props.endStr}></input>
          </div>

          <br />

          <div>
            <textarea
              rows='5'
              cols='60'
              className='info_content'
              placeholder='회의내용'
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          <div>
            <button type='submit' onClick={onClick}>
              저장
            </button>
            <button type='button' onClick={props.onChange}>
              취소
            </button>
          </div>

          <RadioBtn />
        </form>
      </Modal>
    </div>
  );
}
Modal.setAppElement('#root');
export default InputInfo;
