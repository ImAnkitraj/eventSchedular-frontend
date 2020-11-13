import React from 'react'
import EventItem from './EventItem/EventItem'
import './EventList.css'
function EventList({events, authUserId, onShare, onDetail}) {
    const eventsListEl = events.map(event => <EventItem onDetail={onDetail} onShare = {onShare} userId = {authUserId} key = {event._id} event={event}/>)
    return (
        <ul className='event__list'>
            {eventsListEl}
        </ul>
    )
}

export default EventList
