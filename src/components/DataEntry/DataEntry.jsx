import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import styles from "./DataEntry.module.scss";
const { Dragger } = Upload;


function DataEntry({ changeFileName, resetData, getColumns, toast, API_URL}) {
  const beforeUpload = (file) => {
    const isLt25M = file.size / 1024 / 1024 <= 25;
    return new Promise((resolve, reject) => {
      const isDataset = file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isDataset) {
        toast.error("File type not supported. Please select again", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        reject(false);
      }
      
      // check the file size - you can specify the file size you'd like here:
      else if (!isLt25M) {
        toast.error("File size must be smaller than 25MB. Please select again", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        reject(false);
      }
      else{
        resolve(true);
      }
    });
  };
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: `${API_URL}/upload`,
    beforeUpload: beforeUpload,
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
        // message.error(`${info.file.name} file upload failed.`);
        toast.error(`${info.file.name} file upload failed.`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
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
          <p className="ant-upload-hint">
            Max file size: 25MB.
          </p>
        </div>
      </Dragger>
  );
}
export default DataEntry;
