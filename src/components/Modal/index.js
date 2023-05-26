import React from 'react'

const MODAL_STYLES = {
    height: '80vh',
    width: '80vw',
    backgroundColor: '#FFF',
    margin: 'auto',
    marginTop: '100px',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

export default function Modal({ open, onClose, children }) {

    if (!open) return null

    return (
        <>
            <div style={OVERLAY_STYLES}>
                <div style={MODAL_STYLES}>
                    {children}
                    <div style={{width: '80vw',  display: 'flex'}}>
                        <button className="btn-close-help" onClick={onClose}>Fermer l'aide</button>
                    </div>
                </div>
            </div>
        </>
    )
}
