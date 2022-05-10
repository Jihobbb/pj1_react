import axios from 'axios';
import { useEffect, useState } from 'react'
import Modal from 'react-modal';
import './InputInfo.css'
import './Calendar';

function Modify(props) {
    
    const [text, setText] = useState("");
    const [part, setPart] = useState("");
    const [content, setContent] = useState("");
    const [select_color, setSelect_color] = useState();
    const [floor, setFloor] = useState("2");

    // const [modal_check, setModal_check] = useState(false);


    const color_list = [
        {value : 'none', color: 'Choose Color'},
        {value : 'red', color: 'Red'},
        {value : 'blue', color: 'Blue'},
        {value : 'green', color: 'Green'},
        {value : 'yellow', color: 'Yellow'},
        {value : 'orange', color: 'Orange'},
    ]


    const SelectColor = (props) => {
        const onSelect = (event) => {
            setSelect_color(event.target.value)
        }
        return (
        <select onChange={onSelect} value={select_color}>
            {props.option.map((c) => (
                <option key={c.value} disabled={c.color === '==Color==' ? true : false} defaultValue={c.color === props.bgcolor ? true : false}>
                     {c.color}
        </option>
            ))}
        </select>
        )
    }


    function RadioBtn () {
        return(
            <div>
                    <input type='radio' value="2" 
                    checked={floor === "2"}
                    onChange={(event) => setFloor(event.target.value)}/>
                    <label form='2'>2층</label>

                    <input type='radio' value="3" 
                    checked={floor === "3"}
                    onChange={(event) => setFloor(event.target.value)}
                    />
                    <label form='3'>3층</label>
                </div>
        );
    }
    
    
    const asd = () => {
    
        // event.preventDefault();
        
        axios
        .put('http://localhost:8081/api/planUpdate',{
            id : props.id,
            title : text,
            start_time : "2022-05-09T07:00:00+09:00",
            end_time : "2022-05-09T09:30:00+09:00",
            people : part,
            content : content,
            bgcolor : "blue",
            floor : floor,

        }).then((res) => console.log(res))
        
        let info = {
            text : text,
            part : part,
            content : content,
            color : select_color,
            floor : floor,
            start : props.startStr,
            end : props.endStr,
        }

        // axios
        // .post("http://localhost:3000/rkskek",info)
        // .then((res) => console.log(res))

        console.log(info);

        // props.onChange();

    }

    const delete_btn = () => {
        if (window.confirm(`삭제 '${props.title}'`)) {
              axios
                .delete(`http://localhost:8081/api/planDelete/${props.id}`)
                .then(function (res) {
                  window.location.replace("/")
                })
                .catch(function (error) {
                  console.log('delErr', error);
                });
            }
    }

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

    return(
        <div>
            
            <Modal
            isOpen={props.modify_state}    //{modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
			style={modalStyle} //모달창 스타일
			//onRequestClose={false} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
			ariaHideApp={false}> 
            

            <form className='info_form' onSubmit={asd}>
                <div>
                <SelectColor option={color_list}></SelectColor>
                <input type="text" defaultValue={props.title} className='info_head_text'
                onChange = {(event) => setText(event.target.value)}
                />
                </div>

                <br/>

                <div className="info_body">
                    <h4 className="info_body_text">참여자</h4>
                    <input type="text" defaultValue={props.people} className='info_partic'
                    onChange={(event) => setPart(event.target.value)}/>
                </div>

                <br/>

                <br/>

                <div>
                    <textarea rows="5" cols="60"
                    className='info_content'
                    defaultValue={props.content}
                    onChange={(event) => setContent(event.target.value)}/>
                </div>

                <br/>

                <div>
                <button type='submit'>수정</button>
                <button type='button' onClick={delete_btn}>삭제</button>
                <button type="button" onClick={props.onChange}>취소</button>
                </div>

                <RadioBtn/>
                
            </form>
            </Modal>
        </div>
    )
}
Modal.setAppElement("#root")

export default Modify;