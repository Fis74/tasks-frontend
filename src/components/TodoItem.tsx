import { formatRelative, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import styles from "../styles/modules/todoItem.module.scss";
import { getClasses } from "../utils/getClasses";
import Popup from "./Popup";
import { Todo } from "../types/types";
import { deleteTodo } from "../redux/slices/todoSlice";
import { useAppDispatch } from "../hooks/hook";
import { FiActivity } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { FiClock } from "react-icons/fi";

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  return (
    <>
      <motion.div className={styles.item} variants={child}>
        <div className={styles.todoDetails}>
          {todo.status === "success" ? (
            <div className={styles.icon}>
              <FiCheck />
            </div>
          ) : todo.status === "pending" ? (
            <div className={styles.icon}>
              <FiClock />
            </div>
          ) : (
            <div className={styles.icon}>
              <FiActivity />
            </div>
          )}
          <div className={styles.texts}>
            <p className={getClasses([styles.todoText])}>{todo.title}</p>
            <p className={styles.description}>{todo.description}</p>
            <p className={styles.time}>
              {formatRelative(
                subDays(new Date(todo.createdAt), 0),
                new Date(),
                { locale: ru }
              )}
            </p>
          </div>
        </div>
        <div className={styles.todoActions}>
          <div
            className={styles.icon}
            onClick={() => handleUpdate()}
            onKeyDown={() => handleUpdate()}
            tabIndex={0}
            role="button"
          >
            <MdEdit />
          </div>
          <div
            className={styles.icon}
            onClick={() => handleDelete()}
            onKeyDown={() => handleDelete()}
            tabIndex={0}
            role="button"
          >
            <MdDelete />
          </div>
        </div>
      </motion.div>
      {updateModalOpen && (
        <Popup
          type="update"
          modalOpen={updateModalOpen}
          setModalOpen={setUpdateModalOpen}
          todo={todo}
        />
      )}
    </>
  );
};

export default TodoItem;
