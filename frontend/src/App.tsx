import React from 'react'; 

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/*Header*/}
      <header className="text-3xl font-bold mb-8 text-indigo-700">
        Collaborative Whiteboard
      </header>
      {/*Placeholder of canvas Area*/}
      <main className="w-full max-w-4xl h-96 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-xl">
        <p className="text-gray-500 text-lg">
          Canvas Area Placeholder - (ready for drawing logic)
        </p>
      </main>

      {/* Footer/Status */}
      <footer className='mt-8 text-sm text-gray-500'>
        Status :Disconnected (BackendAPI : http://localhost:3001/health )
      </footer>
    </div>
  );
}

export default App
