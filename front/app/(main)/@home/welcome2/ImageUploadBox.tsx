import { byteToReadable } from "./byteConversion";
import { useRef, useEffect, useState } from "react";
import { DragDropArea } from "./DragDropArea";
import Image from "next/image";

type ImageInfoType = {
    src: string;
    alt: string;
    name: string;
};

export function ImageUploadBox({
    maxFileSize,
    setImage,
}: {
    maxFileSize?: number | undefined;
    setImage: (target: HTMLImageElement) => void;
}) {
    const [imageInfo, setImageInfo] = useState<ImageInfoType>({
        src: "/jisookim.png", // TODO: placeholder image
        alt: "uploaded file",
        name: "uploaded file",
    });

    const handleFiles = (fileList: FileList | null) => {
        if (fileList === null || fileList.length === 0) return;

        if (fileList.length !== 1) {
            alert("한 개의 파일만 올려주세요");
            return;
        }

        const firstFile = fileList[0];

        // check firstFile size
        if (maxFileSize !== undefined && firstFile.size > maxFileSize) {
            alert(`최대 파일 용량: ${byteToReadable(maxFileSize)}`);
            return;
        }

        URL.revokeObjectURL(imageInfo.src);

        setImageInfo({
            src: URL.createObjectURL(firstFile),
            alt: `업로드한 파일: ${firstFile.name}`,
            name: firstFile.name,
        });
    };

    return (
        <div className="z-10 min-h-[250px] min-w-[250px] flex-shrink-0 snap-center snap-always overflow-hidden">
            <label
                htmlFor="avatar-uploader"
                className="relative z-10 flex h-full w-full flex-col"
            >
                <input
                    type="file"
                    name="avatar-image"
                    id="avatar-uploader"
                    accept="image/*"
                    className="hidden"
                    multiple={false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleFiles(e.target.files);
                    }}
                />
                <DragDropArea handleFiles={handleFiles} />
                <PreviewArea imageInfo={imageInfo} setImage={setImage} />
            </label>
        </div>
    );
}

function PreviewArea({
    imageInfo,
    setImage,
}: {
    imageInfo: ImageInfoType;
    setImage: (image: HTMLImageElement) => void;
}) {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const oldElem = imageRef.current;
        if (oldElem === null) {
            return;
        }

        oldElem.onload = () => {
            const newElem = oldElem.cloneNode(true) as HTMLImageElement;
            newElem.onload = () => setImage(newElem);
        };
    }, [setImage]);

    return (
        <div className="absolute h-full w-full">
            <Image
                ref={imageRef}
                className="box-content"
                src={imageInfo.src}
                alt={imageInfo.alt}
                data-name={imageInfo.name}
                width="250"
                height="250"
            />
        </div>
    );
}
