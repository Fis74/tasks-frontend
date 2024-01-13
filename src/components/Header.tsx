import React, { useEffect, useState } from "react";
import Button, { SelectButton } from "./Button";
import styles from "../styles/modules/todolist.module.scss";
import Popup from "./Popup";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { updateFilterStatus } from "../redux/slices/todoSlice";
import { Status, Type } from "../types/types";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { filterStatus } = useAppSelector((state) => state.todo);
  const [filter, setFilter] = useState<Status>(filterStatus);
  const dispatch = useAppDispatch();

  const updateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as Status);
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
        <option value={Status.all}>Все</option>
        <option value={Status.success}>Выполнено</option>
        <option value={Status.progress}>В процессе</option>
        <option value={Status.pending}>Ожидает выполнения</option>
      </SelectButton>
      {modalOpen && (
        <Popup
          type={Type.add}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
};

export default Header;
