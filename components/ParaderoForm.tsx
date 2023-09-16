"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

const ParaderoForm = () => {
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const [InputParaderoValue, setInputParaderoValue] = useState("");
  const [ParaderoHistory, setParaderoHistory] = useState<string[]>([]);

  const [InputServicioValue, setInputServicioValue] = useState("");
  const [ServicioHistory, setServicioHistory] = useState<string[]>([]);

  // Obtener historial de valores del localStorage al cargar el componente
  useEffect(() => {
    const storedParaderoHistory = localStorage.getItem("ParaderoHistory");
    if (storedParaderoHistory) {
      setParaderoHistory(JSON.parse(storedParaderoHistory).slice(-5));
    }

    const storedServicioHistory = localStorage.getItem("ServicioHistory");
    if (storedServicioHistory) {
      setServicioHistory(JSON.parse(storedServicioHistory).slice(-5));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    const ruta = `${InputParaderoValue}/${InputServicioValue}`
    router.push(ruta);
    setLoading(true);
    // Agregar valor actual al historial de valores si no existe ya
    // Guardar nuevo historial de valores en el localStorage
    if (!ParaderoHistory.includes(InputParaderoValue)){
      setParaderoHistory([...ParaderoHistory.slice(-4), InputParaderoValue]);
      localStorage.setItem("ParaderoHistory", JSON.stringify([...ParaderoHistory.slice(-4), InputParaderoValue]));
    }

    if (!ServicioHistory.includes(InputServicioValue)){
      setServicioHistory([...ServicioHistory.slice(-4), InputServicioValue]);
      localStorage.setItem("ServicioHistory", JSON.stringify([...ServicioHistory.slice(-4), InputServicioValue]));
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
          value={InputParaderoValue}
          pattern="[a-zA-Z0-9]*"
          onChange={(event) => setInputParaderoValue(event.target.value)}
          /* Asociamos el datalist al input */
          list="ParaderoHistory"
        />
        <h2>Servicio (OPCIONAL)</h2>
        <input
          minLength={3}
          maxLength={6}
          className='form-control form-control-lg'
          type="text"
          placeholder='Ej: 210'
          /* Redefinimos el valor de la ruta */
          value={InputServicioValue}
          pattern="[a-zA-Z0-9]*"
          onChange={(event) => setInputServicioValue(event.target.value)}
          /* Asociamos el datalist al input */
          list="ServicioHistory"
        />

        {/* Advertencia en caso que no se respete el formato */}
        {(!/^[a-zA-Z0-9]*$/.test(InputParaderoValue) || !/^[a-zA-Z0-9]*$/.test(InputServicioValue)) && (
          <span className="text-danger fw-bold">Solo se permiten letras y números.</span>
        )}

        {/* Creamos el datalist con las opciones de historial */}
        <datalist id="ParaderoHistory">
          {ParaderoHistory.map((value, index) => <option key={index} value={value} />)}
        </datalist>
        <datalist id="ServicioHistory">
          {ServicioHistory.map((value, index) => <option key={index} value={value} />)}
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