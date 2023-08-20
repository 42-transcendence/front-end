"use client";

import { byteToReadable } from "./byteConversion";
import { useState, useRef } from "react";
import { DragDropArea } from "./DragDropArea";
import { ImageViewer } from "./ImageViewer";

type FileAcceptType = "image/*" | "video/*" | "audio/*";

// TODO: hooks 디렉토리로 분리?
function useFiles({
    options: { maxFileCount, maxFileSize },
}: {
    options: {
        maxFileCount?: number | undefined;
        maxFileSize?: number | undefined;
    };
}): [files: File[], handleFiles: (files: FileList | null) => void] {
    const [files, setFiles] = useState<File[]>([]);

    const clearInput = () => {
        setFiles([]);
    };

    const handleFiles = (files: FileList | null) => {
        if (files === null || files.length === 0) return;

        // check number of files
        if (maxFileCount !== undefined && files.length > maxFileCount) {
            alert(`최대 파일 개수: ${maxFileCount}`);
            clearInput();
            return;
        }

        // check file size
        if (maxFileSize !== undefined) {
            let fileSize = 0;
            for (const file of files) {
                fileSize += file.size;
                if (fileSize > maxFileSize) {
                    alert(`최대 파일 용량: ${byteToReadable(maxFileSize)}`);
                    clearInput();
                    return;
                }
            }
        }
        clearInput();

        const fileList: File[] = [];
        for (const file of files) {
            fileList.push(file);
        }
        setFiles(fileList);
    };

    return [files, handleFiles];
}

export function UploadBox({
    accept,
    maxFileCount,
    maxFileSize,
    previewImage,
}: {
    accept: FileAcceptType;
    maxFileCount: number;
    maxFileSize: number;
    previewImage: boolean;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isMultiple = maxFileCount > 1;
    const [files, handleFiles] = useFiles({
        options: {
            maxFileCount: maxFileCount,
            maxFileSize: maxFileSize,
        },
    });

    // TODO: css layout fix
    return (
        <div className="z-10 min-h-[250px] min-w-[250px] flex-shrink-0 snap-center snap-always overflow-hidden">
            <label
                htmlFor="avatar-uploader"
                className="relative z-10 flex h-full w-full flex-col"
            >
                <input
                    ref={inputRef}
                    type="file"
                    name="avatar-image"
                    id="avatar-uploader"
                    accept={accept}
                    multiple={isMultiple}
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFiles(e.target.files)
                    }
                />
                <DragDropArea handleFiles={handleFiles} />
                {previewImage && <ImageViewer uploadedFiles={files} />}
            </label>
        </div>
    );
}
