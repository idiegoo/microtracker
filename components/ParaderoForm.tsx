"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

const ParaderoForm = () => {
  const router = useRouter();

  const [route, setRoute] = useState("")

  const handleSubmit = (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault()
    router.push(route)
    console.log(route)
  }

  return(
    <main>
      <h1>Consulta paradero:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Ej: PF210'
          /* Redefinimos el valor de la ruta */
          onChange={(event) => setRoute(event.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  )
};

export default ParaderoForm;
