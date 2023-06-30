import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import { EditSpotForm } from './EditSpot';
export default function EditSpotModal({spot}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}className='btn-update'>Update</button>
      {showModal && (
        <Modal>
          <EditSpotForm spot={spot} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}
