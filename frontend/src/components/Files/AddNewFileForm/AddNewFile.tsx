import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./AddNewFile.scss";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { send_file, setIsSendFile } from "../../../redux/MainSlice";
import ErrorMessage from "../../Messages/ErrorMessage";

type Props = {
  file: File | null;
  setDragFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function AddNewFile({ file, setDragFile }: Props) {
  const dispatch = useAppDispatch();
  const errorChange = useAppSelector((state) => state.error);
  const [fileName, setFileName] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  useEffect(() => {
    if (file) {
      setFileName(file.name.split(".")[0]);
    }
  }, [file]);

  return (
    <div className="new-form__wrapper">
      <form className="new-form" onSubmit={submitForm}>
        {errorChange && <ErrorMessage message={errorChange.message} />}

        <label>
          Название
          <input value={fileName} onChange={handleFileNameChange}></input>
        </label>
        <label>
          Описание
          <textarea
            value={fileDescription}
            onChange={handleFileDescriptionChange}
          ></textarea>
        </label>
        <label>
          Файл
          <input
            type="file"
            id="new_from_file"
            disabled={Boolean(file)}
          ></input>
        </label>
        <div className="new-form__control">
          <button type="submit">Отправить</button>
          <button className="cancel" onClick={handleClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );

  function submitForm(evt: FormEvent) {
    evt.preventDefault();

    const formDataText = {
      name: fileName,
      description: fileDescription,
      file: file
        ? file
        : (evt.target as HTMLFormElement).new_from_file.files[0],
    };

    dispatch(send_file(formDataText));
    setDragFile(null);
  }

  function handleFileNameChange(e: ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.value);
  }
  function handleFileDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFileDescription(e.target.value);
  }
  function handleClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    (target.parentNode as HTMLFormElement).remove();

    dispatch(setIsSendFile());
  }
}
