import { AnimatePresence, motion } from "framer-motion";
import styles from "../styles/modules/todolist.module.scss";
import TodoItem from "./TodoItem";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { useEffect, useState } from "react";
import { fetchAll, updatePages } from "../redux/slices/todoSlice";
import toast from "react-hot-toast";
import { Query } from "../types/types";
import ReactPaginate from "react-paginate";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const TodoList = () => {
  const dispatch = useAppDispatch();
  const {
    todoList,
    count,
    page,
    limit,
    error,
    loading,
    errorDelete,
    filterStatus,
  } = useAppSelector((state) => state.todo);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (selectedItem: { selected: number }) => {
    dispatch(updatePages(selectedItem.selected + 1));
  };
  useEffect(() => {
    setTotalPages(Math.ceil(count / limit));
  }, [count, limit]);

  useEffect(() => {
    const obj: Query = {
      page,
      limit,
      status: filterStatus,
    };
    dispatch(fetchAll(obj));
  }, [dispatch, filterStatus, limit, page, count]);

  useEffect(() => {
    if (error) {
      toast.error(`Ошибка при загрузке`);
    }
    if (errorDelete) {
      toast.error("Ошибка при удалении");
    }
  }, [error, errorDelete]);

  const filteredTodoList = todoList.filter((item) => {
    if (filterStatus === "all") {
      return true;
    }
    return item.status === filterStatus;
  });

  return (
    <>
      <motion.div
        className={styles.content__wrapper}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {loading ? (
            <span className={styles.loader} />
          ) : filteredTodoList.length > 0 ? (
            filteredTodoList.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          ) : (
            <motion.p variants={child} className={styles.emptyText}>
              Нет задач
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <ReactPaginate
        className={styles.pagination}
        activeClassName={styles.active}
        pageLinkClassName={styles.link}
        previousClassName={styles.link}
        nextClassName={styles.link}
        nextLabel=">"
        previousLabel="<"
        disabledClassName={styles.disabled}
        disabledLinkClassName={styles.disabled}
        onPageChange={handlePageChange}
        pageRangeDisplayed={1}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default TodoList;
