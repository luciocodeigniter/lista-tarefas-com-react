import './App.css';

// hooks
import { useState, useEffect } from 'react';

// icons
import { BsFillTrashFill, BsFillBookmarkCheckFill, BsFillBookmarkFill } from 'react-icons/bs';

// URL API
const URL_API = "http://localhost:5000";

function App() {

  /**
   * Definindo os states da aplicação
   */

  // titulo e duração da tarefa com string vazia inicialmente
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  // lista vazia onde serão inseridas as tarefas
  const [todos, setTodos] = useState([]);

  // apresentaremos para o user a mensagem de 'Loading...' enquanto os dados são carregados
  // e iniciamos como 'false', o que indica que a aplicação não está em 'loading...'
  const [loading, setLoading] = useState(false);


  // Carregamos as tarefas no on load da página
  useEffect(() => {

    const loadData = async () => {

      // iniciamos o loading...
      setLoading(true);

      // realizamos o fetch na API para recuperar as tarefas
      const todos = await fetch(URL_API + '/todos')
        .then((response) => response.json()) // tranformo em JSON
        .then((data) => data)
        .catch((error) => console.log(error)); // tratamento de erros

      // Não está mais carregando
      setLoading(false);

      // transforma o JSON em array
      setTodos(todos);
    };

    // invocamos a função
    loadData();

  }, []); // [] => array vazio indica para o useEffect que eu quero que ele seja executado quando a página carrega

  // Handle submit
  const handleSubmit = async (event) => {

    event.preventDefault();

    const objectTodo = {
      id: Math.random(),
      title,
      time,
      done: false
    };

    const created = await fetch(URL_API + '/todos', {
      method: 'POST',
      body: JSON.stringify(objectTodo),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());

    // Limpa o input => isso é o controlled input
    setTitle('');
    setTime('');

    // apresenta na lista o objeto que foi criado
    setTodos((prevState) => [...prevState, created]);

  }; // fim handleSubmit


  // handleDelete
  const handleDelete = async (id) => {

    await fetch(URL_API + '/todos/' + id, {
      method: 'DELETE'
    });

    // definimos na lista de tarefas apenas as cujo id sejam diferentes do id enviado para a deleção
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));

  }; // fim handleDelete


  // handleEdit
  const handleEdit = async (todo) => {

    // sempre recebe o contrário do status atual
    todo.done = !todo.done;

    const updated = await fetch(URL_API + '/todos/' + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // atualizamos a lista com o objeto que passou pela atualização
    setTodos((prevState) => prevState.map((oldTodo) => (oldTodo.id === updated.id ? (oldTodo = updated) : oldTodo)));


  }; // fim handleEdit

  // exibimos o texto 'Carregando' enquanto as coisas são 'preparadas' (rsrsrs)
  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Lista de Tarefas com React</h1>
      </div>
      <div className="form-todo">
        <h2>Criar tarefa</h2>
        <form onSubmit={handleSubmit}>

          <div className='form-control'>

            <label htmlFor='title'>O que você vai fazer?</label>
            <input type='text' name='title' value={title || ''} required placeholder='Título da tarefa' onChange={(event) => setTitle(event.target.value)} />

          </div>
          <div className='form-control'>

            <label htmlFor='time'>Duração da tarefa (horas)</label>
            <input type='number' name='time' value={time || ''} required placeholder='Duração da tarefa' onChange={(event) => setTime(event.target.value)} />

          </div>


          <input type='submit' value="Criar tarefa" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
            <p>Duração: {todo.time} horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsFillBookmarkCheckFill /> : <BsFillBookmarkFill />}
              </span>

              { /* temos que fazer com arrow function, pois dessa forma o react espera que seja clicado no elemento :) */}
              <BsFillTrashFill onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
