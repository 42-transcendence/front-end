"use client";

import { byteToReadable } from "./byteConversion"
import { useState, useRef, useEffect } from "react";
import { DragDropArea } from "./DragDropArea"

type FileAcceptType = "image/*" | "video/*" | "audio/*";

export function UploadBox({
    accept,
    maxFileCount,
    maxFileSize,
}: {
    accept: FileAcceptType;
    maxFileCount: number;
    maxFileSize: number,
}) {
    const [filenames, setFilenames] = useState(""); // TODO: for debugging purpose
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const isMultiple = maxFileCount > 1;

    const clearInput = () => {
        setFilenames("");
        setUploadedFiles([]);
        if (previewRef.current !== null) {
            while (previewRef.current.firstChild !== null) {
                previewRef.current.removeChild(previewRef.current.firstChild);
            }
        }
    }

    const handleFiles = (files: FileList | null) => {
        if (files === null || files.length === 0) return;

        // check number of files
        if (files.length > maxFileCount) {
            alert(`최대 파일 개수: ${maxFileCount}`);
            clearInput();
            return;
        }

        // check file size
        let fileSize = 0;
        for (const file of files) {
            fileSize += file.size;
            if (fileSize > maxFileSize) {
                alert(`최대 파일 용량: ${byteToReadable(maxFileSize)}`);
                clearInput();
                return;
            }
        }

        clearInput();

        const fileList: File[] = []
        for (const file of files) {
            fileList.push(file);
        }

        setUploadedFiles(fileList);
        setFilenames(fileList.map((x) => x.name).join(" ")); // TODO: for debugging purpose

        if (previewRef.current === null) return;

        for (const file of fileList) {
            if (!file.type.startsWith("image/")) { //TODO: is this validation neccessary?
                continue;
            }

            const img = document.createElement("img");
            img.classList.add("obj");
            img.src = URL.createObjectURL(file);
            previewRef.current.appendChild(img);
        }
    }

    // TODO: css layout fix
    return (
        <div className="flex flex-col">
            <label
                htmlFor="avatar-uploader"
                className="z-10 h-full w-full flex-shrink-0 snap-center snap-always overflow-hidden bg-yellow-500"
            >
                <input
                    ref={inputRef}
                    type="file"
                    name="avatar-image"
                    id="avatar-uploader"
                    accept={accept}
                    multiple={isMultiple}
                    style={{ opacity: 0 }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
                />
                <DragDropArea handleFiles={handleFiles} />
                <div ref={previewRef} className="bg-blue-500"></div>
            </label>
            <div>{filenames}</div>
        </div>
    );
}
