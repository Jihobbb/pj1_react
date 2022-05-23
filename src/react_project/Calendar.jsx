import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import InputInfo from './InputInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.css';
import Modify from './Modify';
import Planner from './Planner';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [modify_state, setModify_state] = useState(false);

  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');

  const [planList, setPlanList] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [planData, setData] = useState({
    id: '',
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    floor: '',
    password: '',
  });

  const [togleBtn, setTogleBtn] = useState('2'); //층 상태

  //전체 일정 GET
  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');
    const response2 = await axios.get('http://localhost:8081/api/HolidayList');
    setPlanList(response.data);
    setHolidayList(response2.data);
  };

  useEffect(() => {
    getdata();
  }, []);

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
      .then(getdata);
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
      password: Info.extendedProps.password,
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

  //비밀번호 체크
  const passwordCheck = (password) => {
    const pwCheck = prompt('비밀번호를 입력하세요.');
    if (pwCheck === password) {
      return true;
    } else if (pwCheck === null) {
      getdata(); //취소버튼 눌렀을 경우
      return false;
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      getdata();
      return false;
    }
  };

  return (
    <div>
      {/* 입력폼 Props */}

      <InputInfo
        modal_state={modal_state}
        start={startStr}
        end={endStr}
        floorStatus={togleBtn}
        refresh={getdata}
        onChange={inputFormControl}
      />
      {/* 수정폼 Props */}
      <Modify
        modifyModal={modify_state}
        onChange={updateFormControl}
        plan={planData}
        start={startStr}
        end={endStr}
        refresh={getdata}
        pwCheck={passwordCheck}
      />
      <Planner
        planList={planList}
        holidayList={holidayList}
        inputForm={inputFormControl}
        updateForm={updateFormControl}
        setPlanStatus={setPlanStatus}
        setStartStr={setStartStr}
        setEndStr={setEndStr}
        refresh={getdata}
        update={updatePlan}
        passwordCheck={passwordCheck}
        floorChange={setTogleBtn}
      ></Planner>
    </div>
  );
};

export default Calendar;
