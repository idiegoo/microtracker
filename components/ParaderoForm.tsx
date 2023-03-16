"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

const ParaderoForm = () => {
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  // Obtener historial de valores del localStorage al cargar el componente
  useEffect(() => {
    const storedInputHistory = localStorage.getItem("inputHistory");
    if (storedInputHistory) {
      setInputHistory(JSON.parse(storedInputHistory).slice(-5));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    router.push(inputValue);
    setLoading(true);
    // Agregar valor actual al historial de valores si no existe ya
    if (!inputHistory.includes(inputValue)){
      setInputHistory([...inputHistory.slice(-4), inputValue]);
      // Guardar nuevo historial de valores en el localStorage
      localStorage.setItem("inputHistory", JSON.stringify([...inputHistory.slice(-4), inputValue]));
    }
  }

  return(
    <div className='p-5 text-center d-flex align-items-center flex-column'>
      <h1>Consulta paradero:</h1>
      <form className='w-50' onSubmit={handleSubmit}>
        <input required
          minLength={3}
          maxLength={7}
          className='form-control form-control-lg'
          type="text"
          placeholder='Ej: PF210'
          /* Redefinimos el valor de la ruta */
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          /* Asociamos el datalist al input */
          list="inputHistory"
        />
        {/* Creamos el datalist con las opciones de historial */}
        <datalist id="inputHistory">
          {inputHistory.map((value, index) => <option key={index} value={value} />)}
        </datalist>
        <button
          className='btn btn-primary btn-lg' type="submit"
        >Enviar</button>
      </form>
      <div className="d-flex justify-content-center m-3">
        {/* Loading state */}
        <div className="spinner-border" style={{visibility: loading ? "visible":"hidden"}} role="status"></div>
      </div>
    </div>
  )
};

export default ParaderoForm;