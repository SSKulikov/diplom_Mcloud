import "./SuccessMessage.scss";

type Props = { message: string };

export default function SuccessMessage({ message }: Props) {
  return (
    <div className="success__message__wrapper">
      <div>{message}</div>
    </div>
  );
}
