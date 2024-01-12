import React, { useEffect, useState } from "react";
import Button, { SelectButton } from "./Button";
import styles from "../styles/modules/todolist.module.scss";
import Popup from "./Popup";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { updateFilterStatus } from "../redux/slices/todoSlice";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { filterStatus } = useAppSelector((state) => state.todo);
  const [filter, setFilter] = useState(filterStatus);
  const dispatch = useAppDispatch();

  const updateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    dispatch(updateFilterStatus(filter));
  }, [dispatch, filter]);

  return (
    <div className={styles.Header}>
      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Добавить задачу
      </Button>
      <SelectButton
        id="status"
        onChange={(e) => updateFilter(e)}
        value={filter}
      >
        <option value="all">Все</option>
        <option value="success">Выполнено</option>
        <option value="progress">В процессе</option>
        <option value="pending">Ожидает выполнения</option>
      </SelectButton>
      {modalOpen && (
        <Popup type="add" modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
    </div>
  );
};

export default Header;
