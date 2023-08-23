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