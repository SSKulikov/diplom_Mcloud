import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { setIsChangeFile, update_file } from "../../../redux/MainSlice";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import "./ChangeFileForm.scss";
import ErrorMessage from "../../Messages/ErrorMessage";
import SuccessMessage from "../../Messages/SuccessMessage";

type Props = { name: string; desc: string };

export default function ChangeFileForm({ name, desc }: Props) {
  const errorChange = useAppSelector((state) => state.error);
  const infoMessage = useAppSelector((state) => state.infoMessage);
  const [fileName, setFileName] = useState<string>("");
  const [fileDescription, setFileDescription] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setFileName(name);
    setFileDescription(desc);
  }, [name, desc]);

  return (
    <div className="change-form__wrapper">
      <form className="change-form" onSubmit={submitForm}>
        {errorChange && <ErrorMessage message={errorChange.message} />}
        {infoMessage && <SuccessMessage message={infoMessage} />}

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
        <div className="change-form__control">
          <button type="submit">Сохранить</button>
          <button className="cancel" onClick={handleClose}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );

  function submitForm(evt: FormEvent) {
    evt.preventDefault();

    const changeData = {
      name: fileName,
      description: fileDescription,
    };
    dispatch(update_file(changeData));
  }

  function handleFileNameChange(e: ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.value);
  }
  function handleFileDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFileDescription(e.target.value);
  }
  function handleClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    console.log(e);
    const target = e.target as HTMLElement;
    (
      (target.parentNode as HTMLFormElement).parentNode as HTMLFormElement
    ).remove();

    dispatch(setIsChangeFile({}));
  }
}
