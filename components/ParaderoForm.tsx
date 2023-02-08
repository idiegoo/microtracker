"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

const ParaderoForm = () => {
  // Loading (temporal)
  const [loading, setLoading] = useState(false)
  // Ruta
  const router = useRouter();
  const [route, setRoute] = useState("")

  const handleSubmit = (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault()
    router.push(route)
    console.log(route)
    setLoading(true)
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
          onChange={(event) => setRoute(event.target.value)}
        />
        <button
          className='btn btn-primary btn-lg' type="submit"
        >Enviar</button>
      </form>
      <div className="d-flex justify-content-center m-3">
        {/* Loading state */}
        <div className="spinner-border" style={{visibility: loading ? "visible":"hidden"}} role="status"></div>
      </div>
      <div>
      </div>
    </div>
  )
};

export default ParaderoForm;
