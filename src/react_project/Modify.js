import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './InputInfo.css';
import './Calendar';

function Modify(props) {
  const [text, setText] = useState('');
  const [part, setPart] = useState('');
  const [content, setContent] = useState('');
  const [select_color, setSelect_color] = useState();
  const [floor, setFloor] = useState('2');

  // const [modal_check, setModal_check] = useState(false);

  const formTitle = (event) => {
    setText(event.target.value);
  };

  const formPeople = (event) => {
    setPart(event.target.value);
  };

  const formContent = (event) => {
    setContent(event.target.value);
  };

  const color_list = [
    { value: 'none', color: 'Choose Color' },
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
            defaultValue={c.color === props.bgcolor ? true : false}
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

  const submitHandler = (event) => {
    // event.preventDefault();
    const expenseData = {
      title: text,
      people: part,
      content: content,
    };
    console.log(expenseData);

    axios
      .put('http://localhost:8081/api/planUpdate', {
        id: props.id,
        title: text,
        start_time: props.start,
        end_time: props.end,
        people: part,
        content: content,
        bgcolor: props.bgcolor,
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

  const delete_btn = () => {
    if (window.confirm(`삭제 '${props.title}'`)) {
      axios
        .delete(`http://localhost:8081/api/planDelete/${props.id}`)
        .then(function (res) {
          window.location.replace('/');
        })
        .catch(function (error) {
          console.log('delErr', error);
        });
    }
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
        isOpen={props.modify_state} //{modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
        style={modalStyle} //모달창 스타일
        //onRequestClose={false} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
        ariaHideApp={false}
      >
        <form className='info_form' onSubmit={submitHandler}>
          <div>
            <SelectColor option={color_list}></SelectColor>
            <input
              type='text'
              defaultValue={props.title}
              className='info_head_text'
              onChange={formTitle}
            />
          </div>

          <br />

          <div className='info_body'>
            <h4 className='info_body_text'>참여자</h4>
            <input
              type='text'
              defaultValue={props.people}
              className='info_partic'
              onChange={formPeople}
            />
          </div>

          <br />

          <br />

          <div>
            <textarea
              rows='5'
              cols='60'
              className='info_content'
              defaultValue={props.content}
              onChange={formContent}
            />
          </div>

          <br />

          <div>
            <button type='submit'>수정</button>
            <button type='button' onClick={delete_btn}>
              삭제
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

export default Modify;
