"use client"

import { useEffect, useRef, type RefObject } from "react"

type KeyCombo = string
type KeyHandler = (event: KeyboardEvent) => void
type KeyMap = [KeyCombo, KeyHandler][]

export function useHotkeys(keyMap: KeyMap, ref?: RefObject<HTMLElement>) {
  const keyMapRef = useRef<KeyMap>(keyMap)

  // Update ref when keyMap changes
  useEffect(() => {
    keyMapRef.current = keyMap
  }, [keyMap])

  useEffect(() => {
    const targetElement = ref?.current || document

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, altKey, shiftKey } = event

      for (const [keyCombo, handler] of keyMapRef.current) {
        const parts = keyCombo.toLowerCase().split("+")
        const keyPart = parts.pop() as string

        // Check if the key matches
        const keyMatches = key.toLowerCase() === keyPart.toLowerCase()
        if (!keyMatches) continue

        // Check if modifiers match
        const needCtrl = parts.includes("ctrl")
        const needMeta = parts.includes("meta") || parts.includes("cmd") || parts.includes("mod")
        const needAlt = parts.includes("alt")
        const needShift = parts.includes("shift")

        // On Mac, "mod" means Command key, elsewhere it means Control key
        const modKeyPressed = navigator.platform.includes("Mac") ? metaKey : ctrlKey

        if (
          (needCtrl ? ctrlKey : true) &&
          (needMeta || parts.includes("mod") ? modKeyPressed : true) &&
          (needAlt ? altKey : true) &&
          (needShift ? shiftKey : true)
        ) {
          event.preventDefault()
          handler(event)
          break
        }
      }
    }

    targetElement.addEventListener("keydown", handleKeyDown as EventListener)
    return () => {
      targetElement.removeEventListener("keydown", handleKeyDown as EventListener)
    }
  }, [ref])
}
