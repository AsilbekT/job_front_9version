import { memo } from 'react';
import { GrClose } from 'react-icons/gr';

const Modal = (props) => {
  const {
    onClose,
    children,
    title,
    primaryAction,
    primaryActionTitle = 'Save'
  } = props;

  return (
    <>
      <div className="custom-backdrop" onClick={onClose} />
      <div className="custom-modal ls-widget">
        <div className="custom-modal__head">
          {title && (
            <span className="custom-modal__title">
              {title}
            </span>
          )}
          <button className="custom-modal__btn-close" onClick={onClose}>
            <GrClose />
          </button>
        </div>
        <div className="custom-modal__body">
          {children}
        </div>
        {typeof primaryAction === 'function' && (
          <div className="custom-modal__footer">
            <button className="theme-btn btn-style-two" onClick={onClose}>
              Close
            </button>
            <button className="theme-btn btn-style-one" onClick={primaryAction}>
              {primaryActionTitle}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Modal);