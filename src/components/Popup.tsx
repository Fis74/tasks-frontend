import { FC, FormEvent, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import styles from "../styles/modules/popup.module.scss";
import loader from "../styles/modules/loader.module.scss";
import Button, { SelectButton } from "./Button";
import { Status, Todo, Type } from "../types/types";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { addTodo, updateTodo } from "../redux/slices/todoSlice";
import { formatRelative, subDays } from "date-fns";
import { ru } from "date-fns/locale";

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
  const [status, setStatus] = useState<Status>(Status.pending);
  const { loadingAdd, loadingUpdate, errorAddOrUpdate } = useAppSelector(
    (state) => state.todo
  );
  const [handle, setHandle] = useState(false);
  useEffect(() => {
    if (type === Type.update && todo) {
      setTitle(todo.title);
      setDesc(todo.description);
      setStatus(todo.status);
    }

    if (type === Type.add) {
      setTitle("");
      setDesc("");
      setStatus(Status.pending);
    }
  }, [type, todo]);

  useEffect(() => {
    if (errorAddOrUpdate) {
      toast.error("Ошибка");
    }
    if (handle && type === Type.add && !loadingAdd) {
      toast.success("Задача добавлена");
      setModalOpen(false);
      setHandle(false);
    }
    if (handle && type === Type.update && !loadingUpdate) {
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
      if (type === Type.add) {
        setHandle(true);
        dispatch(
          addTodo({
            title,
            description,
            status,
          })
        );
      }
      if (type === Type.update) {
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
              updatedAt: new Date(),
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
                {type === Type.add ? "Добавить" : "Изменить"} задачу
              </h1>
              <p className={styles.time}>
                {type === Type.update &&
                  "Создано: " +
                    formatRelative(
                      subDays(new Date(todo!.createdAt), 0),
                      new Date(),
                      { locale: ru }
                    )}
              </p>
              <p className={styles.time}>
                {type === Type.update &&
                  new Date(todo!.updatedAt).getTime() >
                    new Date(todo!.createdAt).getTime() &&
                  "Редактировано: " +
                    formatRelative(
                      subDays(new Date(todo!.updatedAt), 0),
                      new Date(),
                      { locale: ru }
                    )}
              </p>
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
                <SelectButton
                  id="status"
                  onChange={(e) => setStatus(e.target.value as Status)}
                  value={status}
                >
                  <option value={Status.pending}>Ожидает выполнения</option>
                  <option value={Status.progress}>В процессе</option>
                  <option value={Status.success}>Выполнено</option>
                </SelectButton>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" disabled={loadingAdd || loadingUpdate}>
                  {loadingAdd || loadingUpdate ? (
                    <span className={loader.loader} />
                  ) : type === Type.add ? (
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
