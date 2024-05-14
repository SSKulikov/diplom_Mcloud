import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import FileItem from "../FileItem/FileItem";
import "./FIleList.scss";
import {
  get_files,
  setIsSendFile,
  setLastDropOn,
} from "../../../redux/MainSlice";
import AddNewFile from "../AddNewFileForm/AddNewFile";
import ChangeFileForm from "../ChangeFileForm/ChangeFileForm";
import ShareFileForm from "../ShareFileForm/ShareFileForm";
import Louder from "../../Louder/Louder";
import ErrorForm from "../../Messages/ErrorForm";
import ErrorMessage from "../../Messages/ErrorMessage";
import SuccessMessage from "../../Messages/SuccessMessage";

export default function FileList() {
  const errorMain = useAppSelector((state) => state.errorsGet.catalog);
  const error = useAppSelector((state) => state.error);
  const isLogin = useAppSelector((state) => state.token);
  const files = useAppSelector((state) => state.files);
  const isSendFile = useAppSelector((state) => state.isSendFile);
  const isChangeFile = useAppSelector((state) => state.isChangeFile);
  const isShareFile = useAppSelector((state) => state.isShareFile);
  const isLoading = useAppSelector((state) => state.loading.catalog);
  const authorization = useAppSelector((state) => state.authorization);
  const delFileLoading = useAppSelector((state) => state.loading.delFile);
  const infoMessage = useAppSelector((state) => state.infoMessage);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFile, setDragFIle] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin) {
      dispatch(get_files());
    }
  }, [isLogin, dispatch]);
  if (isLoading) {
    return <Louder />;
  } else {
    return (
      <div
        className={`container ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`file-list `}
          onClick={() => dispatch(setLastDropOn(null))}
        >
          {delFileLoading && <Louder />}
          {infoMessage && !isChangeFile.isActive && !authorization && (
            <SuccessMessage message={infoMessage} />
          )}
          {error && !isChangeFile.isActive && !authorization && !isSendFile && (
            <ErrorMessage message={error.message} />
          )}
          {files.map((el) => (
            <FileItem key={el.id} data={el} />
          ))}
          <FileItem
            key={"add"}
            data={{ file: "add", name: "Добавить файл", id: 0 }}
          />
          {errorMain && <ErrorForm data={errorMain} />}
        </div>
        {isSendFile && <AddNewFile file={dragFile} setDragFile={setDragFIle} />}
        {isChangeFile.isActive && (
          <ChangeFileForm
            name={isChangeFile.name!}
            desc={isChangeFile.description!}
          />
        )}
        {isShareFile.isShare && <ShareFileForm uuid={isShareFile.uuid!} />}
      </div>
    );
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    setDragFIle(file);
    dispatch(setIsSendFile());
  }
}
