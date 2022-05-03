import React, { useState } from "react";
import Modal from "react-modal";
function ProjectModal() {

    const [modal_state, setModal_state] = useState(false);

    const modal_click = () =>{
        setModal_state(!modal_state)
    }

    const modalStyle = {
        overlay : {
        position: "fixed",
        top: 30,
        left: 30,
        right: 30,
        bottom: 30,
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        zIndex: 10,
    },
    content: {
        display: "flex",
        justifyContent: "center",
        background: "#ffffe7",
        overflow: "auto",
        top: "42vh",
        left: "38vw",
        right: "38vw",
        bottom: "42vh",
        WebkitOverflowScrolling: "touch",
        borderRadius: "14px",
        outline: "none",
        zIndex: 10,
    },
};


return (
        <div>    
          <Modal 
    		isOpen={modal_state} //true시 모달이 나옴 버튼 클릭시 false에서 트루로?
			style={modalStyle} //모달창 스타일
			// onRequestClose={모달토글핸들러} // 오버레이나 esc를 누르면 isopen값이 false 닫힘
			//ariaHideApp={false}
            >
    		모달 내용 or 컴포넌트ㅇㅁㄴㅇㅈㅇ
            ㅇㅈ
            ㅇㅂㅈㅇ
            ㅂㅈㅇㅂㅈ
            ㅇㅂㅈ
            ㅇㅂㅈㅇ
            ㅂㅈㅇㅂㅈㅈㅂㅇㅂㅈ
            ㅇㅂㅈㅇ

            
    	</Modal>

        
       

        
        </div>
    )
    
}
    Modal.setAppElement("#root")
    export default ProjectModal;