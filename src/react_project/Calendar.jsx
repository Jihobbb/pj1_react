import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputInfo from './InputInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.css';
import Modify from './Modify';
import Planner from './Planner';
import { propTypes } from 'react-bootstrap/esm/Image';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [modify_state, setModify_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [refresh, setRefresh] = useState(true); // 작업에 실패했는데도 화면에 남아있는 결과값을 새로고침

  const [planList, setPlanList] = useState([]);
  const [planData, setData] = useState({
    id: '',
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    floor: '',
    password:'',
  });

  const [togleBtn, setTogleBtn] = useState('2'); //층 상태


  //전체 일정 GET
  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');
    const plans = response.data.filter(function (element) {
      //층으로 필터링
      return element.floor === togleBtn;
    });
    setPlanList(plans);
  };

  useEffect(() => {
    getdata();
  }, [togleBtn, refresh]);

  //PlanList매핑
  const planListMapping = (planList) => {
    const dataList = planList.map((planList) => ({
      id: planList.id,
      title: planList.title,
      start: planList.start_time,
      end: planList.end_time,
      backgroundColor: planList.bgcolor,
      borderColor: planList.bgcolor,
      extendedProps: {
        people: planList.people,
        content: planList.content,
        floor: planList.floor,
        password: planList.password
      },
    }));
    return dataList
  };

  //업데이트 API호출
  const updatePlan = (plan) => {
    axios
      .put('http://localhost:8081/api/planUpdate', {
        id: plan.id,
        title: plan.title,
        start_time: plan.start,
        end_time: plan.end,
        people: plan.extendedProps.people,
        content: plan.extendedProps.content,
        bgcolor: plan.backgroundColor,
        floor: plan.extendedProps.floor,
      })
      .then((res) => console.log(res));
  };

  //일정 state 변경
  const setPlanStatus = (Info) => {
    setData({
      id: Info.id,
      title: Info.title,
      people: Info.extendedProps.people,
      content: Info.extendedProps.content,
      bgcolor: Info.backgroundColor,
      floor: Info.extendedProps.floor,
      password: Info.extendedProps.password
    });
    setStartStr(Info.start);
    setEndStr(Info.end);
  };

  //입력 폼 온오프
  const inputFormControl = () => {
    setModal_state(!modal_state);
  };

  //수정 폼 온오프
  const updateFormControl = () => {
    setModify_state(!modify_state);
  };

  //드래그해서 기간설정
  const handleDateSelect = (selectInfo) => {
    setModal_state(!modal_state);
    setStartStr(selectInfo.startStr);
    setEndStr(selectInfo.endStr);
  };

  //일정 클릭
  const handleEventClick = (clickInfo) => {
    setModify_state(!modal_state);
    setPlanStatus(clickInfo.event);
  };

  //비밀번호 체크
  const passwordCheck = (password) => {
    const pwCheck = prompt("비밀번호를 입력하세요.");
    if(pwCheck === password) {
      return true;
    }else if(pwCheck === null){           //취소버튼 눌렀을 경우
      return false;
    } else {
      alert("비밀번호가 일치하지 않습니다.")
      return false;
    }
  }

  //드래깅 드랍 완료
  const dragAnddrop = (dropInfo) => {
    if(passwordCheck(dropInfo.event.extendedProps.password)){
      updatePlan(dropInfo.event);
    } else {
      setRefresh(!refresh) 
    }
  };

  //이벤트 사이즈 조절
  const eventSizing = (dragInfo) => {
    if(passwordCheck(dragInfo.event.extendedProps.password)){
      updatePlan(dragInfo.event);
    } else {
      setRefresh(!refresh) 
    }   
  };

  console.log(111111111)

  return (
    <div>
      {/* 입력폼 Props */}
      <InputInfo
        modal_state={modal_state}
        start={startStr}
        end={endStr}
        floorStatus={togleBtn}
        onChange={inputFormControl}
      />

      {/* 수정폼 Props */}
      <Modify
        modify_state={modify_state}
        onChange={updateFormControl}
        plan={planData}
        start={startStr}
        end={endStr}
        pwCheck = {passwordCheck}
      />

      <Planner
        floorChange ={setTogleBtn}
        planList = {planList}
        planListMapping = {planListMapping}
        handleEventClick = {handleEventClick}
        handleDateSelect = {handleDateSelect}
        dragAnddrop = {dragAnddrop}
        eventSizing = {eventSizing}
      ></Planner>
    </div>
  );
};

export default Calendar;
