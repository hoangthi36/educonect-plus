import { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react'
import { createInitialDemoState, DemoAction, demoReducer } from './demoReducer.js'

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialDemoState)
  const sequence = useRef(0)

  const send = useCallback((type, payload = {}) => {
    sequence.current += 1
    dispatch({
      type,
      eventId: `ui-${type.toLowerCase()}-${sequence.current}`,
      ...payload,
    })
  }, [])

  const setPersona = useCallback((personaId) => {
    dispatch({ type: DemoAction.SET_PERSONA, personaId })
  }, [])

  const resetDemo = useCallback(() => {
    sequence.current = 0
    dispatch({ type: DemoAction.RESET_DEMO })
  }, [])

  const value = useMemo(
    () => ({ state, send, setPersona, resetDemo }),
    [state, send, setPersona, resetDemo],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used inside DemoProvider')
  return value
}
