export function useScrollReveal() {
  if (import.meta.server) return

  onMounted(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const delay = (entry.target as HTMLElement).dataset.delay
            if (delay) {
              setTimeout(() => {
                entry.target.classList.add('revealed')
              }, Number.parseInt(delay) * 100)
            }
            else {
              entry.target.classList.add('revealed')
            }
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1 },
    )

    for (const el of elements) {
      observer.observe(el)
    }
  })
}
