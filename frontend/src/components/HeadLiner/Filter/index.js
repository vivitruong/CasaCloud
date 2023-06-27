import { useState } from "react";
import { Modal } from '../../../context/Modal.js'
import Filterbox from "./Filter";

const FilterModal = ({dispatch}) => {
    const [showModal, setShowModal] = useState(false);

    return (
      <div className="spothead-icon filter-box">
        <div onClick={() => setShowModal(true)} className="filter-span" >
          <span>Filter</span>
        </div>
        {showModal && (
          <Modal>
                    <Filterbox onClose={() => setShowModal(false)} dispatch={dispatch} />
          </Modal>
        )}
      </div>
    );

}

export default FilterModal;
