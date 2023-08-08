import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import styles from "./DataEntry.module.scss";
const { Dragger } = Upload;

// const DataEntry = ({changeFileName}) => (

// );
function DataEntry({ changeFileName, resetData, getColumns, toast}) {
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "http://127.0.0.1:5000",
    onChange(info) {
      const { status } = info.file;
      changeFileName("");
      resetData();
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if(info.file.response["status"] === "failed"){
          toast.error(info.file.response["msg"], {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          return;
        }
        toast.success(`${info.file.name} file uploaded successfully.`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        changeFileName(`${info.file.name}`);
        getColumns(info.file.response["columns"]);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onRemove() {
      changeFileName("");
      resetData();
    },
  };
  return (
      <Dragger {...props}>
        <div className={styles.boundary}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload only. Strictly prohibited from uploading
            company data or other banned files.
          </p>
          <p className="ant-upload-hint">
            Supported file extension: *.csv, *.xlsx.
          </p>
        </div>
      </Dragger>
  );
}
export default DataEntry;
