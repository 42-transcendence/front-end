"use client"

// import { useState, useRef, useEffect } from "react";

export function UploadBox() {

    return (
        <div className="flex flex-col">
            <label htmlFor="profile-uploader" className="z-10 flex-shrink-0 snap-center snap-always overflow-hidden">
                <p>파일 선택</p>
                <input type="file" id="profile-uploader" accept="image/*" style={{ opacity: 0 }} />
            </label>
            <div ></div>
        </div>
    );
}
