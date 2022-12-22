import React from "react";
import { styled, Box } from "@mui/system";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import "./dialog.css";
const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;
const Dialog = ({ open, title, content, handleCancel, handleAction }) => {
  return (
    <StyledModal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleCancel}
      BackdropComponent={Backdrop}
    >
      <div className="dialog-container">
        <div className="dialog-heading">
          <h3>{title}</h3>
          <i onClick={handleCancel} class="bx bx-x dialog-x"></i>
        </div>
        <div className="dialog-body">
          <p>{content}</p>
        </div>
        <div className="dialog-footer">
          <button
            onClick={() => {
              handleCancel();
            }}
            className="dialog-btn-cancel"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              handleAction();
            }}
            className="dialog-btn-ok"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </StyledModal>
  );
};

export default Dialog;
