import { FC, FormEvent, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import styles from "../styles/modules/popup.module.scss";
import loader from "../styles/modules/loader.module.scss";
import Button from "./Button";
import { Todo } from "../types/types";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { addTodo, updateTodo } from "../redux/slices/todoSlice";

const dropIn = {
  hidden: {
    opacity: 0,
    transform: "scale(0.9)",
  },
  visible: {
    transform: "scale(1)",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: "scale(0.9)",
    opacity: 0,
  },
};

interface PopupProps {
  type: string;
  modalOpen: boolean;
  todo?: Todo;
  setModalOpen: (arg: boolean) => void;
}

const Popup: FC<PopupProps> = ({ type, modalOpen, setModalOpen, todo }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [status, setStatus] = useState("success");
  const { loadingAdd, loadingUpdate, errorAddOrUpdate } = useAppSelector(
    (state) => state.todo
  );
  const [handle, setHandle] = useState(false);
  useEffect(() => {
    if (type === "update" && todo) {
      setTitle(todo.title);
      setDesc(todo.description);
      setStatus(todo.status);
    }
    console.log(type);
    if (type === "add") {
      setTitle("");
      setDesc("");
      setStatus("pending");
    }
  }, [type, todo]);

  useEffect(() => {
    if (errorAddOrUpdate) {
      toast.error("Ошибка");
    }
    if (handle && type === "add" && !loadingAdd) {
      toast.success("Задача добавлена");
      setModalOpen(false);
      setHandle(false);
    }
    if (handle && type === "update" && !loadingUpdate) {
      toast.success("Задача обновлена");
      setModalOpen(false);
      setHandle(false);
    }
  }, [handle, setModalOpen, loadingAdd, loadingUpdate, type, errorAddOrUpdate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title === "") {
      toast.error("Введите заголовок задачи");
      return;
    }
    if (description === "") {
      toast.error("Введите описание задачи");
      return;
    }
    if (title && status && description) {
      if (type === "add") {
        setHandle(true);
        dispatch(
          addTodo({
            title,
            description,
            status,
          })
        );
      }
      if (type === "update") {
        if (
          todo?.title !== title ||
          todo?.status !== status ||
          todo?.description !== description
        ) {
          setHandle(true);
          dispatch(
            updateTodo({
              title,
              description,
              status,
              id: todo!.id,
              createdAt: todo!.createdAt,
              updatedAt: todo!.updatedAt,
            })
          );
        } else {
          toast.error("Внесите изменения");
          return;
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === "add" ? "Добавить" : "Изменить"} задачу
              </h1>
              <label htmlFor="title">
                Заголовок задачи
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="description">
                Описание задачи
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </label>
              <label htmlFor="status">
                Статус задачи
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Ожидает выполнения</option>
                  <option value="progress">В процессе</option>
                  <option value="success">Выполнено</option>
                </select>
              </label>
              <div className={styles.buttonContainer}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loadingAdd || loadingUpdate}
                >
                  {loadingAdd || loadingUpdate ? (
                    <span className={loader.loader} />
                  ) : type === "add" ? (
                    "Добавить"
                  ) : (
                    "Сохранить"
                  )}
                </Button>
                <Button onClick={() => setModalOpen(false)}>Отмена</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
