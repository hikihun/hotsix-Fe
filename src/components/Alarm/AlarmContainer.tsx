import AlarmDiv from "./AlarmDiv";

interface isDeleteMode {
  isDeleteMode: boolean;
}

const AlarmContainer = (props: isDeleteMode) => {
  return (
    <div className=" flex flex-col flex-grow ">
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
      <AlarmDiv isDeleteMode={props.isDeleteMode} />
    </div>
  );
};

export default AlarmContainer;
