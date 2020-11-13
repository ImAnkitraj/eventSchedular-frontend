import React from 'react'
import './Calendar.css'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import BackDrop from '../../components/Backdrop/Backdrop';
import Modal from '../../components/Modal/Modal';
import authContext from '../../context/auth-context'
import Loader from '../../components/Loaders/Loader';
import EventList from '../../components/EventList/EventList';

function Calendar() {
    const context = React.useContext(authContext);
    const [errorText, setErrorText] = React.useState('');
    const [isError, setIsError] = React.useState(false);
    const [calendarEvents, setCalendarEvents] = React.useState([]);
    const [shareUserId, setShareUserId] = React.useState('');
    const [event, setEvent] = React.useState([])
    const [shareEventId, setShareEventId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalEventOpen, setEventModalOpen] = React.useState(false)
    const [modalDetailOpen, setDetailModalOpen] = React.useState(false)
    const [modalShareOpen, setShareModalOpen] = React.useState(false)
    const [title, setTitle] = React.useState('');
    const [start, setStart] = React.useState('');
    const [end, setEnd] = React.useState('');
    const [events, setEvents] = React.useState([])
    const [description, setDescription] = React.useState('');

    React.useEffect(()=>{
        fetchEvents();
    },[])

    const fetchEvents = () => {
        setIsLoading(true);
        const  requestBody = {
            query: `
                query UserEvents($userId: ID!){
                    userEvents(userId: $userId){
                        title
                        _id
                        start
                        end
                        description
                        creator{
                            _id
                            email
                        }
                    }
                }
            `,
            variables: {
                userId: context.userId,
            }
        }
        const token = context.token;
        fetch('https://eventschedular.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log('fetch result ',resData);
            setIsLoading(false);
            return resData.data.userEvents;
        })
        .then((eve)=>{
            setEvents(eve);
            const calE = []
            eve.map(e => {
                calE.push({
                    id:e._id,
                    start: new Date(`${e.start}`).toISOString(),
                    end: new Date(`${e.end}`).toISOString(),
                    title: e.title,
                    color:'#'+Math.random().toString(16).substr(2,6) 
                })
            })
            setCalendarEvents(calE)
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false);
        })
    }

    console.log('after setting state events', calendarEvents,events)

    console.log('events',events)
    const addEvent = () => {
        console.log(title, end, start, description)
        if(title?.trim() === 0 || start?.trim() === 0|| end?.trim() === 0 || description?.trim() === 0){
            return;
        }
        const event = {title, end, start, description};
        console.log(event);

        const  requestBody = {
                query: `
                    mutation {
                        createEvent(eventInput: {title: "${title}",start: "${start}", end: "${end}",description: "${description}"}){
                            _id
                            title
                            start
                            description
                            end
                        }
                    }
                `,
            }

        const token = context.token;
        console.log(token)
        fetch('https://eventschedular.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData);
            const updatedEvents = [...events];
            updatedEvents.push({
                _id: resData.data.createEvent._id,
                title: resData.data.createEvent.title,
                description: resData.data.createEvent.description,
                start: resData.data.createEvent.start,
                end: resData.data.createEvent.end,
                creator: {
                    _id:context.userId,
                }
            })
            setEvents(updatedEvents);
        })
        .catch(err => {
            setErrorText("Something went wrong")
            setIsError(true)
            console.log(err)
        })
        setEventModalOpen(false);
    }

    const onShare = (eventId) => {
        setShareModalOpen(true);
        setShareEventId(eventId);
    }

    const onDetail = (event) => {
        setDetailModalOpen(true);
        setEvent(event);
    }
    
    const addShareHolder = () => {
        if(email?.trim() === 0){
            return;
        }
        const  reqBody = {
            query: `
                query {
                    user(email: "${email}"){
                        userId
                    }
                }
            `,
        }
        
        const token = context.token;
        fetch('https://eventschedular.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data.user);
            setIsLoading(false);
            return resData.data.user;
        })
        .then((usr)=>{
            console.log(usr.userId)
            setShareUserId(usr.userId);
        })
        .catch(err => {
            // console.log("user email wrong",err)
            setIsLoading(false);
        })

        const  requestBody = {
            query:`
                mutation {
                    addShareHolders(addShareHoldersInput:{userId: "${shareUserId}", eventId:"${shareEventId}"}){
                        _id
                        title
                        start
                        description
                        end
                    }
                }
            `,
        }

        fetch('https://eventschedular.herokuapp.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then( res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData)
        })
        .catch(err => {
            console.log(err)
        })
        setShareModalOpen(false);
    }


    return (
        <>
        
        {modalEventOpen && <BackDrop/>}
        {modalEventOpen && <Modal 
            canCancel 
            canConfirm 
            onCancel={()=>setEventModalOpen(false)}
            onConfirm={addEvent}
            title="Add Event"
            confirmText='+ Create'
        >
           <form>
                <div className='form-control'>
                    <label htmlFor="title" className='modal-label'>Title</label>
                    <input type="text" id="title" onChange={(e)=>setTitle(e.target.value)}value={title}/>
                </div>
                <div className='form-control'>
                    <label htmlFor="date" className='modal-label'>Start</label>
                    <input type="datetime-local" id="date" onChange={(e)=>setStart(e.target.value)}value={start}/>
                </div>
                <div className='form-control'>
                    <label htmlFor="date" className='modal-label'>End</label>
                    <input type="datetime-local" id="date" onChange={(e)=>setEnd(e.target.value)}value={end} />
                </div>
                <div className='form-control'>
                    <label htmlFor="description" className='modal-label'>Description</label>
                    <textarea type="text" rows='4'onChange={(e)=>setDescription(e.target.value)} value={description} id="description"/>
                </div>
            </form>
        </Modal>}
        {modalShareOpen && <BackDrop/>}
        {modalShareOpen && <Modal 
            canCancel 
            canConfirm 
            onCancel={()=>setShareModalOpen(false)}
            onConfirm={addShareHolder}
            confirmText='Share'
        >
            <form>
                <div className='form-control'>
                    <label htmlFor="email" className='modal-label'>Email </label>
                    <input type="email" id="email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                </div>
            </form>
        </Modal>}

        {modalDetailOpen && <BackDrop/>}
        {modalDetailOpen && <Modal 
            canCancel 
            onCancel={()=>setDetailModalOpen(false)}
            title={event.title}
        >
            <h2 style={{display:"flex", marginTop:"1rem",marginBottom:"0.5rem",color:"gray", fontSize:"0.6rem"}}>{event.creator.email}</h2>
            <div style={{display:"flex", color:"gray", fontSize:"0.8rem"}}>
                <h2>{new Date(event.start).toLocaleDateString()}</h2><h2>&nbsp; - &nbsp;</h2><h2>{new Date(event.end).toLocaleDateString()}</h2>
            </div>

            <p style={{marginTop:"1rem",color:"black"}}>{event.description}</p>
        </Modal>}


        <div className='container'>
            <ul onClick={()=>{setEventModalOpen(true)}}className='calendar-actions'> 
                <li style={{fontSize:"40px"}} >+</li>
            </ul>
            <div className='calendar-container'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    weekends={true}
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    events={[...calendarEvents]}
                />
            </div>
            <center>{isLoading  && <Loader/>}</center>
            <center style={{marginTop:"1rem"}}><h1>My Events</h1></center>
            <EventList events={events} onDetail={onDetail} onShare={onShare} authUserId={context.userId}/>
        </div>
        </>
    )
}

export default Calendar
