import { Action } from "@reduxjs/toolkit";
import "./ErrorForm.scss";
import { useAppDispatch } from "../../models/hooks";

type Props = { data: { status: string; message: string; action: Action } };

export default function ErrorForm({ data }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="error__form__wrapper">
      <div>{data.message}</div>
      <button
        onClick={() => {
          dispatch(data.action);
        }}
      >
        Повторить
      </button>
    </div>
  );
}
