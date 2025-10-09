---
title: Learning Data Fetch Library SWR - Creating a Simple Todo List
date: "2023-03-21T00:00:00Z"
description: "SWR Library Learning Record - Hands-on Experience"
tags: ["web", "study", "front"]
---

In the previous article, we introduced the basics of SWR. Next, we will implement SWR in a simple practical example.

# 1. Preliminary Work

We will create a very simple Todo List. The application has been built using Create React App with TypeScript, as covered in the previous article.

Install SWR

```bash
npm i swr
```

Install json-server in a separate folder

```bash
mkdir json-server-test && cd json-server-test
npm init -y
npm install json-server
```

Let's create a db.json file in the project's root directory. The contents will define a simple Todo list.

```json
{
  "todos": [
    {
      "id": 1,
      "content": "Learn React",
      "done": false
    },
    {
      "id": 2,
      "content": "Learn Redux",
      "done": false
    },
    {
      "id": 3,
      "content": "Learn React Native",
      "done": false
    }
  ]
}
```

Add the following scripts to the package.json file in the folder where json-server is installed. This will run json-server on port 5000.

```json
"scripts": {
  "start": "json-server --watch db.json --port 5000",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

Next, install axios. This library will be used to send requests to the server.

```bash
npm i axios
```

# 2. Configuring the Todo List

Now we will write the Todo List. First, delete the default files of CRA and start with the following content. Modify App.tsx as shown below.

```tsx
function TodoListPage() {
  return <div>TodoList</div>;
}

export default TodoListPage;
```

What does the Todo List need? Basic CRUD functionality seems sufficient.

## 2.1. Implementing Basic Components

We will set up the TodoListPage component at the top, managing the todo items within it. The editing functions will be structured to pass down to each item as individual components.

First, let's structure the TodoListPage component as follows.

```tsx
function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      content: "Learn React",
      done: false,
    },
    {
      id: 2,
      content: "Learn Redux",
      done: false,
    },
    {
      id: 3,
      content: "Learn React Native",
      done: false,
    },
  ]);

  return (
    <main>
      <h1>Todo List</h1>
      <TodoList todos={todos} setTodos={setTodos} />
      <TodoListForm addTodo={(todo) => setTodos([...todos, todo])} />
    </main>
  );
}
```

Next, we will create the TodoList component to display the todo items. This will be a simple unordered list.

```tsx
function TodoList({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          setTodo={(newTodo) => {
            setTodos(todos.map((td) => (td.id === newTodo.id ? newTodo : td)));
          }}
        />
      ))}
    </ul>
  );
}
```

Now we will structure the TodoListItem component. This component will display the todo item and allow editing of the 'done' status. It is structured with a list item tag.

```tsx
function TodoListItem({
  todo,
  setTodo,
}: {
  todo: Todo;
  setTodo: (todo: Todo) => void;
}) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => {
          setTodo({
            ...todo,
            done: !todo.done,
          });
        }}
      />
      {todo.content}
    </li>
  );
}
```

Next, we will create the TodoListForm component. This will allow the addition of todo items and is structured with a form tag.

```tsx
function TodoListForm({ addTodo }: { addTodo: (todo: Todo) => void }) {
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 4,
    content: "",
    done: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(newTodo);
    setNewTodo({
      id: newTodo.id + 1,
      content: "",
      done: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTodo.content}
        onChange={(e) => {
          setNewTodo({ ...newTodo, content: e.target.value });
        }}
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

Since the editing history can be managed within this component, the `newTodo` state for holding the content of the newly added item is kept within this component only. The `addTodo` function is received via props and used.

Now the create and read functionalities are implemented. This results in a basic todo list, albeit not visually appealing, as shown below.

![cr](./todolist-CR.png)

Now let's implement the update and delete functionalities.

## 2.2. Implementing Update and Delete Functionalities

The delete functionality can be implemented at the TodoListItem component level. First, we need to change the props that TodoListItem receives. The current name `setTodo` should be changed to `updateTodo`, and we will add a new prop `deleteTodo`.

```tsx
function TodoListItem({
  todo,
  updateTodo,
  deleteTodo,
}: {
  todo: Todo;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
}) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => {
          updateTodo({
            ...todo,
            done: !todo.done,
          });
        }}
      />
      {todo.content}
      <button onClick={() => deleteTodo(todo)}>Delete</button>
    </li>
  );
}
```

Next, we'll appropriately create the deleteTodo function in the TodoList component and pass it down.

```tsx
function TodoList({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          updateTodo={(newTodo) => {
            setTodos(todos.map((td) => (td.id === newTodo.id ? newTodo : td)));
          }}
          deleteTodo={(todo) => {
            setTodos(todos.filter((td) => td.id !== todo.id));
          }}
        />
      ))}
    </ul>
  );
}
```

Now the delete functionality has been implemented, resulting in the appearance of a delete button, which operates correctly.

![todoList-delete](./todolist-delete.png)

Implementing the update functionality is straightforward. Since the TodoListItem component already has the function to update todo items, we simply need to edit this component. We will add a state to indicate whether an item is being edited, and use this to conditionally render an input tag or a span tag.

```tsx
function TodoListItem({
  todo,
  updateTodo,
  deleteTodo,
}: {
  todo: Todo;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (todo: Todo) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => {
          updateTodo({
            ...todo,
            done: !todo.done,
          });
        }}
      />
      {isEditing ? (
        <input
          type="text"
          value={todo.content}
          onChange={(e) => {
            updateTodo({
              ...todo,
              content: e.target.value,
            });
          }}
        />
      ) : (
        <span>{todo.content}</span>
      )}
      <button onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? "Done" : "Edit"}
      </button>
      <button onClick={() => deleteTodo(todo)}>Delete</button>
    </li>
  );
}
```

Currently, there is a flaw in this code. The typical completion point for editing a todo item should be when the 'Done' button is pressed; however, in this implementation, pressing the edit button updates the content immediately. We will address this issue later during server communication.

# 3. Working with SWR

Now let's communicate with the server. We will use axios for this purpose.

The json-server data has been created earlier. Running `npm start` will execute the server at http://localhost:5000/todos. Now, let's communicate with this server.

## 3.1. Fetching Data from the Server

It is simple. We just need to create a fetcher function using axios and utilize the useSWR hook.

Fetcher function defined with axios:

```tsx
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
```

Testing the TodoListPage code to fetch data from the server using the useSWR hook:

```tsx
function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      content: "Learn React",
      done: false,
    },
    {
      id: 2,
      content: "Learn Redux",
      done: false,
    },
    {
      id: 3,
      content: "Learn React Native",
      done: false,
    },
  ]);

  const { data } = useSWR("http://localhost:5000/todos", fetcher);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <main>
      <h1>Todo List</h1>
      <TodoList todos={todos} setTodos={setTodos} />
      <TodoListForm addTodo={(todo) => setTodos([...todos, todo])} />
    </main>
  );
}
```

Upon initial loading, the `data` will be undefined, which will change to the fetched data from the server as observed in the console output.

## 3.2. Displaying TodoList with Server Data

Let's make a small modification to the Todo. It is challenging for json-server to handle auto-increment ids. Since managing that is not our goal, we will generate random ids during todo item creation.

First, let's update the Todo type and generate an id when adding a Todo.

```tsx
interface Todo {
  id: string;
  content: string;
  done: boolean;
}
```

Next, install the uuid library for generating random ids.

```bash
npm i uuid
```

By generating a random id, when adding a new todo item, the only requirement is the content. Let's update the TodoListForm component accordingly.

Initially, the editing functions for todo items were managed at the top-level TodoListPage component. However, since we can now directly send requests to the server for editing, we can avoid prop drilling. Thus, we'll keep the management of fetching server data in the TodoListPage component while allowing the respective components to handle their own editing functions.

The TodoListPage component then simplifies to:

```tsx
function TodoListPage() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/todos",
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <main>
      <h1>Todo List</h1>
      <TodoList todos={data} />
      <TodoListForm />
    </main>
  );
}
```

Next, we'll modify the TodoListForm component, which will now directly send requests to the server, eliminating the need for receiving the addTodo function via props. Instead, we will create a handleSubmit function to send the request to the server and use mutate to refresh the data.

```tsx
function TodoListForm() {
  const [newTodo, setNewTodo] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/todos", {
        id: uuidv4(),
        content: newTodo,
        done: false,
      })
      .then(() => {
        setNewTodo("");
        mutate("http://localhost:5000/todos");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => {
          setNewTodo(e.target.value);
        }}
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

The TodoList function will be updated to simply receive and render the TodoItem components as shown below, indicating that the setTodos prop has been removed.

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

The most modified TodoListItem component will look like this. This component will send requests to the server to update or delete a todo and use mutate to refresh the data.

```tsx
function TodoListItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTodoContent, setEditTodoContent] = useState<string>("");

  const completeTodo = () => {
    axios
      .patch(`http://localhost:5000/todos/${todo.id}`, {
        done: !todo.done,
      })
      .then(() => {
        mutate("http://localhost:5000/todos");
      });
  };

  const editTodo = () => {
    setIsEditing(true);
    setEditTodoContent(todo.content);
  };

  const saveTodo = () => {
    axios
      .patch(`http://localhost:5000/todos/${todo.id}`, {
        content: editTodoContent,
      })
      .then(() => {
        setIsEditing(false);
        setEditTodoContent("");
        mutate("http://localhost:5000/todos");
      });
  };

  const deleteTodo = () => {
    axios.delete(`http://localhost:5000/todos/${todo.id}`).then(() => {
      mutate("http://localhost:5000/todos");
    });
  };

  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={completeTodo} />
      {isEditing ? (
        <input
          type="text"
          value={editTodoContent}
          onChange={(e) => {
            setEditTodoContent(e.target.value);
          }}
        />
      ) : (
        <span>{todo.content}</span>
      )}
      <button onClick={isEditing ? saveTodo : editTodo}>
        {isEditing ? "Done" : "Edit"}
      </button>
      <button onClick={deleteTodo}>Delete</button>
    </li>
  );
}
```

Now, by running json-server and updating the todo list, we can verify that all functionalities work as expected. Additionally, refreshing the page retains the data, confirming that the edits are saved in the json-server.

# References

https://maliethy.github.io/posts/swr/

https://velog.io/@soryeongk/SWRBasic

Using json server https://redux-advanced.vlpt.us/3/01.html