'use client'

import { DependencyList, useMemo } from 'react'

export type UseTextEditorDataProps = { wordsPerMinute?: number; onChange?: (data: TextEditorDataReturn) => void }
export type TextEditorDataReturn = { readTime: number; wordCount: number; characterCount: number }

export function useTextEditorData(
  content: string | undefined,
  props: UseTextEditorDataProps = {},
  deps: DependencyList = []
): TextEditorDataReturn {
  const { wordsPerMinute = 200, onChange } = props

  const textContent = content ?? ''

  const data = useMemo(() => {
    const text = textContent.replaceAll(/<[^>]*>?/gm, '')
    const wordCount = text.trim().split(/\s+/).length
    const characterCount = text.replaceAll(/\s+/g, '').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)

    onChange?.({ readTime, wordCount, characterCount })

    return { readTime, wordCount, characterCount }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return data
}

export type ExtractHeadingsFromHtmlSection = {
  text: string
  id: string
  type: string
  sub?: ExtractHeadingsFromHtmlSection[]
}
export type ExtractHeadingsFromHtmlReturn = { updatedContent: string; sections: ExtractHeadingsFromHtmlSection[] }
export function useExtractHeadingsFromHtml(
  content: string,
  props: { maxDepth?: number; includeLists?: boolean } = {}
): ExtractHeadingsFromHtmlReturn {
  const { maxDepth = 2, includeLists = true } = props

  const headings: { level: number; text: string; id: string; type: string }[] = []
  const usedIds = new Set<string>()

  const regex = includeLists ? /<(h[1-6]|li)([^>]*)>((?:(?!<ul|<ol).)*?)<\/\1>/gi : /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi

  const updatedContent = content.replace(regex, (match, tag, attrs, text) => {
    const isLi = tag.toLowerCase() === 'li'
    const level = isLi ? 7 : Number.parseInt(tag.replace(/^h/i, ''), 10)
    const cleanText = text.replaceAll(/<[^>]*>/g, '').trim()

    const idMatch = attrs.match(/id=["']([^"']*)["']/)

    let id = cleanText
      .toLowerCase()
      .replaceAll(/[^\w\s-]/g, '')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/^-+|-+$/g, '')
    if (idMatch) id = idMatch[1]

    if (!id) id = `section-${Math.random().toString(36).slice(2, 11)}`

    let uniqueId = id
    let counter = 1
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`
      counter++
    }
    usedIds.add(uniqueId)
    id = uniqueId

    if (id !== idMatch?.[1]) {
      if (idMatch) attrs = attrs.replace(/id=["'][^"']*["']/, `id="${id}"`)
      else attrs = ` id="${id}"${attrs}`
    }

    headings.push({ level, text: cleanText, id, type: tag.toLowerCase() })

    return `<${tag}${attrs}>${text}</${tag}>`
  })

  if (headings.length === 0) return { updatedContent, sections: [] }

  const buildTree = (items: typeof headings) => {
    const roots: ExtractHeadingsFromHtmlSection[] = []
    const stack: { section: ExtractHeadingsFromHtmlSection; level: number }[] = []

    items.forEach((item) => {
      const node: ExtractHeadingsFromHtmlSection = { text: item.text, id: item.id, type: item.type }

      if (stack.length === 0) {
        roots.push(node)
        stack.push({ section: node, level: item.level })
        return
      }

      while (stack.length > 0 && item.level <= stack[stack.length - 1].level) {
        stack.pop()
      }

      if (stack.length === 0) {
        roots.push(node)
        stack.push({ section: node, level: item.level })
      } else {
        const parent = stack[stack.length - 1]

        if (stack.length < maxDepth) {
          parent.section.sub ??= []
          parent.section.sub.push(node)
          stack.push({ section: node, level: item.level })
        }
      }
    })

    return roots
  }

  return { updatedContent, sections: buildTree(headings) }
}
