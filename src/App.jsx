import Header from './components/Header'
import SideNav from './components/SideNav'
import PokeCard from './components/PokeCard'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CompareView from './components/CompareView'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(true)

  function handleToggleMenu() {
    setShowSideMenu(!showSideMenu)
  }

  function handleCloseMenu() {
    setShowSideMenu(true)
  }

  return (
    <BrowserRouter>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        handleCloseMenu={handleCloseMenu}
        showSideMenu={showSideMenu}
      />
      <Routes>
        <Route path="/" element={<PokeCard selectedPokemon={selectedPokemon} />} />
        <Route path="/compare" element={<CompareView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
