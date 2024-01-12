import { Toaster } from "react-hot-toast";
import TodoList from "./components/TodoList";
import Header from "./components/Header";
import styles from "./styles/modules/todolist.module.scss";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./styles/global.css";
import { FC } from "react";

const App: FC = () => {
  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Список задач</h1>
        <div className={styles.app__wrapper}>
          <Header />
          <TodoList />
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "1.4rem",
          },
        }}
      />
    </>
  );
};

export default App;
