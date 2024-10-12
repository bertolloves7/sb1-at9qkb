import React, { useState } from 'react';
import { Send } from 'lucide-react';

function App() {
  const [status, setStatus] = useState('');

  const extractProfile = async () => {
    setStatus('Extrayendo datos...');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id!, { action: 'extractProfile' });
      
      if (response.success) {
        setStatus('Datos extraídos. Enviando al endpoint...');
        
        const formData = new FormData();
        formData.append('curriculum_text', response.data);

        const fetchResponse = await fetch('http://127.0.0.1:8000/curriculum/', {
          method: 'POST',
          body: formData
        });

        if (fetchResponse.ok) {
          setStatus('Datos enviados con éxito!');
        } else {
          setStatus('Error al enviar datos: ' + fetchResponse.statusText);
        }
      } else {
        setStatus('Error al extraer datos: ' + response.error);
      }
    } catch (error) {
      setStatus('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="w-64 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">LinkedIn Profile Extractor</h1>
      <button
        onClick={extractProfile}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      >
        <Send className="mr-2" size={18} />
        Extraer y Enviar Perfil
      </button>
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}

export default App;