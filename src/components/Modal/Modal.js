import React from 'react'
import './Modal.css'
function Modal({onConfirm, onCancel,title, children, canCancel, canConfirm, confirmText}) {

    return (
        <div className='modal'>
            <header className="modal__header"><h1>{title}</h1></header>
            <section className="modal__content">
                {children}
            </section>
            <section className="modal__actions">
                {canCancel && <button onClick = {onCancel} className='btn'>Cancel</button>}
                {canConfirm && <button onClick = {onConfirm} className='btn'>{confirmText}</button>}
            </section>
        </div>
    )
}

export default Modal
