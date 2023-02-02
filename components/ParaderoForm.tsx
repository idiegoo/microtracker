"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ParaderoForm = () => {
  const router = useRouter();
  const [route, setRoute] = useState("./")

  const handleSubmit = (e: React.FormEvent <HTMLFormElement>) => {
    e.preventDefault()
    router.push(route)
    console.log(route)
  }

  return(
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder='Ej: PF210'
        /* Redefinimos el valor de la ruta */
        onChange={(event) => setRoute(event.target.value)}
      />
      <button onClick={() => console.log(route)} type="submit">Enviar</button>
    </form>
  )
};

export default ParaderoForm;