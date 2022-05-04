import { Calendar } from "fullcalendar";
import { useEffect, useState } from "react";
import "./SignUp.css"
import axios from "axios";

function SignUp () {

const [users, setUsers] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const fetchUsers = async() => {
    try{
        setError(null)
        setUsers(null)
        setLoading(true)

        const response = await axios.get(
            'http://data.ex.co.kr/openapi/trafficapi/nationalTrafficVolumn?key=8591349948&type=json&sumDate=20211113'
        );
        setUsers(response.data) //데이터는 response.data 안에 들어가 있다 
    } catch (e){
        setError(e)
    }
    setLoading(false)
}

useEffect (() => {
    fetchUsers();
}, [])

if(loading) return <div>로딩중...</div>
if(error) return <div>에러가 발생</div>

if(!users) return null;

    return(
        <div>
            <ul>
                {users.map(user =>(
                    <li>
                        {user.carType} ({user.trafficVolumn})
                </li>))}
            </ul>

            <button onClick={fetchUsers}>다시불러오기</button>
        </div>
    );
}

export default SignUp;