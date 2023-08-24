export function DragDropArea({
    handleFiles,
}: {
    handleFiles: (files: FileList | null) => void;
}) {
    // TODO: drag, dragover 필수인가?
    const handleDrag: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    // TODO: 현재 DragDropArea의 z index가 밀려서 드래그드롭 안되는듯
    //      ImageViewer 가리지 않으면서 drop event는 되게 하는 방법 있는지
    return (
        <div
            className="absolute flex h-full w-full flex-col justify-center text-center"
            onDrag={handleDrag}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            파일 선택
        </div>
    );
}
