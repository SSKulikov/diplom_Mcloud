import { File_data } from "../../../models/models";
import { sizeValidator, timeConverter } from "../../../utils/utils";
import "./FIleItemAdmin.scss";
import { useAppDispatch } from "../../../models/hooks";
import { del_files, setIsChangeFile } from "../../../redux/MainSlice";
import { useRef, useState } from "react";

type Props = { data: File_data };

export default function FIleItemAdmin({ data }: Props) {
  const [detailActive, setDetailActive] = useState(false);
  const detail = useRef(null);
  const dispatch = useAppDispatch();

  return (
    <div className="admin__fileItem">
      <span>{"Название : " + data.name + ", "}</span>
      <span>{"Размер файла : " + sizeValidator(data.size) + ","}</span>
      <span>{"Скачан : " + data.download_counter + ","}</span>
      <span>{"Последнее скачивание : " + timeConverter(data.download_at)}</span>
      <button className="admin__fileItem__info-btn" onClick={toggle}>
        {detailActive ? " Скрыть " : "Подробнее..."}
      </button>

      <br />
      <div className="admin__fileItem__info hidden" ref={detail}>
        <br />
        <label>
          Дата создания :
          <br />
          <span>{timeConverter(data.created_at)}</span>
        </label>

        <label>
          Описание :
          <br />
          <span>{data.description}</span>
        </label>
      </div>

      <div className="fileItem__control">
        <button className="redact" onClick={updateFile}>
          ✏
        </button>
        <button className="del" onClick={delFile}>
          ❌
        </button>
      </div>
    </div>
  );

  function delFile() {
    dispatch(del_files(data.id));
  }
  function toggle() {
    if (detail.current) {
      (detail.current as HTMLDivElement).classList.toggle("hidden");
    }
    setDetailActive(!detailActive);
  }
  function updateFile() {
    const dataInfo = {
      name: data.name,
      description: data.description,
      id: String(data.id),
    };
    dispatch(setIsChangeFile(dataInfo));
  }
}
