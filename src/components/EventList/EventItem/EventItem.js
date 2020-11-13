import React from 'react'
import './EventItem.css'

export default function EventItem({event, userId, onShare, onDetail}) {

    return (
        <li key = {event._id} className='events__list-item'>
            <div>
                <h1>{event.title}</h1>
                <div className = 'events_list-date'>
                    <h2>{new Date(event.start).toLocaleDateString()}</h2><h2>&nbsp;-&nbsp;</h2><h2>{new Date(event.end).toLocaleDateString()}</h2>
                </div>
            </div>
            <div>
                {
                    userId !== event.creator._id ?
                    <p></p>
                    :
                    <button className='btn' onClick = {()=>onShare(event._id)}>Share Event</button>
                }
                    <button className='btn' onClick = {()=>onDetail(event)}>Event Details</button>
                
            </div>
        </li>
    )
}
