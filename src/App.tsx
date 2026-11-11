import { HashRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Visualizer } from './pages/Visualizer'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizador/:id" element={<Visualizer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}
