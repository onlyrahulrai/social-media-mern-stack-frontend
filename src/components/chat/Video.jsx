import React, { useEffect, useRef } from 'react'

const Video = () => {
    const localVideoRef = useRef(null);

    useEffect(() => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, function (stream) {
            localVideoRef.current.srcObject = stream;

            localVideoRef.current.addEventListener("loadedmetadata", () => {
                localVideoRef.current.play()
            })
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    }, [])

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "70vh" }}>
            <div className="row w-100 justify-content-center" style={{ height: "42vh" }}>
                <div className="col-md-4" style={{ width: "50%",height:"100%" }}>
                    <video ref={localVideoRef} width="100%" height="100%" />
                </div>
                <div className="col-md-4" style={{ width: "50%" }} >

                </div>
            </div>
        </div>
    )
}

export default Video